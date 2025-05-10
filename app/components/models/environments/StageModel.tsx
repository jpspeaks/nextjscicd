// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import { useGLTF } from "@react-three/drei";

export function StageModel(props) {
  const { nodes, materials } = useGLTF("/models/stage.glb");
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.027}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[113.068, 82.238, 3.504]}>
            <group position={[-300.154, -185.545, 67.414]}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_2_Mat2_0.geometry}
                material={materials["Mat.2"]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_2_Mat2_0_1.geometry}
                material={materials["Mat.2_0"]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_2_Mat_0.geometry}
                material={materials.material}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_2_Mat4_0.geometry}
                material={materials["Mat.4"]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_2_Mat4_0_1.geometry}
                material={materials["Mat.4_0"]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_2_Mat4_0_2.geometry}
                material={materials["Mat.4_1"]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_2_Mat4_0_3.geometry}
                material={materials["Mat.4_2"]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_2_Mat5_0.geometry}
                material={materials["Mat.5"]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_2_Mat4_0_4.geometry}
                material={materials["Mat.4_3"]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_2__0.geometry}
                material={materials.Bar_2__0}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_2_Mat4_0_5.geometry}
                material={materials["Mat.4_4"]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_2_Mat1_0.geometry}
                material={materials["Mat.1"]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_2_Mat6_0.geometry}
                material={materials["Mat.6"]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_2_Mat3_0.geometry}
                material={materials["Mat.3"]}
              />
            </group>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.tube_3_Mat7_0.geometry}
              material={materials["Mat.7"]}
              position={[237.343, 46.386, 174.629]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.tube_2_Mat7_0.geometry}
              material={materials["Mat.7"]}
              position={[-85.877, 46.386, 174.629]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.tube_1_Mat7_0.geometry}
              material={materials["Mat.7"]}
              position={[234.565, 46.386, -208.335]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.tube_Mat7_0.geometry}
              material={materials["Mat.7"]}
              position={[-85.877, 46.386, -208.335]}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/stage.glb");
export default StageModel;
