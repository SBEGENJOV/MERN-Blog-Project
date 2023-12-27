const nodemailer = require("nodemailer");
require("dotenv").config();

//Mail gönderme fonksiyonu

const sendEmail = async (to, resetToken) => {
  try {
    //Gönderici oluşturma
    const tarnsporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER, //user email address,
        pass: process.env.GMAIL_PASS,
      },
    });
    //Gidecek mesaj
    const message = {
      to,
      subject: "Password reset",
      html: `
        <p>You are receiving this email because you (or someone else) have requested the reset of a password.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <p>https://blogify-inovotek.netlify.app/reset-password/${resetToken}</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `,
    };
    //send the email
    const info = await tarnsporter.sendMail(message);
    console.log("Email mesaj", info.messageId);
  } catch (error) {
    console.log(error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;
