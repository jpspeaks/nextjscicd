import React, { lazy } from "react";
import { useGsapCameraAnimation } from "../hooks/useAnimateCamera";
import * as THREE from "three";

const modelMap = {
  OfficeModel: lazy(() => import("./models/environments/OfficeModel")),
  StageModel: lazy(() => import("./models/environments/StageModel")),
};

const environments = [
  {
    id: "1",
    model: "OfficeModel",
    position: [0, 1.3, -5],
    scale: 0.9,
    rotation: [0, -1.56, 0],
  },
  {
    id: "2",
    model: "StageModel",
    position: [-2.1, 1.243, 0],
    scale: 0.4,
    rotation: [0, 0, 0],
  },
];

function Environment({ environmentId }: { environmentId: string }) {
  // Find the selected environment or use default
  const { model, position, scale, rotation } = environments.find(
    (env) => env.id === environmentId
  ) || {
    model: "",
    position: [0, 0, 0],
    scale: 0,
    rotation: 0,
  };

  const EnvironmentModel = modelMap[model as keyof typeof modelMap];

  useGsapCameraAnimation({
    start: new THREE.Vector3(4, 1, 5), // Start position (from Right)
    // start: new THREE.Vector3(0, 1.8, 1.3), // Focus straight to Character
    end: new THREE.Vector3(0, 1.8, 1.3), // End position (to Center)
    lookAt: new THREE.Vector3(0, 1.6, 0), // final position of camera
    duration: 3, // 3-second animation
    runAnimation: !!EnvironmentModel, // run animation if environment model is fully rendered
  });

  return EnvironmentModel ? (
    <EnvironmentModel position={position} scale={scale} rotation={rotation} />
  ) : null;
}

export default Environment;
