import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { gsap } from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

export function useGsapCameraAnimation({
  start = new THREE.Vector3(10, 2, 0),
  end = new THREE.Vector3(2, 1, 2),
  lookAt = new THREE.Vector3(0, 10, 0),
  duration = 3,
  ease = "power2.inOut",
  runAnimation = false,
}: {
  start?: THREE.Vector3;
  end?: THREE.Vector3;
  lookAt?: THREE.Vector3;
  duration?: number;
  ease?: string;
  runAnimation?: boolean;
}) {
  const { camera, controls } = useThree<{
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls | null;
  }>();

  useEffect(() => {
    // // Only run once
    if (!runAnimation) return;

    // Set camera to start position & lookAt
    camera.position.copy(start);
    camera.lookAt(lookAt);

    // Start GSAP animation
    const cameraAnimation = gsap.to(camera.position, {
      x: end.x,
      y: end.y,
      z: end.z,
      duration,
      ease,
      onUpdate: () => {
        camera.lookAt(lookAt);
        if (controls) controls.update();
      },
    });

    // Clean up if unmounted
    return () => {
      cameraAnimation.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runAnimation]);
}
