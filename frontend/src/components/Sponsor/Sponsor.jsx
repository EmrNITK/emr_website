import React, { useState, useEffect } from 'react';
import roboImg from '../../assets/images/robo.png';
import '../../assets/css/Sponsor.css';
import NavBar2 from '../Navbar2';

const SponsorPage = () => {

  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 900);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div>
        
        
    <div className="sponsor">
    <NavBar2 />
    {isWideScreen && ( 
        <div className="sponsor-image">
            <img className="sponsor-robo" src={roboImg} alt="roboImg" />
        </div>
    )}
    

    <div className="sponsor-page">
      <header className="page-header">
        <h1>EMR Club Sponsorship</h1>
      </header>
      <main className="page-content">
        <section className="sponsor-section">
          <h2>Why Sponsor Us?</h2>
          <p>
            Welcome to the Embedded Systems and Robotics (EMR) Club! We are a community of passionate individuals interested in advancing technology and innovation in the field of robotics and embedded systems.
          </p>
          <p>
            By sponsoring us, you will be supporting our mission to provide hands-on learning experiences, organize workshops, and participate in competitions to foster creativity and technical expertise among students.
          </p>
          <p>
            As a sponsor, you'll have the opportunity to engage with talented students, stay updated with cutting-edge technology trends, and contribute to the growth of the next generation of engineers and innovators.
          </p>
          <p>
            Your sponsorship will directly impact our projects and activities, enabling us to host events, purchase equipment, and expand our outreach to a wider audience.
          </p>
          <h3>How to Sponsor?</h3>
          <p>
            If you are interested in becoming a sponsor or have any questions, please get in touch with us using the contact information provided below.
          </p>
        </section>
      </main>
      <footer className="page-footer">
        <p>Contact us at: <a className="sponsor-mail" href="mailto:emr@nitkkr.ac.in">emr@nitkkr.ac.in</a></p>
      </footer>
    </div>
 </div>
 </div>
  )
};

export default SponsorPage;