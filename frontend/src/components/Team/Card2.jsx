import React from "react";
import "./Card.css";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
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
import img19 from "../../assets/images/ProfileImage2/AKSHAT MANGAL.jpg";
import img20 from "../../assets/images/ProfileImage2/VISHWAS KAPOOR.jpg";
import img21 from "../../assets/images/ProfileImage2/SHELJA SHARMA.jpeg";

const cardData = [
  {
    name: "Aman Verma",
    insta: "https://www.instagram.com/aman_verma3132/",
    linkedin: "https://www.linkedin.com/in/aman-kumar-0929aa252/",
    github: "https://github.com/Amanverma3132",
    image: img1,
    role: "President"
    
  },
  {
    name: "Yujit",
    insta: "https://www.instagram.com/yujit_2003/",
    linkedin: "https://www.linkedin.com/in/yujit-yadav-7a6197225/",
    github: "https://github.com/yujit2003",
    image: img2,
    role: "Vice President",
  },
  {
    name: "Megha Agarwal",
    insta: "https://www.instagram.com/melophilicme_12/",
    linkedin: "https://www.linkedin.com/in/megha-agarwal-27b878225/",
    github: "https://github.com/mellophilic-me",
    image: img3,
    role: "Joint Secretary"
  },
  {
    name: "Ashwani",
    insta: "https://www.instagram.com/einstein._.there_/",
    linkedin: "https://www.linkedin.com/in/ashwani-selwal-a177a6220/",
    github: "https://github.com/Einstein-ash",
    image: img4,
    role: "Secretary",
  },
  {
    name: "Harshit Chanana",
    insta: "https://www.instagram.com/harshit_chanana03/",
    linkedin: "https://www.linkedin.com/in/harshit-chanana-62882a247",
    github: "https://github.com/Harshit-Chanana",
    image: img5,
    role: "Project Head",
  },
  {
    name: "Garvit",
    insta: "https://www.instagram.com/garvit_prajapat19/",
    linkedin: "https://www.linkedin.com/in/garvit-prajapati-3b03b125a/",
    github: "https://github.com/Garvit101",
    image: img6,
    role: "Project Head",
  },
  {
    name: "Aryan Kumar",
    insta: "https://www.instagram.com/aryan_p.h/",
    linkedin: "http://linkedin.com/in/aryan32134",
    github: "http://github.com/aryan32134hello/",
    image: img7,
    role: "DIP Head",
  },
  {
    name: "Rajneesh",
    insta: "https://www.instagram.com/rrajneesh639/",
    linkedin: "https://www.linkedin.com/in/rajneesh-rajpoot-a52361263",
    github: "https://github.com/rrajneesh639",
    image: img8,
    role: "Embedded Head",
  },
  {
    name: "Shourya Tyagi",
    insta: "",
    linkedin: "https://www.linkedin.com/in/shourya-tyagi/",
    github: "https://github.com/ShouryaTyagi042",
    image: img9,
    role: "Recent Tech Head",
  },
  {
    name: "Sumit Kumar",
    insta: "https://www.instagram.com/its_sumit_kumar1906/",
    linkedin: "https://www.linkedin.com/in/sumit-kumar-1a59b9228/",
    github: "https://github.com/Sumitkumar104",
    image: img10,
    role: "Member",
  },
  {
    name: "Harsh Bansal",
    insta: "https://www.instagram.com/harshbansal_001/",
    linkedin: "https://www.linkedin.com/in/harsh-bansal-296805229/",
    github: "https://github.com/Harsh-Bansal-13",
    image: img11,
    role: "Member",
  },
  {
    name: "Aman Jindal",
    insta: "https://www.instagram.com/jindal.aman539/",
    linkedin: "https://www.linkedin.com/in/aman-jindal-33a924236/",
    github: "https://github.com/ladnijnama",
    image: img12,
    role: "Member",
  },
  {
    name: "Shivang Chauhan",
    insta: "https://www.instagram.com/shivangchauhan._/?next=%2F",
    linkedin: "https://www.linkedin.com/in/sch12/",
    github: "https://github.com/Shivang-Chauhan",
    image: img13,
    role: "Member",
  },
  
  {
    name: "Piyush Singh",
    insta: "https://www.instagram.com/__i.r.i.d.e.s.c.e.n.t___/",
    linkedin: "https://www.linkedin.com/in/darthinvader5/",
    github: "https://github.com/Darth-InVader15",
    image: img14,
    role: "Member",
  },
  {
    name: "Bhagesh",
    insta: "https://www.instagram.com/____bhagesh____?utm_source=ig_web_button_share_sheet&igsh=ODdmZWVhMTFiMw==",
    linkedin: "https://www.linkedin.com/in/bhagesh-yadav-291702230",
    github: "",
    image: img15,
    role: "Member",
  },
  {
    name: "Garv Bhatia",
    insta: "https://www.instagram.com/_garvbhatia?igsh=MTZsN2J2OXk5ajJpbA==",
    linkedin: "https://www.linkedin.com/in/garvbhatias",
    github: "https://github.com/garvboss",
    image: img16,
    role: "Member",
  },
  {
    name: "Nikhil Jain",
    insta: "https://www.instagram.com/nikhil_jain_120/?hl=en",
    linkedin: "https://www.linkedin.com/in/nikhil-jain-5a4a11226",
    github: "https://github.com/jainikkhil",
    image: img17,
    role: "Member",
  },
  {
    name: "Anupriya",
    insta: "https://www.instagram.com/anupriyabirman/",
    linkedin: "https://www.linkedin.com/in/anupriya-birman-88206122a/",
    github: "https://github.com/30Anupriya",
    image: img18,
    role: "Member",
  },
  {
    name: "Akshat Mangal",
    insta: "https://www.instagram.com/akshat209141/",
    linkedin: "https://www.linkedin.com/in/akshat-mangal-812aba223/",
    github: "https://github.com/akshat209141",
    image: img19,
    role: "Member",
  },
  {
    name: "Vishwas Kapoor",
    insta: "https://www.instagram.com/_leftover._/",
    linkedin: "https://www.linkedin.com/in/vishwas-kapoor-872a971b1/",
    github: "https://www.github.com/leftover19/",
    image: img20,
    role: "Member",
  },
  {
    name: "Shelja Sharma",
    insta: "https://www.instagram.com/shelja_62/",
    linkedin: "https://www.linkedin.com/in/shelja-sharma-697a5b231/",
    github: "https://github.com/Shel-2607",
    image: img21,
    role: "Member",
  }
];

