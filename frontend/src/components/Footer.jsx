import React from "react";
import linkedinIcon from "../assets/linkedin.png";
import emailIcon from "../assets/email.png";
import githubIcon from "../assets/github.png";
import  emrlogo  from "../assets/emrlogo.png";
import { SectionWapper_contact } from "../hoc";

const Footer = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg overflow-hidden">
      <div className="flex justify-center items-center border-2 border-transparent rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3457.1086032669546!2d76.8201344762509!3d29.947554623153604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e3f422f5244e7%3A0x9c630c311d6349b8!2sNIT%20KURUKSHETRA!5e0!3m2!1sen!2sin!4v1689770718009!5m2!1sen!2sin"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-[99%] h-32 md:h-40 lg:h-48"
        ></iframe>
      </div>

      <div className="flex flex-col items-center mt-6">
        <div className="flex flex-col md:flex-row justify-around items-center w-full">
          <div className="mb-4 md:mb-0">
            <img src={emrlogo} alt="EMR Logo" className="w-24 h-24" />
          </div>

          <div className="text-center text-gray-400">
            <h3 className="text-white text-lg font-semibold">Address</h3>
            <p className="text-sm">NIT Kurukshetra, Thanesar, Haryana</p>
            <div className="flex justify-center items-center mt-2">
              <a href="mailto:emr@nitkkr.ac.in" target="_blank">
                <img src={emailIcon} alt="Email" className="w-6 h-6 mx-2" />
              </a>
              <span className="text-gray-400 text-sm">emr@nitkkr.ac.in</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white font-semibold">Follow Us</p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="https://github.com/EmrNITK" target="_blank">
                <img src={githubIcon} alt="GitHub" className="w-8 h-8" />
              </a>
              <a href="mailto:emr@nitkkr.ac.in" target="_blank">
                <img src={emailIcon} alt="Email" className="w-8 h-8" />
              </a>
              <a href="https://www.linkedin.com/company/emrclub/" target="_blank">
                <img src={linkedinIcon} alt="LinkedIn" className="w-10 h-10" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center mt-6 text-gray-400 text-xs md:text-sm">
        <p>
          Copyright &copy; 2025. All rights reserved | Made with ❤️ by{" "}
          <span className="text-white font-semibold">E M R</span>
        </p>
      </div>
    </div>
  );
};

export default SectionWapper_contact(Footer, "footer");
