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
              🎶 Get Ready for a Symphony of Code 👨‍💻 and Circuits 🤖!
              The much-anticipated Embedded Workshop featuring Autonomous Line Follower Bot and Hand-Gesture Controlled Bot is here! 🌟🚀

              <b>🌟 What to Expect:</b>
              Prepare to immerse yourself in the exciting world of Embedded Systems and Robotics, where you’ll explore both autonomous robotics and gesture-based control. Whether you're a beginner or an experienced tech enthusiast, this workshop is crafted for all skill levels!
              <br />
              🤖 Hands-on Experience:
              You won’t just learn the theory—you’ll build two different bots! Create your own Autonomous Line Follower Bot and a Gesture-Controlled Bot, guided by expert lectures and practical hardware implementation. 💡🤖
              <br />
              📅 <b>Dates:</b> 8th, 9th & 10th November
              📍 <b>Venue:</b> MCA Block
              <br />
              🔥 Workshop Highlights:
              - Build and program your own Autonomous Line Follower Bot and your own bot operated by Hand Gestures, featuring an integrated Robotic Arm
              - Master hand gesture recognition to control a bot
              - Learn in-depth hardware implementation and control systems
              - Ideal for both beginners and advanced participants
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