const Card2 = () => {
  // const x = useMotionValue(0);
  // const y = useMotionValue(0);
  // const rotateX = useTransform(y, [-100, 100], [30, -30]);
  // const rotateY = useTransform(x, [-100, 100], [-30, 30]);
  const [visit1, setVisit1] = useState(false);
  const [visit2, setVisit2] = useState(false);
  const [visit3, setVisit3] = useState(false);

  return (
    <div className="bod">
      <div className="title">Present Team</div>
      <div className="team-wrapper" style={{ perspective: 3000 }}>
        {cardData.map((item, index) => (
          <div className="Card">
            <div className="imgbox">
              <img src={item.image} alt="" className="img" />
            </div>
            <div className="details">
              <h3>{item.name}</h3>
              <p>{item.role}</p>
              <div className="socialicons">
                <a
                  href={item.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setVisit1(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faLinkedinIn}
                    onClick={() => {
                      setVisit1(true);
                      setTimeout(() => {
                        setVisit1(false);
                      }, 3000);
                    }}
                    flip={visit1}
                  />
                </a>

                <a href={item.github} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon
                    icon={faGithub}
                    flip={visit2}
                    onClick={() => {
                      setVisit2(true);
                      setTimeout(() => {
                        setVisit2(false);
                      }, 3000);
                    }}
                  />
                </a>
                <a href={item.insta} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon
                    icon={faInstagram}
                    flip={visit3}
                    onClick={() => {
                      setVisit3(true);
                      setTimeout(() => {
                        setVisit3(false);
                      }, 3000);
                    }}
                  />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card2;
