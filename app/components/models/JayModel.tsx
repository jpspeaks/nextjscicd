// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

// Viseme ID → blendshape names
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
  15: "viseme_sil", // fallback
};

export function JayModel(props) {
  const { visemes = [], isSpeaking = false, ...restProps } = props;
  const isSpeakingRef = useRef(isSpeaking);
  const group = useRef();
  const startTime = useRef(performance.now());

  const { nodes, materials, animations } = useGLTF("/models/jay.glb");
  const { actions } = useAnimations(animations, group);

  // Start built-in Avaturn animation
  useEffect(() => {
    actions["avaturn_animation"]?.play();
  }, [actions]);

  // Update ref when props change
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  // Reset timer when visemes changes
  useEffect(() => {
    if (visemes.length > 0) {
      startTime.current = performance.now();
    }
  }, [visemes, isSpeaking]);

  // Apply viseme animation
  useFrame(() => {
    if (!isSpeakingRef.current || visemes.length === 0) return;

    const elapsed = performance.now() - startTime.current;
    const activeViseme = visemes.findLast(
      (v) => v.audioOffset / 10000 <= elapsed
    );

    const meshes = [nodes.Head_Mesh, nodes.Teeth_Mesh, nodes.Tongue_Mesh];

    for (const mesh of meshes) {
      const dict = mesh?.morphTargetDictionary;
      const influences = mesh?.morphTargetInfluences;
      if (!dict || !influences) continue;

      for (let i = 0; i < influences.length; i++) influences[i] = 0;

      if (activeViseme) {
        const morphName = visemeToBlendshape[activeViseme.visemeId];
        const index = dict[morphName];
        if (index !== undefined) {
          influences[index] = 1;
        }
      }
    }
  });

  return (
    <group ref={group} {...restProps} dispose={null}>
      <group name="Scene">
        <group name="Armature">
          <primitive object={nodes.Hips} />
          <skinnedMesh
            name="Body_Mesh"
            geometry={nodes.Body_Mesh.geometry}
            material={materials.Body}
            skeleton={nodes.Body_Mesh.skeleton}
          />
          <skinnedMesh
            name="Eye_Mesh"
            geometry={nodes.Eye_Mesh.geometry}
            material={materials.Eyes}
            skeleton={nodes.Eye_Mesh.skeleton}
            morphTargetDictionary={nodes.Eye_Mesh.morphTargetDictionary}
            morphTargetInfluences={nodes.Eye_Mesh.morphTargetInfluences}
          />
          <skinnedMesh
            name="EyeAO_Mesh"
            geometry={nodes.EyeAO_Mesh.geometry}
            material={materials.EyeAO}
            skeleton={nodes.EyeAO_Mesh.skeleton}
            morphTargetDictionary={nodes.EyeAO_Mesh.morphTargetDictionary}
            morphTargetInfluences={nodes.EyeAO_Mesh.morphTargetInfluences}
          />
          <skinnedMesh
            name="Eyelash_Mesh"
            geometry={nodes.Eyelash_Mesh.geometry}
            material={materials.Eyelash}
            skeleton={nodes.Eyelash_Mesh.skeleton}
            morphTargetDictionary={nodes.Eyelash_Mesh.morphTargetDictionary}
            morphTargetInfluences={nodes.Eyelash_Mesh.morphTargetInfluences}
          />
          <skinnedMesh
            name="Head_Mesh"
            geometry={nodes.Head_Mesh.geometry}
            material={materials.Head}
            skeleton={nodes.Head_Mesh.skeleton}
            morphTargetDictionary={nodes.Head_Mesh.morphTargetDictionary}
            morphTargetInfluences={nodes.Head_Mesh.morphTargetInfluences}
          />
          <skinnedMesh
            name="Teeth_Mesh"
            geometry={nodes.Teeth_Mesh.geometry}
            material={materials.Teeth}
            skeleton={nodes.Teeth_Mesh.skeleton}
            morphTargetDictionary={nodes.Teeth_Mesh.morphTargetDictionary}
            morphTargetInfluences={nodes.Teeth_Mesh.morphTargetInfluences}
          />
          <skinnedMesh
            name="Tongue_Mesh"
            geometry={nodes.Tongue_Mesh.geometry}
            material={materials.Teeth}
            skeleton={nodes.Tongue_Mesh.skeleton}
            morphTargetDictionary={nodes.Tongue_Mesh.morphTargetDictionary}
            morphTargetInfluences={nodes.Tongue_Mesh.morphTargetInfluences}
          />
          <skinnedMesh
            name="avaturn_hair_0"
            geometry={nodes.avaturn_hair_0.geometry}
            material={materials.avaturn_hair_0_material}
            skeleton={nodes.avaturn_hair_0.skeleton}
          />
          <skinnedMesh
            name="avaturn_hair_1"
            geometry={nodes.avaturn_hair_1.geometry}
            material={materials.avaturn_hair_1_material}
            skeleton={nodes.avaturn_hair_1.skeleton}
          />
          <skinnedMesh
            name="avaturn_shoes_0"
            geometry={nodes.avaturn_shoes_0.geometry}
            material={materials.avaturn_shoes_0_material}
            skeleton={nodes.avaturn_shoes_0.skeleton}
          />
          <skinnedMesh
            name="avaturn_look_0"
            geometry={nodes.avaturn_look_0.geometry}
            material={materials.avaturn_look_0_material}
            skeleton={nodes.avaturn_look_0.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/jay.glb");

export default JayModel;
