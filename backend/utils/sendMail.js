import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN_DEV || process.env.BACKEND_DOMAIN_PROD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const sendVerificationEmail = async (user, transactionId) => {
  try {
    console.log(BACKEND_DOMAIN);
    // Generate Accept and Reject URLs
    const acceptUrl = `${BACKEND_DOMAIN}/api/users/verify/${user._id}/accept?_method=PUT`;
    const rejectUrl = `${BACKEND_DOMAIN}/api/users/verify/${user._id}/reject?_method=POST`;

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "Verification Request",
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
          <div style="margin: 50px auto; width: 70%; padding: 20px 0">
            <p style="font-size: 1.1em">Hello Admin,</p>
            <p style="font-size: 1.1em">A new user, ${user.name}, has requested verification with Transaction ID <b>${transactionId}</b>. <br>Please review and accept or reject the request:</p>

            <!-- Accept/Reject Links -->
            <div style="margin: 20px 0;">
              <a href="${acceptUrl}" style="background-color: green; color: white; padding: 10px 20px; border: none; border-radius: 5px; text-decoration: none;">Accept</a>
              <a href="${rejectUrl}" style="background-color: red; color: white; padding: 10px 20px; border: none; border-radius: 5px; text-decoration: none; margin-left: 10px;">Reject</a>
            </div>

            <p style="font-size: 0.9em;">Best Regards,<br />Team EMR</p>
            <hr style="border: none; border-top: 1px solid #eee" />
            <div style="padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300; float: right"></div>
          </div>
        </div>`,
    };

    // console.log(
    //   `Sending email from: ${process.env.APP_EMAIL} to: ${process.env.ADMIN_EMAIL}`
    // );
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email: ", error.message);
    throw error;
  }
};

const sendAcceptanceEmail = async (user) => {
  try {

    // Email options
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: user.email,
      subject: "Verification Request Accepted - Welcome to the Workshop!",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <p style="font-size:1.1em">Hello ${user.name},</p>
              <p style="font-size:1.1em">Congratulations! Your verification has been accepted.</p>
              <p style="font-size:1.1em">We are excited to welcome you to our workshop. Here are the details:</p>
              <ul>
                <li><strong>Workshop Date:</strong> [Insert Workshop Date]</li>
                <li><strong>Location:</strong> [Insert Workshop Location]</li>
              </ul>
              <p style="font-size:1.1em">If you have any questions or need further information, feel free to reach out!</p>
              <p style="font-size:0.9em;">Best Regards,<br />Team EMR</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300; float:right">
                <!-- Additional footer or information can go here -->
              </div>
            </div>
          </div>`,
    };

    // console.log(
    //   `Sending email from: ${process.env.APP_EMAIL} to: ${user.email}`
    // );
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email: ", error.message); // Log any errors
    throw error;
  }
};
const sendRejectionEmail = async (user) => {
  try {
    // console.log("Sending rejection email to", user.email);

    // Email options
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: user.email,
      subject: "Verification Request Rejected",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <p style="font-size:1.1em">Hello ${user.name},</p>
              <p style="font-size:1.1em">We regret to inform you that your verification request has been rejected.</p>
              <p style="font-size:1.1em">If you believe this is an error or have any questions, please feel free to contact us.</p>
              <p style="font-size:0.9em;">Best Regards,<br />Team EMR</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300; float:right">
                <!-- Additional footer or information can go here -->
              </div>
            </div>
          </div>`,
    };

    // console.log(
    //   `Sending email from: ${process.env.APP_EMAIL} to: ${user.email}`
    // );
    await transporter.sendMail(mailOptions); // Send the email
  } catch (error) {
    console.error("Error sending rejection email: ", error.message); // Log any errors
    throw error;
  }
};
const sendInvitationEmail = async (user, team) => {
  try {

    const inviteId = user._id;
    const teamId = team._id;

    const acceptUrl = `${BACKEND_DOMAIN}/api/teams/${teamId}/invite/${inviteId}/accept?_method=PUT`;
    const rejectUrl = `${BACKEND_DOMAIN}/api/teams/${teamId}/invite/${inviteId}/reject?_method=POST`;

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: user.email,
      subject: "Invitation to Join Team",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <p style="font-size:1.1em">Hello ${user.name},</p>
              <p style="font-size:1.1em">You're requested to join <b> Team: ${team.name}</b> <br>Please review and accept or reject the request:</p>
  
             <!-- Accept/Reject Links -->
            <div style="margin: 20px 0;">
              <a href="${acceptUrl}" style="background-color: green; color: white; padding: 10px 20px; border: none; border-radius: 5px; text-decoration: none;">Accept</a>
              <a href="${rejectUrl}" style="background-color: red; color: white; padding: 10px 20px; border: none; border-radius: 5px; text-decoration: none; margin-left: 10px;">Reject</a>
            </div>

  
              <p style="font-size:0.9em;">Best Regards,<br />Team EMR</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300; float:right">
                
              </div>
            </div>
          </div>`,
    };
    // console.log(
    //   `Sending email from: ${process.env.APP_EMAIL} to: ${process.env.ADMIN_EMAIL}`
    // );
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email: ", error.message);
    throw error;
  }
};
const inviteAcceptedEmail = async (leader, user, team) => {
  try {
    console.log("hehhhhhhhh", user.email);

    // Email options
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: user.email,
      cc: leader.email,
      subject: "Invitation request accepted",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <p style="font-size:1.1em">Hello ${user.name},</p>
              <p style="font-size:1.1em">Congratulations! You're now a member of team ${team.name}.</p>
              <p style="font-size:1.1em">We are excited to welcome you to our workshop.</p>
              <p style="font-size:1.1em">If you have any questions or need further information, feel free to reach out!</p>
              <p style="font-size:0.9em;">Best Regards,<br />Team EMR</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300; float:right">
                <!-- Additional footer or information can go here -->
              </div>
            </div>
          </div>`,
    };

    // console.log(
    //   `Sending email from: ${process.env.APP_EMAIL} to: ${user.email}`
    // );
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email: ", error.message); // Log any errors
    throw error;
  }
};
const inviteRejectedEmail = async (leader, user, team) => {
  try {
    console.log("Sending rejection email to", user.email);

    // Email options
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: leader.email,
      subject: "Invtation Request Rejected",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <p style="font-size:1.1em">Hello ${leader.name},</p>
              <p style="font-size:1.1em">We regret to inform you that ${user.name} has rejected the invitation to join your team : <b>${team.name} </b>.</p>
              <p style="font-size:1.1em">If you believe this is an error or have any questions, please feel free to contact us.</p>
              <p style="font-size:0.9em;">Best Regards,<br />Team EMR</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300; float:right">
                <!-- Additional footer or information can go here -->
              </div>
            </div>
          </div>`,
    };

    // console.log(
    //   `Sending email from: ${process.env.APP_EMAIL} to: ${user.email}`
    // );
    await transporter.sendMail(mailOptions); // Send the email
  } catch (error) {
    console.error("Error sending rejection email: ", error.message); // Log any errors
    throw error;
  }
};
const sendJoinRequestEmail = async (user, team, leader) => {
  try {
    const acceptUrl = `${BACKEND_DOMAIN}/api/teams/${team._id}/join/${user._id}/accept?_method=PUT`;
    const rejectUrl = `${BACKEND_DOMAIN}/api/teams/${team._id}/join/${user._id}/reject?_method=POST`;

    
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: leader.email,
      subject: "Team Join Request",
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
          <div style="margin: 50px auto; width: 70%; padding: 20px 0">
           
            <p style="font-size: 1.1em">Hello ${leader.name},</p>
            <p style="font-size: 1.1em">${user.name} is requesting to join the team <b>${team.name}</b>. Here are the details:</p>
            <ul>
              <li><strong>Name:</strong> ${user.name}</li>
              <li><strong>Branch:</strong> ${user.branch}</li>
              <li><strong>College Name:</strong> ${user.collegeName}</li>
              <li><strong>Mobile No:</strong> ${user.mobileNo}</li>
              <li><strong>Roll No:</strong> ${user.rollNo}</li>
              <li><strong>Email:</strong> ${user.email}</li>
            </ul>
            <p style="font-size: 1.1em">Please review and accept or reject the request:</p>

            <!-- Accept/Reject Buttons -->
           <!-- Accept/Reject Links -->
            <div style="margin: 20px 0;">
              <a href="${acceptUrl}" style="background-color: green; color: white; padding: 10px 20px; border: none; border-radius: 5px; text-decoration: none;">Accept</a>
              <a href="${rejectUrl}" style="background-color: red; color: white; padding: 10px 20px; border: none; border-radius: 5px; text-decoration: none; margin-left: 10px;">Reject</a>
            </div>

            <p style="font-size: 0.9em;">Best Regards,<br />Team EMR</p>
            <hr style="border: none; border-top: 1px solid #eee" />
            <div style="padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300; float: right"></div>
          </div>
        </div>`,
    };

    // console.log(
    //   `Sending email from: ${process.env.ADMIN_EMAIL} to: ${leader.email}`
    // );
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending join request email: ", error.message);
    throw error;
  }
};


const sendJoinAcceptanceEmail = async (user, team, leader) => {
  try {
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: user.email,
      subject: "Team Join Request Accepted",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              
              <p style="font-size:1.1em">Hello ${user.name},</p>
              <p style="font-size:1.1em">Congratulations! Your request to join the team has been accepted.</p>
              <p style="font-size:1.1em">Here are the details:</p>
              <ul>
                <li><strong>Team Name:</strong> ${team.name}</li>
                 <li><strong>Team Leader:</strong> ${leader.name}</li>
              </ul>
              <p style="font-size:1.1em">You can now participate in team activities and contribute to your team's success!</p>
              
              <p style="font-size:0.9em;">Best Regards,<br />Team EMR</p>
              <hr style="border:none;border-top:1px solid #eee" />
            </div>
          </div>`,
    };
    console.log(`Sending acceptance email to: ${user.email}`);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending acceptance email: ", error.message);
    throw error;
  }
};
const sendJoinRejectionEmail = async (user, team, leader) => {
  try {
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: user.email,
      subject: "Team Join Request Rejected",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              
              <p style="font-size:1.1em">Hello ${user.name},</p>
              <p style="font-size:1.1em">Unfortunately, Your request to join the team has been rejected.</p>
              <p style="font-size:1.1em">Please look for other team</p>
              <p style="font-size:1.1em">We will team up next time </p>

              <ul>
                <li><strong>Team Name:</strong> ${team.name}</li>
                 <li><strong>Team Leader:</strong> ${leader.name}</li>
              </ul>
              
              <p style="font-size:0.9em;">Best Regards,<br />Team EMR</p>
              <hr style="border:none;border-top:1px solid #eee" />
            </div>
          </div>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending acceptance email: ", error.message);
    throw error;
  }
};

