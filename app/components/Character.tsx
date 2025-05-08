import React, { lazy } from "react";
import { Viseme } from "../stores/simulationStore";

const modelMap = {
  JayModel: lazy(() => import("./models/JayModel")),
};

const avatars = [
  {
    id: "1",
    model: "JayModel",
  },
];

function Character({
  characterId,
  visemes,
  isSpeaking,
}: {
  characterId: string;
  visemes: Viseme[];
  isSpeaking: boolean;
}) {
  const avatarId = characterId.split("_")[0];
  const model = avatars.find((avatar) => avatar.id === avatarId)?.model;
  const Avatar = modelMap[model as keyof typeof modelMap];

  return Avatar ? (
    <Avatar
      scale={1}
      position={[0, -1.1, 1]}
      rotation={[0, 0, 0]}
      visemes={visemes}
      isSpeaking={isSpeaking}
    />
  ) : null;
}

export default Character;
