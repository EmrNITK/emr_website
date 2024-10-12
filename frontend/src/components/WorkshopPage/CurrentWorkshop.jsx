import React from "react";
import "../../assets/css/WorkshopPage.css";
import image from "../../assets/images/embedded_workshop_poster.jpeg";
export default function CurrentWorkshop() {
  const visible = true; // Change to false to remove current workshop Element...
  const Gformlink = "https://docs.google.com/forms/d/e/1FAIpQLScYHejNj8lWYlgiqxrZlVRqbA56Jv9vypucfDMssFy3_JOJnw/viewform"; // Link to regeistration form
  return (
    visible && (
      <div className="current-workshop-container">
        <h1 id="current-Workshop-Head" className="current-workshop-head">
          Recent Workshop
        </h1>
        <div className="current-workshop-card">
          <img
            src={image}
            alt="Current Workshop Image"
            className="current-workshop-img"
          />
          <div className="current-workshop-info">
            <div>
              <h1 className="current-workshop-title">Embedded Workshop</h1>
              <p className="current-workshop-description"><br /><br /><br />
              Get ready to immerse yourself in the enchanting world of Robotics Engineering, where you'll unlock the potential of Embedded C, Arduino, Analog Circuits, Simulators, and Sensors. Our workshop is carefully crafted to accommodate participants of all skill levels, whether you're a curious beginner or an experienced enthusiast.

🤖 Hands-on Experience:
One of the highlights of this workshop is the opportunity to put your knowledge into action. You won't just learn theory; you'll dive into the practical side of things. In fact, you'll have the chance to create not one, but two exciting robotics embedded systems projects. 💡🤖🚀<br /><br /><br />

<h2>🔥 Workshop Highlights: </h2> <br />
- Gain a deep understanding of Embedded C programming.<br />
- Dive into the world of Arduino and microcontroller-based projects.<br />
- Explore the principles of Analog Circuits and their applications.<br />
- Get hands-on experience with simulators and sensor technologies.<br />
- Collabor
Don't miss this chance to enhance your skills, ignite your passion, and embark on a journey into the heart of Robotics. 🛠️
</p>
              {/* <p className="current-workshop-description">
                <b>Workshop Date :</b> 27/10/23 - 29/10/23
              </p>
              <p className="current-workshop-description">
                <b>Time :</b> 5:30 pm
              </p>
              <p className="current-workshop-description">
                <b>Location :</b> ED HALL
              </p>
              <p className="current-workshop-description">
                <b>Cost per member :</b> Rs 100/-
              </p> */}
            </div>
            <a
              href={Gformlink}
              target="blank"
              className="current-workshop-register-btn-container"
            >
              {/* <button className="current-workshop-register-btn">
                Register
              </button> */}
            </a>
          </div>
        </div>
      </div>
    )
  );
}
