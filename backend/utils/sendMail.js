import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const sendVerificationEmail = async (user, transaction_id) => {
  try {
    console.log("hehhhhhhhh", user.isAdmin);
    const acceptUrl = `http://localhost:3000/users/verify/accept/${user._id}`;
    const rejectUrl = `http://localhost:3000/users/verify/reject/${user._id}`;

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "Verification Request",
      html: `
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="https://your-website.com" target="_blank" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
                <img width="200px" src="https://your-image-link.com/image.png" />
              </a>
            </div>
            <p style="font-size:1.1em">Hello Admin,</p>
            <p style="font-size:1.1em">A new user, ${user.name}, has requested verification having Transaction_id <B>${transaction_id}</B> <BR>Please review and accept or reject the request:</p>

            <!-- Accept/Reject Buttons -->
            <div style="margin: 20px 0;">
              <a href="${acceptUrl}" style="background-color:green;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Accept</a>
              <a href="${rejectUrl}" style="background-color:red;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reject</a>
            </div>

            <p style="font-size:0.9em;">Best Regards,<br />EMR SERVER</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300; float:right">
              
            </div>
          </div>
        </div>`,
    };
    console.log(
      `Sending email from: ${process.env.APP_EMAIL} to: ${process.env.ADMIN_EMAIL}`
    );
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email: ", error.message);
  }
};
const sendAcceptanceEmail = async (user) => {
  try {
    console.log("hehhhhhhhh", user.email);

    // Email options
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: user.email,
      subject: "Verification Request Accepted - Welcome to the Workshop!",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="https://your-website.com" target="_blank" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
                  <img width="200px" src="https://your-image-link.com/image.png" />
                </a>
              </div>
              <p style="font-size:1.1em">Hello ${user.name},</p>
              <p style="font-size:1.1em">Congratulations! Your verification has been accepted.</p>
              <p style="font-size:1.1em">We are excited to welcome you to our workshop. Here are the details:</p>
              <ul>
                <li><strong>Transaction ID:</strong></li>
                <li><strong>Workshop Date:</strong> [Insert Workshop Date]</li>
                <li><strong>Location:</strong> [Insert Workshop Location]</li>
              </ul>
              <p style="font-size:1.1em">If you have any questions or need further information, feel free to reach out!</p>
              <p style="font-size:0.9em;">Best Regards,<br />EMR SERVER</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300; float:right">
                <!-- Additional footer or information can go here -->
              </div>
            </div>
          </div>`,
    };

    console.log(
      `Sending email from: ${process.env.APP_EMAIL} to: ${user.email}`
    );
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email: ", error.message); // Log any errors
  }
};
const sendRejectionEmail = async (user) => {
  try {
    console.log("Sending rejection email to", user.email);

    // Email options
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: user.email,
      subject: "Verification Request Rejected",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="https://your-website.com" target="_blank" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
                  <img width="200px" src="https://your-image-link.com/image.png" />
                </a>
              </div>
              <p style="font-size:1.1em">Hello ${user.name},</p>
              <p style="font-size:1.1em">We regret to inform you that your verification request has been rejected.</p>
              <p style="font-size:1.1em">If you believe this is an error or have any questions, please feel free to contact us.</p>
              <p style="font-size:0.9em;">Best Regards,<br />EMR SERVER</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300; float:right">
                <!-- Additional footer or information can go here -->
              </div>
            </div>
          </div>`,
    };

    console.log(
      `Sending email from: ${process.env.APP_EMAIL} to: ${user.email}`
    );
    await transporter.sendMail(mailOptions); // Send the email
  } catch (error) {
    console.error("Error sending rejection email: ", error.message); // Log any errors
  }
};
const sendInvitationEmail = async (user, team) => {
  try {
    // console.log("hehhhhhhhh", user.isAdmin);
    const inviteId = user._id;
    const teamId = team._id;
    const acceptUrl = `http://localhost:3000/api/invite/${teamId}/invites/accept/${inviteId}`;
    const rejectUrl = `http://localhost:3000/api/invite/${teamId}/invites/reject/${inviteId}`;

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: user.email,
      subject: "Verification Request",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="https://your-website.com" target="_blank" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
                  <img width="200px" src="https://your-image-link.com/image.png" />
                </a>
              </div>
              <p style="font-size:1.1em">Hello ${user.name},</p>
              <p style="font-size:1.1em">You're requested to join ${team.name}</B> <BR>Please review and accept or reject the request:</p>
  
              <!-- Accept/Reject Buttons -->
              <div style="margin: 20px 0;">
                <a href="${acceptUrl}" style="background-color:green;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Accept</a>
                <a href="${rejectUrl}" style="background-color:red;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reject</a>
              </div>
  
              <p style="font-size:0.9em;">Best Regards,<br />EMR SERVER</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300; float:right">
                
              </div>
            </div>
          </div>`,
    };
    console.log(
      `Sending email from: ${process.env.APP_EMAIL} to: ${process.env.ADMIN_EMAIL}`
    );
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email: ", error.message);
  }
};
const inviteAcceptedEmail = async (user, team) => {
  try {
    console.log("hehhhhhhhh", user.email);

    // Email options
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: user.email,
      subject: "Invitation request accepted",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="https://your-website.com" target="_blank" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
                  <img width="200px" src="https://your-image-link.com/image.png" />
                </a>
              </div>
              <p style="font-size:1.1em">Hello ${user.name},</p>
              <p style="font-size:1.1em">Congratulations! You're now a member of team ${team.name}.</p>
              <p style="font-size:1.1em">We are excited to welcome you to our workshop.</p>
              <p style="font-size:1.1em">If you have any questions or need further information, feel free to reach out!</p>
              <p style="font-size:0.9em;">Best Regards,<br />EMR SERVER</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300; float:right">
                <!-- Additional footer or information can go here -->
              </div>
            </div>
          </div>`,
    };

    console.log(
      `Sending email from: ${process.env.APP_EMAIL} to: ${user.email}`
    );
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email: ", error.message); // Log any errors
  }
};
const inviteRejectedEmail = async (user, team) => {
  try {
    console.log("Sending rejection email to", user.email);

    // Email options
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: user.email,
      subject: "Verification Request Rejected",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="https://your-website.com" target="_blank" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
                  <img width="200px" src="https://your-image-link.com/image.png" />
                </a>
              </div>
              <p style="font-size:1.1em">Hello ${user.name},</p>
              <p style="font-size:1.1em">We regret to inform you that since your rejected the invitation to team ${team.name} you will
              not be a part of this team.</p>
              <p style="font-size:1.1em">If you believe this is an error or have any questions, please feel free to contact us.</p>
              <p style="font-size:0.9em;">Best Regards,<br />EMR SERVER</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300; float:right">
                <!-- Additional footer or information can go here -->
              </div>
            </div>
          </div>`,
    };

    console.log(
      `Sending email from: ${process.env.APP_EMAIL} to: ${user.email}`
    );
    await transporter.sendMail(mailOptions); // Send the email
  } catch (error) {
    console.error("Error sending rejection email: ", error.message); // Log any errors
  }
};
const sendjoinRequestEmail = async (user, leader) => {
  try {
    // console.log("hehhhhhhhh", user.isAdmin);
    const acceptUrl = `http://localhost:3000/teams/:teamId/join_request/:userId/${user._id}`;
    const rejectUrl = `http://localhost:3000/teams/:teamId/join_request/:userId/${user._id}`;

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: leader.email,
      subject: "Team Join Request",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="https://your-website.com" target="_blank" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
                  <img width="200px" src="https://your-image-link.com/image.png" />
                </a>
              </div>
              <p style="font-size:1.1em">Hello Admin,</p>
              <p style="font-size:1.1em">${user.name} is requesting to join a team. Here are the details:</p>
              <ul>
                <li><strong>Name:</strong> ${user.name}</li>
                <li><strong>Branch:</strong> ${user.branch}</li>
                <li><strong>College Name:</strong> ${user.collegeName}</li>
                <li><strong>Mobile No:</strong> ${user.mobileNo}</li>
                <li><strong>Roll No:</strong> ${user.rollNo}</li>
                <li><strong>Email:</strong> ${user.email}</li>
              </ul>
              <p style="font-size:1.1em">Transaction ID:<br>Please review and accept or reject the request:</p>
      
              <!-- Accept/Reject Buttons -->
              <div style="margin: 20px 0;">
                <a href="${acceptUrl}" style="background-color:green;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Accept</a>
                <a href="${rejectUrl}" style="background-color:red;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reject</a>
              </div>
      
              <p style="font-size:0.9em;">Best Regards,<br />EMR SERVER</p>
              <hr style="border:none;border-top:1px solid #eee" />
            </div>
          </div>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email: ", error.message);
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
              <div style="border-bottom:1px solid #eee">
                <a href="https://your-website.com" target="_blank" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
                  <img width="200px" src="https://your-image-link.com/image.png" />
                </a>
              </div>
              <p style="font-size:1.1em">Hello ${user.name},</p>
              <p style="font-size:1.1em">Congratulations! Your request to join the team has been accepted.</p>
              <p style="font-size:1.1em">Here are the details:</p>
              <ul>
                <li><strong>Team Name:</strong> ${team.name}</li>
                 <li><strong>Team Leader:</strong> ${leader.name}</li>
              </ul>
              <p style="font-size:1.1em">You can now participate in team activities and contribute to your team's success!</p>
              
              <p style="font-size:0.9em;">Best Regards,<br />EMR SERVER</p>
              <hr style="border:none;border-top:1px solid #eee" />
            </div>
          </div>`,
    };
    console.log(`Sending acceptance email to: ${user.email}`);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending acceptance email: ", error.message);
  }
};


const sendJoinRejectionEmail = async (user, team) => {
  try {
    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: user.email,
      subject: "Team Join Request Accepted",
      html: `
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="https://your-website.com" target="_blank" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
                  <img width="200px" src="https://your-image-link.com/image.png" />
                </a>
              </div>
              <p style="font-size:1.1em">Hello ${user.name},</p>
              <p style="font-size:1.1em">Unfortunately, Your request to join the team has been rejected.</p>
              <p style="font-size:1.1em">Please look for other team</p>
              <p style="font-size:1.1em">We will team up next time </p>

              <ul>
                <li><strong>Team Name:</strong> ${team.name}</li>
                 <li><strong>Team Leader:</strong> ${leader.name}</li>
              </ul>
              <p style="font-size:1.1em">You can now participate in team activities and contribute to your team's success!</p>
              
              <p style="font-size:0.9em;">Best Regards,<br />${team.name}</p>
              <p style="font-size:0.9em;"><br />${leader.name}</p>
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
              <div style="border-bottom:1px solid #eee">
                <a href="https://your-website.com" target="_blank" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">
                  <img width="200px" src="https://your-image-link.com/image.png" />
                </a>
              </div>
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
  sendjoinRequestEmail,
  sendJoinAcceptanceEmail,
  sendJoinRejectionEmail,
  sendRemoveEmail,
};
