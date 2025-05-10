import React from "react";
import { GizmoHelper, GizmoViewcube } from "@react-three/drei";
// import { useControls } from "leva";

function Helpers() {
  return (
    <>
      {/* Axes helper args is the size of the axes */}
      <axesHelper args={[5]} />
      {/* Grid helper 
        args=[
        size of grid,
        sub-divisions,
        color of 2 main axes of grid,
        color of remaining lines]
      */}
      <gridHelper args={[20, 20, , 0x55ccff]} />
      <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
        <GizmoViewcube />
      </GizmoHelper>
    </>
  );
}

export default Helpers;
