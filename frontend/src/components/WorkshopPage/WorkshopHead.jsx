import { useMediaQuery } from "react-responsive";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { Carousel } from "react-carousel-minimal";
import img1 from "../../assets/images/WorkshopPage/carousel1.jpg";
import img2 from "../../assets/images/WorkshopPage/carousel2.jpg";
import img3 from "../../assets/images/WorkshopPage/carousel3.jpg";
import { useNavigate } from "react-router-dom";
// import { Route } from "react-router-dom";

function WorkshopHead() {
  const navigate = useNavigate();
  const handleExploreButtonClick = () => {
    navigate("/workshop-details");
  };
  const data = [
    {
      image: img1,
    },
    {
      image: img2,
    },
    {
      image: img3,
    },
  ];
  const isSmallScreen = useMediaQuery({
    query: "(max-width: 650px)",
  });
  // const w = isSmallScreen ? "200px" : "600px";
  const d = isSmallScreen ? "none" : "flex";
  return (
    <div className="workshop-main-head-container">
      <div className="workshop-head-container">
        <div className="workshop-head-text">
          <h1 className="workshop-main-head">WORKSHOPS</h1>
          <p className="workshop-main-head-text">
          The EMR Club has orchestrated an array of captivating workshops that delve into embedded systems and robotics. From Arduino essentials that unravel the world of microcontrollers, to advanced Raspberry Pi applications enabling multifunctional projects, their workshops cater to all skill levels. Participants grasp hands-on experience in soldering, circuit design, and sensor integration, coupled with programming languages like C/C++ and Python. The club cultivates expertise in autonomous machines through sessions on navigation algorithms, computer vision, and motor control. With a track record of dynamic workshops, EMR Club empowers enthusiasts to master the realms of embedded systems and robotics with confidence.
          </p>
        </div>
        <Carousel
          className="workshop-head-carousel"
          data={data}
          time={2000}
          width="600px"
          height="500px"
          radius="20px"
          automatic={true}
          pauseIconColor="white"
          pauseIconSize="10px"
          slideBackgroundColor=" rgba(29, 102, 48)"
          slideImageFit="fit"
          style={{
            textAlign: "center",
            width: "600px",
            height: "500px",
            margin: "50px auto",
            display: d,
            justifyContent: "center",
          }}
        />
      </div>

      <div className="explorebtn-container">
        <AnchorLink href="#current-Workshop-Head">
          <button className="explorebtn" onClick={handleExploreButtonClick}>
            Explore
          </button>
        </AnchorLink>
      </div>
    </div>
  );
}

export default WorkshopHead;
