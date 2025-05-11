// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Viseme } from "../stores/simulationStore";

const visemeToBlendshape: Record<number, string> = {
  0: "viseme_sil",
  1: "viseme_PP",
  2: "viseme_FF",
  3: "viseme_TH",
  4: "viseme_DD",
  5: "viseme_kk",
  6: "viseme_CH",
  7: "viseme_SS",
  8: "viseme_nn",
  9: "viseme_RR",
  10: "viseme_aa",
  11: "viseme_E",
  12: "viseme_I",
  13: "viseme_O",
  14: "viseme_U",
  15: "viseme_sil",
};

export function useModelLipsync({
  visemes,
  isSpeaking,
  nodes,
}: {
  visemes: Viseme[];
  isSpeaking: boolean;
  nodes: Record<string, unknown>;
}) {
  const isSpeakingRef = useRef(isSpeaking);
  const startTime = useRef(performance.now());
  const currentVisemeIndexRef = useRef(0);
  const currentInfluencesRef = useRef<Record<string, number>>({});

  // Keep ref in sync
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // Reset when new visemes arrive
  useEffect(() => {
    if (!visemes.length) return;
    startTime.current = performance.now();
    currentVisemeIndexRef.current = 0;
    // initialize all viseme channels
    Object.values(visemeToBlendshape).forEach((name) => {
      currentInfluencesRef.current[name] = name === "viseme_sil" ? 1 : 0;
    });
  }, [visemes]);

  useFrame(() => {
    if (!isSpeakingRef.current || !visemes.length) return;

    const elapsedMs = performance.now() - startTime.current;
    let idx = currentVisemeIndexRef.current;

    // Advance to next viseme if time passed
    while (
      idx < visemes.length - 1 &&
      elapsedMs >= visemes[idx + 1].audioOffset / 10000
    ) {
      idx++;
    }
    currentVisemeIndexRef.current = idx;

    const current = visemes[idx];
    const next = visemes[idx + 1] || null;

    // t between current → next
    let t = 0;
    if (next) {
      const t0 = current.audioOffset / 10000;
      const t1 = next.audioOffset / 10000;
      t = Math.max(0, Math.min(1, (elapsedMs / 1000 - t0) / (t1 - t0)));
    }

    // build targetInfluences for this frame
    const targetInfluences: Record<string, number> = {};
    Object.values(visemeToBlendshape).forEach((name) => {
      targetInfluences[name] = 0;
    });

    const name0 = visemeToBlendshape[current.visemeId];
    targetInfluences[name0] = next ? 1 - t : 1;

    if (next) {
      const name1 = visemeToBlendshape[next.visemeId];
      targetInfluences[name1] = t;
    }

    // smooth lerp into currentInfluencesRef
    const smoothing = 0.1;
    for (const name of Object.keys(targetInfluences)) {
      const cur = currentInfluencesRef.current[name] ?? 0;
      const tgt = targetInfluences[name];
      currentInfluencesRef.current[name] = cur + (tgt - cur) * smoothing;
    }

    // *** APPLY only on mouth meshes ***
    const mouthKeys = ["Head_Mesh", "Teeth_Mesh", "Tongue_Mesh"];
    mouthKeys.forEach((key) => {
      const mesh = nodes[key];
      if (!mesh) return;
      const dict = mesh.morphTargetDictionary as Record<string, number>;
      const inf = mesh.morphTargetInfluences as number[];

      // clear only viseme targets
      Object.keys(dict)
        .filter((n) => n.startsWith("viseme_"))
        .forEach((n) => {
          inf[dict[n]] = 0;
        });

      // apply our smoothed values
      for (const [name, val] of Object.entries(currentInfluencesRef.current)) {
        const i = dict[name];
        if (i !== undefined) inf[i] = val;
      }
    });
  });
}
