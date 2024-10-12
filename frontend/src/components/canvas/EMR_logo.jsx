// ******* doing some changes below **
// jo chaiye tha,  90% mil gya :)

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, meshBounds, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";
// import CanvasLoader2 from "../Loader_Image";
// import { EMR_logo_canvas } from ".";

const EMR_logo = () => {
  // const earth = useGLTF("./planet/scene.gltf");
  // const earth = useGLTF("./emr_logo_old/EMR_logo.gltf");
  const logo = useGLTF("./emr_logo_new/logo.gltf");

  return (
    <mesh>
      {/* <hemisphereLight intensity={-0.4} groundColor='black' /> */}
      <hemisphereLight intensity={-0.21} groundColor="black" />
      <spotLight
        // // position={[-2, 50, 60]}
        // position={[-70, 50, 900, ] }
        // // position-z={[-900]}
        // angle={0.12}
        // penumbra={1}
        // intensity={1.4}
        // castShadow
        // shadow-mapSize={1024}

        position={[-2, 50, 30]}
        // position={[-70, 50, 900, ] }
        // position-z={[-900]}
        angle={0.12}
        penumbra={1}
        intensity={1.4}
        castShadow
        shadow-mapSize={1024}
      />

      <primitive
        object={logo.scene}
        scale={1.4}
        //  scale={0.7}

        //  change position of logo
        position-y={-3.5}
        position-x={-3.4}
        //

        // change rotation of logo
        rotation-y={Math.PI / 400} // ek dm mast
        rotation-x={Math.PI / 2}

        // change rotation of logo
        // rotation-y={-6.28}
        // rotation-x={-10.9}

        // //  change position of logo
        //   position-y={-3.54}
        //   position-x={-5}

        //   // change rotation of logo
        // rotation-y={-6.26}
        // rotation-x={-10.999}

        //
      />
    </mesh>
  );
};

const EMR_logo_canvas = () => {
  return (
    <Canvas
      shadows
      frameloop="demand"
      dpr={[1, 7]}
      // dpr={[90, 9]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 50,
        // position: [-4, 3, 10]
        position: [0, 9, 8],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        {/* <Suspense fallback={<CanvasLoader2 />}> */}
        <OrbitControls
          autoRotate
          autoRotateSpeed={7}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <EMR_logo />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EMR_logo_canvas;
