import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/User.model.js"; // Assuming you have a User model

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.TEST_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const sendVerificationEmail = async (user, transaction_id) => {
  try {
    console.log("hehhhhhhhh", user.isAdmin);
    const acceptUrl = `http://localhost:3000/users/verify/accept/${user._id}`;
    const rejectUrl = `http://localhost:3000/users/verify/reject/${user._id}`;

    const mailOptions = {
      from: process.env.TEST_EMAIL,
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
      `Sending email from: ${process.env.TEST_EMAIL} to: ${process.env.ADMIN_EMAIL}`
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
      from: process.env.TEST_EMAIL,
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
      `Sending email from: ${process.env.TEST_EMAIL} to: ${user.email}`
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
      from: process.env.TEST_EMAIL,
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
      `Sending email from: ${process.env.TEST_EMAIL} to: ${user.email}`
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
      from: process.env.TEST_EMAIL,
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
      `Sending email from: ${process.env.TEST_EMAIL} to: ${process.env.ADMIN_EMAIL}`
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
      from: process.env.TEST_EMAIL,
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
              <p style="font-size:1.1em">Congratulations! You're now a member of team ${team.naem}.</p>
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
      `Sending email from: ${process.env.TEST_EMAIL} to: ${user.email}`
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
      from: process.env.TEST_EMAIL,
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
      `Sending email from: ${process.env.TEST_EMAIL} to: ${user.email}`
    );
    await transporter.sendMail(mailOptions); // Send the email
  } catch (error) {
    console.error("Error sending rejection email: ", error.message); // Log any errors
  }
};

export {
  sendVerificationEmail,
  sendAcceptanceEmail,
  sendRejectionEmail,
  sendInvitationEmail,
  inviteAcceptedEmail,
  inviteRejectedEmail
};
