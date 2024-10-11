
///**************** ORIGINAL ************************* */

// import { Html, useProgress } from "@react-three/drei";

// const CanvasLoader = () => {
//   const { progress } = useProgress();
//   return (
//     <Html
//       as='div'
//       center
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         flexDirection: "column",
//       }}
//     >
//       <span className='canvas-loader'></span>
//       <p
//         style={{
//           fontSize: 14,
//           color: "#F1F1F1",
//           fontWeight: 800,
//           marginTop: 40,
//         }}
//       >
//         {progress.toFixed(2)}%

//       </p>
//     </Html>
//   );
// };

// export default CanvasLoader;









import React, { useState } from "react";
import { Html } from "@react-three/drei";
import loaderImage from "../assets/images/emr_logo_white.png";

import "../assets/css/loader_image.css";

const CanvasLoader = () => {

  const [contentLoaded, setContentLoaded] = useState(false);
  const simulateContentLoaded = () => {
    setContentLoaded(true);
  };

  return (
    <>
      {!contentLoaded && (
        <Html
          as="div"
          center
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <span className="canvas-loader"></span>
          <p
            style={{
              fontSize: 20,
              color: "#F1F1F1",
              fontWeight: 800,
              marginTop: 40,
            }}
          >
            <img
              className="altImage"
              src={loaderImage}
              alt="Loading..."
              style={{
               
              }}
            />
            ......................................................
          </p>
        </Html>
      )}

 
    </>
  );
};

export default CanvasLoader;
``
