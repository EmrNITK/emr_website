import React from "react";
import "../../../../../assets/css/aboutevents.css";

const About = (props) => {
  console.log("Props:", props);

  const redirectToForm = (heading) => {
    let link;
    switch (heading) {
      case "RoboSoccer":
        link = "https://docs.google.com/forms/d/e/1FAIpQLSfDar2JxF1Fs0DerASpff-rVpGE4q8ecpSL4f37FjcO7qeahg/viewform";
        break;
      case "Pixar":
        link = "https://docs.google.com/forms/d/e/1FAIpQLSePcx7P0PRtxz_83g6QSVK4ckuwHINGt7wJuC6rOy_Mt-shMg/formrestricted";
        break;
      case "Maze Up":
        link = "https://docs.google.com/forms/d/e/1FAIpQLScRFT9FRZXM3bPneYKxWSDanM22eeMegnfdWBe2e7_-Ds8cgA/viewform";
        break;
      case "Bit Coding":
        link = "https://docs.google.com/forms/d/e/1FAIpQLSdbFZfqtlIFts0UNkfT08lKUKGJd8tkUtEXb1Q1LjCayaRsWg/viewform";
        break;
      case "Simulator":
        link = "https://docs.google.com/forms/d/e/1FAIpQLSexpgJ8na5PsP05n4b_b6yGsAOmpR3oG-2Xw9r09EFSFFS7EQ/viewform";
        break;
      case "SynthAI":
        link = "https://forms.gle/zCNwxp8MwcALcbq56";
        break;

      default:
        console.error("Unknown heading:", heading);
        return;
    }
    window.open(link);
  };
  const redirectToForm_rule = (heading) => {
    let link;
    switch (heading) {
      case "RoboSoccer":
        link = "https://drive.google.com/file/d/1ILqr7BJmDtfLZ0bsqJQmk_MifJX938ZW/view?usp=drive_link";
        break;
      case "Pixar":
        link = "https://drive.google.com/file/d/1tTE076A6yubjnk0Ho2ml0TU9xnyHAigZ/view?usp=drive_link";
        break;
      case "Maze Up":
        link = "https://drive.google.com/file/d/1We8HB1qTFtCmmHYCoqhDRWrKllwmw29e/view?usp=drive_link";
        break;
      case "Bit Coding":
        link = "https://drive.google.com/file/d/1_6MpHuaWgRkdgk0R0apsPO9KyrnRiF0F/view?usp=drive_link";
        break;
      case "Simulator":
        link = "https://drive.google.com/file/d/1q5iG_Vg4s_V8NImuMLNDLzPwhlK8b0-t/view?usp=drive_link";
        break;
      case "SynthAI":
        link = "https://drive.google.com/file/d/1qiNShhRQtuV6ucuCRELkjvZNjbkIN2OZ/view";
        break;

      default:
        console.error("Unknown heading:", heading);
        return;
    }
    window.open(link);
  };

  return (
    <div className="about-wrapper">
      <div className="max-width about">
        <div className="about-title">{props.heading}</div>
        <div className="about-content">{props.content}</div>
        <div>
          <button onClick={() => redirectToForm(props.heading)} className="register-button">REGISTER NOW</button>
          <button onClick={() => redirectToForm_rule(props.heading)} className="rule-button">RULE BOOK</button>
        </div>
      </div>
    </div>
  );
};

export default About;
