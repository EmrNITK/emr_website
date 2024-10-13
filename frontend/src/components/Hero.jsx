
// *********** contact .jsx original *****
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";


import { styles } from "../styles";
import { EMR_logo_canvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Hero = () => {


  const [loading, setLoading] = useState(false);


  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 justify-content:center align-items-center overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className='flex-[0.75]  p-0 rounded-2xl'
      >

        {/* EMR home hero text */}

    <section className={`relative w-full h-[35vh] bg-transparent  mx-auto`}>
     <div
        className={`absolute inset-0 top-[10px]  max-w-7xl mx-auto ${styles} flex flex-row items-start gap-1`}
      >
        <div className='flex flex-col justify-center items-center mt-30'>
  
          <h1 className={`${styles.heroHeadText} text-white mt-30`}>
            <span className='text-[#bfbfbf]'>E</span>
            <span className='text-[#009f069e]'>M</span>
            <span className='text-[#bfbfbf]'>R</span>
          </h1>
          <p className={`${styles.heroSubText} mt-0 text-white-100 text-[25px] `}>
          Embedded System and Robotics Club <br className='sm:block hidden' />
          <div className="mt-2 text-secondary text-[15px] max-w-3xl max-h-3xl ">
                    Vision "Engineering Education should orient towards Innovation"
                </div>
            
          </p>
        </div>
      </div>
      </section>

      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='xl:flex-1 xl:h-70% md:h-[450px] h-[450px]'
      >
        <EMR_logo_canvas />
        {/* <EarthCanvas /> */}
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Hero, "hero");
