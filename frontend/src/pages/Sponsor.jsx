import React, { useState, useEffect } from "react";
import roboImg from "../assets/robo.png";
import NavBar from "../components/Navbar";

const SponsorPage = () => {
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 900);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-full overflow-auto bg-cover bg-no-repeat bg-center" style={{ backgroundImage: "url(../images/dgb1.jpg)" }}>
      <NavBar />
      {isWideScreen && (
        <div className="fixed bottom-1 z-10">
          <img className="w-72 md:w-44" src={roboImg} alt="roboImg" />
        </div>
      )}

      <div className="max-w-2xl mx-auto p-4">
        <header className="text-center mb-10">
          <h1 className="text-2xl font-extrabold text-green-500">EMR Club Sponsorship</h1>
        </header>
        <main className="bg-gray-800 p-5 rounded-lg shadow-md">
          <section>
            <h2 className="text-green-500 mb-2 text-xl font-semibold">Why Sponsor Us?</h2>
            <p className="text-white mb-4">
              Welcome to the Embedded Systems and Robotics (EMR) Club! We are a community of passionate individuals interested in advancing technology and innovation in the field of robotics and embedded systems.
            </p>
            <p className="text-white mb-4">
              By sponsoring us, you will be supporting our mission to provide hands-on learning experiences, organize workshops, and participate in competitions to foster creativity and technical expertise among students.
            </p>
            <p className="text-white mb-4">
              As a sponsor, you'll have the opportunity to engage with talented students, stay updated with cutting-edge technology trends, and contribute to the growth of the next generation of engineers and innovators.
            </p>
            <p className="text-white mb-4">
              Your sponsorship will directly impact our projects and activities, enabling us to host events, purchase equipment, and expand our outreach to a wider audience.
            </p>
            <h3 className="text-green-500 text-lg font-semibold mt-5">How to Sponsor?</h3>
            <p className="text-white">
              If you are interested in becoming a sponsor or have any questions, please get in touch with us using the contact information provided below.
            </p>
          </section>
        </main>
        <footer className="text-center mt-5 text-green-500">
          <p>
            Contact us at: <a className="text-green-500 underline" href="mailto:emr@nitkkr.ac.in">emr@nitkkr.ac.in</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SponsorPage;