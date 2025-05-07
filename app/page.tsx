"use client";

import Chat from "./components/Chat";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { JayModel } from "./components/models/JayModel";
import { useState } from "react";

export default function Home() {
  const [visemeData, setVisemeData] = useState<unknown[]>([]);
  const handleReply = (data: {
    text: string;
    visemes: number[];
    audioBase64: string;
  }) => {
    setVisemeData(data.visemes);
    const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
    audio.play();
  };
  // ✅ Sample Azure-style viseme data (replace with real response)
  // const visemeData = [
  //   {
  //     visemeId: 0,
  //     audioOffset: 500000,
  //   },
  //   {
  //     visemeId: 12,
  //     audioOffset: 1000000,
  //   },
  //   {
  //     visemeId: 4,
  //     audioOffset: 2125000,
  //   },
  //   {
  //     visemeId: 14,
  //     audioOffset: 2750000,
  //   },
  //   {
  //     visemeId: 8,
  //     audioOffset: 3625000,
  //   },
  //   {
  //     visemeId: 4,
  //     audioOffset: 5250000,
  //   },
  //   {
  //     visemeId: 0,
  //     audioOffset: 6870000,
  //   },
  //   {
  //     visemeId: 0,
  //     audioOffset: 14500000,
  //   },
  //   {
  //     visemeId: 12,
  //     audioOffset: 15000000,
  //   },
  //   {
  //     visemeId: 9,
  //     audioOffset: 16125000,
  //   },
  //   {
  //     visemeId: 20,
  //     audioOffset: 17250000,
  //   },
  //   {
  //     visemeId: 1,
  //     audioOffset: 17875000,
  //   },
  //   {
  //     visemeId: 19,
  //     audioOffset: 18125000,
  //   },
  //   {
  //     visemeId: 11,
  //     audioOffset: 18625000,
  //   },
  //   {
  //     visemeId: 1,
  //     audioOffset: 20000000,
  //   },
  //   {
  //     visemeId: 15,
  //     audioOffset: 20875000,
  //   },
  //   {
  //     visemeId: 6,
  //     audioOffset: 21625000,
  //   },
  //   {
  //     visemeId: 15,
  //     audioOffset: 22625000,
  //   },
  //   {
  //     visemeId: 19,
  //     audioOffset: 23250000,
  //   },
  //   {
  //     visemeId: 6,
  //     audioOffset: 23875000,
  //   },
  //   {
  //     visemeId: 7,
  //     audioOffset: 24375000,
  //   },
  //   {
  //     visemeId: 19,
  //     audioOffset: 24875000,
  //   },
  //   {
  //     visemeId: 4,
  //     audioOffset: 25500000,
  //   },
  //   {
  //     visemeId: 19,
  //     audioOffset: 25875000,
  //   },
  //   {
  //     visemeId: 4,
  //     audioOffset: 26500000,
  //   },
  //   {
  //     visemeId: 6,
  //     audioOffset: 27937500,
  //   },
  //   {
  //     visemeId: 0,
  //     audioOffset: 29370000,
  //   },
  // ];

  return (
    <main style={{ padding: 24 }}>
      <Chat onReply={handleReply} />
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas
          camera={{ position: [0, 1, 2.5], fov: 40 }}
          shadows
          gl={{ antialias: true }}
        >
          {/* Lights */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[2, 4, 2]} intensity={1} castShadow />

          {/* Environment map for nice lighting */}
          <Environment preset="sunset" />

          {/* Avatar */}
          <JayModel
            scale={1}
            position={[0, -1.1, 1]}
            rotation={[0, 0, 0]}
            visemeData={visemeData}
          />

          {/* Orbit controls for dragging/zooming the view */}
          <OrbitControls enablePan={false} />
        </Canvas>
      </div>
    </main>
  );
}
