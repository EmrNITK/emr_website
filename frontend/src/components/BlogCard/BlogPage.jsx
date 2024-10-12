import React from 'react';
import BlogCard from './BlogCard';
import BlogHero from '../BlogHero/BlogHero';
import { useRef } from 'react';


const BlogPage = () => {
  const ref = useRef(null)

  const handleClick = () => {
    ref.current?.scrollIntoView({behavior: 'smooth'});
  };

  return (
    <div className="blog-page">
      <BlogHero handleClick={handleClick}/>
      <div ref={ref}>
      <BlogCard
        title="YOLO"
        date="August 11, 2023"
        instagramLink="https://www.instagram.com/p/Cvys-Q1vWd1/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA=="
        content=" You Only Look Once is an efficient object detection algorithm for real time application holds the key to answering these questions!! "
        more="To Know more Click on Above Instagram Icon"
      />
      <BlogCard
        title="VLSI"
        date="July 7, 2023"
        instagramLink="https://www.instagram.com/reel/CuY-2MRJJWM/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA=="
        content=" A modern chip may have billions of transistors packed into an area the size of a human fingernail.!!! Isn't this amazing!!
        All this is possible due to an amazing fabrication technology. Very large-scale integration (VLSI) is the process of creating an integrated circuit (IC) by combining millions or billions of MOS transistors onto a single chip.An electronic circuit might consist of a CPU, ROM, RAM and other glue logic. VLSI enables IC designers to add all of these into one chip."
        more="To Know more Click on Above Instagram Icon"
      />
      <BlogCard
        title="Microprocessors"
        date="June 16, 2023"
        instagramLink="https://www.instagram.com/p/CtieqXAPDe4/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA=="
        content="It's the magic of microprocessors, the tiny chips that give devices the ability to understand, process information, and change the world as we know it. 15 nov, 1971 
        Intel Introduced world's 1st 
        Microprocessor  - 4004 
        ● 4 bit PMOS based MP
        ● designed with 2,300 transisitors
        April 1972 

Intel Introduced its Second Microprocessor  

Intel 8008 
 An 8-bit Microprocessor

It paved the way for modern computing devices. Its architecture allowed for faster, smaller, and more efficient computer systems.

It had a clock speed of 0.5 MHz and Processing power of 8 MIPS.
....."
        more="To Know more Click on Above Instagram Icon"
      />
      <BlogCard
        title="Augmented Reality"
        date="May 26, 2023"
        instagramLink="https://www.instagram.com/p/CssXbO4vwA2/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA=="
        content="Adding a sprinkle of magic to the world around us! 
        AR stands for Augmented Reality, a technology that seamlessly blends the digital world with our real world, enhancing our everyday experiences in unimaginable ways."
        more="To Know more Click on Above Instagram Icon"
      />
      </div>
    </div>
  );
};

export default BlogPage;