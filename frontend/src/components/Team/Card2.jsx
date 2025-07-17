//Web_dev_3.0/frontend/src/components/Team/Card2.jsx

import React from "react";
import "./TeamSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import img1 from "../../assets/images/ProfileImage2/AMAN KUMAR.jpeg";
import img2 from "../../assets/images/ProfileImage2/YUJIT YADAV.png";
import img3 from "../../assets/images/ProfileImage2/MEGHA AGARWAL.png";
import img4 from "../../assets/images/ProfileImage2/ASHWANI ASHWANI.jpg";
import img5 from "../../assets/images/ProfileImage2/HARSHIT CHANANA.jpg";
import img6 from "../../assets/images/ProfileImage2/GARVIT.jpg";
import img7 from "../../assets/images/ProfileImage2/ARYAN KUMAR.jpg";
import img8 from "../../assets/images/ProfileImage2/RAJNEESH RAJNEESH.jpg";
import img9 from "../../assets/images/ProfileImage2/SHOURYA TYAGI.jpg";
import img10 from "../../assets/images/ProfileImage2/SUMIT.jpg";
import img11 from "../../assets/images/ProfileImage2/HARSH BANSAL.jpg";
import img12 from "../../assets/images/ProfileImage2/AMAN JINDAL.jpg";
import img13 from "../../assets/images/ProfileImage2/SHIVANG CHAUHAN.jpg";
import img14 from "../../assets/images/ProfileImage2/Piyush.jpg";
import img15 from "../../assets/images/ProfileImage2/BHAGESH.jpg";
import img16 from "../../assets/images/ProfileImage2/GARV BHATIA.jpg";
import img17 from "../../assets/images/ProfileImage2/NIKHIL JAIN.jpg";
import img18 from "../../assets/images/ProfileImage2/ANUPRIYA BIRMAN.jpeg";
import img19 from "../../assets/images/ProfileImage2/Akshat_profile.jpg";
import img20 from "../../assets/images/ProfileImage2/VISHWAS KAPOOR.jpg";
import img21 from "../../assets/images/ProfileImage2/SHELJA SHARMA.jpeg";

const teamMembers = [
  {
    name: "Aman Verma",
    role: "PRESIDENT",
    image: img1,
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/aman_verma3132/",
  },
  {
    name: "Yujit Yadav",
    role: "VICE PRESIDENT",
    image: img2,
    desc: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/yujit_2003/",
  },
  {
    name: "Megha Agarwal",
    role: "JOINT SECRETARY",
    image: img3,
    desc: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/melophilicme_12/",
  },
  {
    name: "Ashwani Selwal",
    role: "SECRETARY",
    image: img4,
    desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/einstein._.there_/",
  },
  {
    name: "Harshit Chanana",
    role: "PROJECT HEAD",
    image: img5,
    desc: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/harshit_chanana03/",
  },
  {
    name: "Garvit Prajapat",
    role: "PROJECT HEAD",
    image: img6,
    desc: "Anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/garvit_prajapat19/",
  },
  {
    name: "Aryan Kumar",
    role: "DIP HEAD",
    image: img7,
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/aryan_p.h/",
  },
  {
    name: "Rajneesh Rajpoot",
    role: "EMBEDDED HEAD",
    image: img8,
    desc: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/rrajneesh639/",
  },
  {
    name: "Shourya Tyagi",
    role: "RECENT TECH HEAD",
    image: img9,
    desc: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    facebook: "#",
    twitter: "#",
    instagram: "#",
  },
  {
    name: "Akshat Mangal",
    role: "MEMBER",
    image: img19,
    desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/akshat209141/",
  },
  {
    name: "Sumit Kumar",
    role: "MEMBER",
    image: img10,
    desc: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/its_sumit_kumar1906/",
  },
  {
    name: "Harsh Bansal",
    role: "MEMBER",
    image: img11,
    desc: "Anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/harshbansal_001/",
  },
  {
    name: "Aman Jindal",
    role: "MEMBER",
    image: img12,
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/jindal.aman539/",
  },
  {
    name: "Shivang Chauhan",
    role: "MEMBER",
    image: img13,
    desc: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/shivangchauhan._/",
  },
  {
    name: "Piyush Singh",
    role: "MEMBER",
    image: img14,
    desc: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/__i.r.i.d.e.s.c.e.n.t___/",
  },
  {
    name: "Bhagesh Yadav",
    role: "MEMBER",
    image: img15,
    desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/____bhagesh____",
  },
  {
    name: "Garv Bhatia",
    role: "MEMBER",
    image: img16,
    desc: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/_garvbhatia",
  },
  {
    name: "Nikhil Jain",
    role: "MEMBER",
    image: img17,
    desc: "Anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/nikhil_jain_120/",
  },
  {
    name: "Anupriya Birman",
    role: "MEMBER",
    image: img18,
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/anupriyabirman/",
  },
  {
    name: "Vishwas Kapoor",
    role: "MEMBER",
    image: img20,
    desc: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/_leftover._/",
  },
  {
    name: "Shelja Sharma",
    role: "MEMBER",
    image: img21,
    desc: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/shelja_62/",
  },
];

const Card2 = () => {
  return (
    <section className="team-section">
      <div className="team-heading">
        <h2>Our Team</h2>
        <p className="team-subtitle">
          Meet the creative minds behind our success
        </p>
      </div>
      <div className="team-grid">
        {teamMembers.map((member, idx) => (
          <div className="team-card" key={idx}>
            <div className="team-img-wrapper">
              <img src={member.image} alt={member.name} className="team-img" />
            </div>
            <div className="team-role">{member.role}</div>
            <div className="team-name">{member.name}</div>
            <div className="team-desc">{member.desc}</div>
            <div className="team-social">
              <a
                href={member.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a
                href={member.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Card2;