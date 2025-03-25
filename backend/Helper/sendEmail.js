const nodemailer = require("nodemailer");
require("dotenv").config(); 

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    console.log("MailInfo:", info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
