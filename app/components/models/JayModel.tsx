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
  15: "viseme_sil",
};

export function JayModel(props) {
  const { visemeData, ...restProps } = props;
  const group = useRef();
  const startTime = useRef(performance.now());

  const { nodes, materials, animations } = useGLTF("/models/jay.glb");
  useAnimations(animations, group);

  const blinkTimer = useRef(0);
  const lastBlinkTime = useRef(0);
  const headBone = nodes?.Head || nodes?.head || null;

  useEffect(() => {
    if (visemeData && visemeData.length > 0) {
      startTime.current = performance.now();
    }

    // 🧠 Lower both arms into rest position
    const bonesToAdjust = [
      { name: "LeftUpperArm", axis: "z", angle: Math.PI / 3 },
      { name: "RightUpperArm", axis: "z", angle: -Math.PI / 3 },
      { name: "LeftLowerArm", axis: "z", angle: Math.PI / 4 },
      { name: "RightLowerArm", axis: "z", angle: -Math.PI / 4 },
    ];

    bonesToAdjust.forEach(({ name, axis, angle }) => {
      const bone = nodes[name];
      if (bone && bone.rotation) {
        bone.rotation[axis] = angle;
      }
    });
  }, [visemeData]);

  useFrame((_, delta) => {
    const elapsed = performance.now() - startTime.current;

    // ✅ Lip sync (Head, Teeth, Tongue)
    const activeViseme = visemeData.findLast(
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

    // 👁 Eye blinking
    blinkTimer.current += delta;
    if (blinkTimer.current - lastBlinkTime.current > 3 + Math.random() * 2) {
      const eyeMeshes = [nodes.Eye_Mesh, nodes.EyeAO_Mesh, nodes.Eyelash_Mesh];

      eyeMeshes.forEach((mesh) => {
        const dict = mesh?.morphTargetDictionary;
        const influences = mesh?.morphTargetInfluences;

        if (!dict || !influences) return;

        const leftIndex = dict.eyeBlinkLeft;
        const rightIndex = dict.eyeBlinkRight;
        const closedIndex = dict.eyesClosed;

        if (leftIndex !== undefined && rightIndex !== undefined) {
          influences[leftIndex] = 1;
          influences[rightIndex] = 1;
          setTimeout(() => {
            influences[leftIndex] = 0;
            influences[rightIndex] = 0;
          }, 150);
        } else if (closedIndex !== undefined) {
          influences[closedIndex] = 1;
          setTimeout(() => {
            influences[closedIndex] = 0;
          }, 150);
        }
      });

      lastBlinkTime.current = blinkTimer.current;
    }

    // 🧠 Subtle idle head movement
    if (headBone) {
      headBone.rotation.y = Math.sin(elapsed / 1000) * 0.05;
      headBone.rotation.x = Math.sin(elapsed / 2500) * 0.02;
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
