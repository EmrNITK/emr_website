import "../../assets/css/Contact.css";
// import contactIcon from "../../assets/images/contact_icon.png";
import mailIcon from "../../assets/images/mail_icon.png";
import mapIcon from "../../assets/images/map_icon.png";
import linkedinIcon from "../../assets/images/linkedin.png"
import githubIcon from "../../assets/images/github.png"
import React from "react";

const Contact = () => {
  return (
    <div className="contact_block">
      <div className="contact_header flex items-center justify-center">
        <h1 className="contact_heading">Contact Us</h1>
        {/* <img src={contactIcon} alt="contact_icon" /> */}
      </div>
      <div className="contact_body md:columns-2">
        <div className="map_block">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3457.1086032669546!2d76.8201344762509!3d29.947554623153604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e3f422f5244e7%3A0x9c630c311d6349b8!2sNIT%20KURUKSHETRA!5e0!3m2!1sen!2sin!4v1689770718009!5m2!1sen!2sin"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        
        <div className="info_block">
          <div className="mail_card flex  justify-center ">
            <div class="card  p-6  bg-white border border-gray-200 rounded-lg  shadow dark:bg-gray-800 dark:border-gray-700">
              <img src={mailIcon} alt="mail icon" class="w-7 h-7" />

              <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Our Mail
              </h5>

              <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
                <a href="mailto:emr@nitkkr.ac.in" target="_blank" >emr@nitkkr.ac.in</a>
              </p>

            </div>
          </div>

          <div className="location_card flex justify-center">
            <div class="card p-6  bg-white border border-gray-200 rounded-lg  shadow dark:bg-gray-800 dark:border-gray-700">
              <img src={mapIcon} alt="map icon" class="w-7 h-7" />

              <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Our Address
              </h5>

              <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
                NIT Kurukshetra, Thanesar, Haryana
              </p>
            </div>
          </div>

          <div className="location_card flex justify-center">
            <div class="card p-6  bg-white border border-gray-200 rounded-lg  shadow dark:bg-gray-800 dark:border-gray-700">

            <div style={{ marginTop: '15px' }}>
             <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Find Us Around the Web
            </h5>
              </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <a href="https://www.linkedin.com/company/emrclub/" target="_blank" rel="noopener noreferrer">
                <img src={linkedinIcon} alt="LinkedIn icon" className="w-12 h-12" />
              </a>
              <a href="https://github.com/EmrNITK" target="_blank" rel="noopener noreferrer">
                <img src={githubIcon} alt="GitHub icon" className="w-8 h-8" style={{ marginLeft: '25px' }} />
              </a>
            </div>

              
            


              </div>
          </div>

          
        </div>
      </div>
    </div>
    // </React.Fragment>
  );
};

export default Contact;
