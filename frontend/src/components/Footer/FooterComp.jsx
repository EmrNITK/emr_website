
import React from 'react';
import '../../assets/css/footer.css'

import mailIcon from "../../assets/images/mail_icon.png";
import mapIcon from "../../assets/images/map_icon.png";
import linkedinIcon from "../../assets/images/linkedin.png"
import emailIcon from "../../assets/images/email.png"

import githubIcon from "../../assets/images/github.png"
import { emrlogo } from '../../assets';
import { SectionWapper_contact } from "../../hoc";

const Footer = () => {
 
  return (

    <div className="footer_body">
      <br />
      <div className="footer_map_block">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3457.1086032669546!2d76.8201344762509!3d29.947554623153604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e3f422f5244e7%3A0x9c630c311d6349b8!2sNIT%20KURUKSHETRA!5e0!3m2!1sen!2sin!4v1689770718009!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

<div className="footer_upper">

</div>

      


      <div className="footer_content">
        <div className="footer_data">

          <div className="emr_brand">
            <img src={emrlogo} alt="emr logo" />
           
          </div>

          <div className="address ">
          <div>Address</div>
            <p>NIT Kurukshetra, Thanesar, Haryana</p>
            
            <div className="mail">

            <a href="mailto:emr@nitkkr.ac.in" target="_blank" >
                <img src={emailIcon} alt="email icon" className="w-6 h-6 mail-icon"  />
              </a> &nbsp;
              <span>emr@nitkkr.ac.in</span>
              
            </div>
          </div>

<div className="follow_us">
  <p>Follow Us</p>

<div className="icons">
            <a href="https://github.com/EmrNITK" target="_blank">
                <img src={githubIcon} alt="GitHub icon" className="w-8 h-8"  />
              </a>


              <a href="mailto:emr@nitkkr.ac.in" target="_blank" >
                <img src={emailIcon} alt="email icon" className="w-9 h-9"  />
              </a>

              <a href="https://www.linkedin.com/company/emrclub/" target="_blank" >
                <img src={linkedinIcon} alt="LinkedIn icon" className="w-12 h-12" />
              </a>
</div>
</div>
        </div>
<br />
    {/* <hr /> */}
       <div className="copyright_line">

      <div className="copyright">Copyright &#xA9;2023 . All rights reserved | This website is made with &#x2764; by &nbsp; 
      </div>
      <div className="emr">E M R</div>
      
       </div>


       {/* end of above  */}
       {/* starting  */}
       
        

      </div>
      
    </div>
  );
};
// export default Footer;
export default SectionWapper_contact(Footer, "footer");