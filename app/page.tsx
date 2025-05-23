"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useSimulationStore } from "./stores/simulationStore";
import Character from "./components/Character";
import Loading from "./components/Loading";
import EnvironmentModel from "./components/Environment";
import Scene from "./components/Scene";

// const visemes = [
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

export default function Home() {
  const {
    characters,
    environmentId,
    setCharacters,
    setCharacterSpeaking,
    setEnvironmentId,
  } = useSimulationStore();
  const [, setIsSending] = useState(false);

  const sendMessage = async (
    characterId: string,
    message: string,
    sessionId: string
  ) => {
    setIsSending(true);
    const personalityId = characterId.split("_")[1];
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personalityId, message, sessionId }),
      });

      const data = await res.json();

      window.parent.postMessage(
        {
          type: "CHAT",
          payload: {
            from: "AI",
            message: data.message,
            characterId,
          },
        },
        "*"
      );
      console.log("data:", data);
      setCharacterSpeaking(characterId, data.visemes);

      const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
      audio.play();
    } catch (error) {
      console.error(error);
      window.parent.postMessage({
        type: "CHAT_ERROR",
        payload: {
          error: error,
        },
      });
    } finally {
      setIsSending(false);
    }
  };

  // // Temporary initialization
  // useEffect(() => {
  //   setEnvironmentId("1");
  //   setCharacters([
  //     {
  //       characterId: "1_1",
  //       visemes: [],
  //       isSpeaking: false,
  //     },
  //   ]);
  // }, []);

  // Add event listener for postMessage from parent window
  useEffect(() => {
    const handlePostMessage = (event: MessageEvent) => {
      // Ensure the message is from a trusted source
      // if (event.origin !== "https://trusted-parent-domain.com") return;
      const { type, payload } = event.data;

      // Handle simualation initialization
      if (type === "INITIALIZE_SIMULATION") {
        console.log("Received message from parent:", payload);
        // payload.characterIds is an array of avatarId + _ + personalityId
        // payload.environmentId is the environment id
        const characters = payload.characterIds.map((characterId: string) => {
          return {
            characterId,
            visemes: [],
            isSpeaking: false,
          };
        });
        setCharacters(characters);
        setEnvironmentId(payload.environmentId);

        window.parent.postMessage({
          type: "SIMULATION_INITIALIZED",
          payload: {},
        });
      }
      // Handle chat message
      if (type === "CHAT") {
        console.log("Received message from parent:", payload);
        // payload.characterId is avatarId + _ + personalityId
        // payload.message is the message to be sent
        // payload.sessionId is the session id same id as the simulationId
        window.parent.postMessage(
          {
            type: "CHAT",
            payload: {
              from: "USER",
              message: payload.message,
            },
          },
          "*"
        );
        sendMessage(payload.characterId, payload.message, payload.sessionId);
      }
    };

    window.addEventListener("message", handlePostMessage);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("message", handlePostMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Canvas
          camera={{ position: [0, 0.8, 2], fov: 40 }}
          shadows
          gl={{ antialias: true }}
        >
          {/* Helper for debugging */}
          {/* <Helpers /> */}

          {/* Lights and Environment */}
          <Scene />

          <Suspense fallback={<Loading />}>
            {/* Environment */}
            <EnvironmentModel environmentId={environmentId} />
            {/* Avatar */}
            {characters.map((character) => {
              return (
                <Character
                  key={character.characterId}
                  characterId={character.characterId}
                  visemes={character.visemes}
                  isSpeaking={character.isSpeaking}
                />
              );
            })}
          </Suspense>
        </Canvas>
      </div>
    </main>
  );
}
