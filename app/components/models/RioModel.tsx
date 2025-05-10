// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useModelLipsync } from "@/app/hooks/useModelLipsync";

export function RioModel(props) {
  const { visemes = [], isSpeaking = false, ...restProps } = props;
  const group = useRef();

  const { nodes, materials, animations } = useGLTF("/models/rio.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    actions["avaturn_animation"].play();
  }, [actions]);

  useModelLipsync({
    visemes,
    isSpeaking,
    nodes,
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

useGLTF.preload("/models/rio.glb");

export default RioModel;
