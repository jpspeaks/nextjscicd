import { Environment } from "@react-three/drei";
import React from "react";

function Scene() {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 4, 2]} intensity={1} castShadow />
      {/* Environment map for nice lighting */}
      <Environment preset="sunset" />
    </>
  );
}

export default Scene;
