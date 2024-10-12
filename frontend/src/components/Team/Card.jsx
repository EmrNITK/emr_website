import React from "react";
import "./Card.css";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import img1 from "../../assets/images/ProfileImage/priyanshu - Priyanshu Narwaria.jpg";
import img2 from "../../assets/images/ProfileImage/01F024EA-4C85-4C8A-AA2C-81A72E1159B5 - Priyanshi.jpeg";
import img3 from "../../assets/images/ProfileImage/InShot_20230516_220552985 - 143_SUNIL RATHORE.jpg";
import img4 from "../../assets/images/ProfileImage/IMG_9481 - KRITIKA.jpg";
import img5 from "../../assets/images/ProfileImage/20220922_134905 - Nicky.jpg";
import img6 from "../../assets/images/ProfileImage/Arpit_Image_square - ARPIT BHATNAGAR.jpg";
import img7 from "../../assets/images/ProfileImage/PXL_20230202_044345959 - 5159_Ritesh_ecc9.jpg";
import img8 from "../../assets/images/ProfileImage/anant_gwari.jpg";
import img9 from "../../assets/images/ProfileImage/Deepan - Deepan Adak.jpg";
import img10 from "../../assets/images/ProfileImage/Prashant_Rai.jpg";
import img11 from "../../assets/images/ProfileImage/IMG_20230318_140731 - PI-02-012Gaurav.jpg";
import img12 from "../../assets/images/ProfileImage/IMG_7687_jpg - ARINA.jpeg";
import img13 from "../../assets/images/ProfileImage/IMG_20230819_122107 - SAKET JASUJA.jpg";

const cardData = [
  {
    name: "Priyanshu Narwaria",
    insta: "https://www.instagram.com/napshot_priyanshu/",
    linkedin: "https://www.linkedin.com/in/priyanshu-narwaria-153874201/",
    github: "https://github.com/napshotpriyanshu",
    image: img1,
    role: "Joint Secretary",
  },
  {
    name: "Priyanshi ",
    insta: "https://instagram.com/priyanshirao_18?igshid=MjEwN2IyYWYwYw==",
    linkedin: "https://www.linkedin.com/in/priyanshi-rao13/",
    github: "https://github.com/priyanshiRao",
    image: img2,
    role: "Vice President",
  },
  {
    name: "Deepan Adak",
    insta: "https://www.instagram.com/deepan_adak/",
    linkedin: "https://www.linkedin.com/in/deepan-adak/",
    github: "https://github.com/mr-prometheus",
    image: img9,
    role: "President",
  },
  {
    name: "Sunil Singh Rathore ",
    insta: "https://www.instagram.com/rathore._.15/",
    linkedin: "https://www.linkedin.com/in/sunil-singh-rathore-4a1831202",
    github: "https://github.com/itsrathore15",
    image: img3,
    role: "Secretary",
  },
  {
    name: "Kritika Mittal",
    insta: "",
    linkedin: "https://www.linkedin.com/in/kritika-mittal-3a6182238/",
    github: "https://github.com/m-kritika",
    image: img4,
    role: "Member",
  },
  {
    name: "Nicky",
    insta: "https://instagram.com/n.i.c.k.y_singh?igshid=MzNlNGNkZWQ4Mg==",
    linkedin: "https://www.linkedin.com/in/nicky-singh-a666881b6",
    github: "https://github.com/NickySingh44",
    image: img5,
    role: "Member",
  },
  {
    name: "Arpit Bhatnagar",
    insta: "https://www.instagram.com/bhatnagar.arpit2021/",
    linkedin: "linkedin.com/in/arpit-bhatnagar-529213221/",
    github: "github.com/Sheldon38",
    image: img6,
    role: "Member",
  },
  {
    name: "Madishetty Ritesh ",
    insta: "",
    linkedin: "https://www.linkedin.com/in/ritesh-madishetty-a36844202",
    github: "",
    image: img7,
    role: "Member",
  },
  {
    name: "Anant Gwari ",
    insta:
      "https://instagram.com/anant.offline?utm_source=qr&igshid=MzNlNGNkZWQ4Mg%3D%3D",
    linkedin: "https://www.linkedin.com/in/anant-gwari-110718224/",
    github: "https://github.com/AnantGwari",
    image: img8,
    role: "Member",
  },
  {
    name: "Prashant Rai ",
    insta: "https://www.instagram.com/prashantrai8423/",
    linkedin: "https://www.linkedin.com/in/prashant-rai-4a8a44216",
    github: "https://github.com/raisammer",
    image: img10,
    role: "Project Head",
  },
  {
    name: "Gaurav Mishra ",
    insta: "https://instagram.com/gauravv.png?igshid=MzNlNGNkZWQ4Mg==",
    linkedin: "https://www.linkedin.com/in/gaurav-mishra-a10a35224",
    github: "https://github.com/gauravmishra1263",
    image: img11,
    role: "Recent Tech Head",
  },
  {
    name: "Arina  ",
    insta: "https://www.instagram.com/arina_halwasia/",
    linkedin: "https://www.linkedin.com/in/arina-halwasia/",
    github: "https://github.com/Arinahalwasia",
    image: img12,
    role: "Embedded Head",
  },
  {
    name: "Saket Jasuja ",
    insta: "https://instagram.com/jasujasakett_?utm_source=qr&igshid=ZDc4ODBmNjlmNQ%3D%3D",
    linkedin: "https://www.linkedin.com/in/saket-jasuja-4888b4191",
    github: "https://github.com/Saket0303",
    image: img13,
    role: "Member",
  }
];

const Card = () => {
  // const x = useMotionValue(0);
  // const y = useMotionValue(0);
  // const rotateX = useTransform(y, [-100, 100], [30, -30]);
  // const rotateY = useTransform(x, [-100, 100], [-30, 30]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [visit1, setVisit1] = useState(false);
  const [visit2, setVisit2] = useState(false);
  const [visit3, setVisit3] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  

  return (
    <div className="bod">
      <div className="title" onClick={toggleExpansion} style={{ cursor: "pointer" }} onMouseOver={(e) => e.currentTarget.style.color = "#555"} onMouseOut={(e) => e.currentTarget.style.color = "green"}>
        2k24 Team
      </div>
      {isExpanded && (
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
      )}
    </div>
  );
};

export default Card;
