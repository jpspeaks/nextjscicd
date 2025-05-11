// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import { useGLTF } from "@react-three/drei";

export function OfficeModel(props) {
  const { nodes, materials } = useGLTF("/models/office.glb");
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.353}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <group
            rotation={[-Math.PI / 2, Math.PI / 2, 0]}
            scale={[410, 1230, 410]}
          >
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Minimalistic_Modern_Office_Glass_0.geometry}
              material={materials.Glass}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Minimalistic_Modern_Office_Structure_0.geometry}
              material={materials.Structure}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Minimalistic_Modern_Office_Background_0.geometry}
              material={materials.Background}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Minimalistic_Modern_Office_Table_0.geometry}
              material={materials.Table}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Minimalistic_Modern_Office_Chair_0.geometry}
              material={materials.Chair}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Minimalistic_Modern_Office_Plants_0.geometry}
              material={materials.Plants}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Minimalistic_Modern_Office_Plants_0_1.geometry}
              material={materials.Plants}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Minimalistic_Modern_Office_Lights_0.geometry}
              material={materials.Lights}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={
                nodes.Minimalistic_Modern_Office_LightEmission_0.geometry
              }
              material={materials.LightEmission}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Carpet_Carpet_0.geometry}
              material={materials.Carpet}
              position={[1.001, 0, 2.439]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[1.39, 0.463, 1.39]}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/office.glb");

export default OfficeModel;