const sendRemoveEmail = async (member, team, leader) => {
  try {
    console.log("sending mail to", member);
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: member.email,
      subject: "Removed From Team",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              
              <p style="font-size:1.1em">Hello ${member.name},</p>
              <p style="font-size:1.1em">
                Unfortunately, you have been removed from the team "<strong>${team.name}</strong>" by the leader.
              </p>
              <p style="font-size:1.1em">Please look for another team.</p>
              <ul>
                <li><strong>Team Name:</strong> ${team.name}</li>
                <li><strong>Team Leader:</strong> ${leader.name}</li>
              </ul>
              <p style="font-size:1.1em">We wish you all the best in your future endeavors!</p>
              <p style="font-size:0.9em;">Best Regards,<br />${team.name}</p>
              <p style="font-size:0.9em;">${leader.name}</p>
              <hr style="border:none;border-top:1px solid #eee" />
            </div>
          </div>`,

    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending acceptance email: ", error.message);
    throw error;
  }
};
export {
  sendVerificationEmail,
  sendAcceptanceEmail,
  sendRejectionEmail,
  sendInvitationEmail,
  inviteAcceptedEmail,
  inviteRejectedEmail,
  sendJoinRequestEmail,
  sendJoinAcceptanceEmail,
  sendJoinRejectionEmail,
  sendRemoveEmail,
};
