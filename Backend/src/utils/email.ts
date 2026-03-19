import nodemailer from "nodemailer";


export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // ✅ use 587 instead of 465
      secure: false, // ✅ important
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
     
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send email");
  }
};