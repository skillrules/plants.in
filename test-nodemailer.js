import * as nodemailer from 'nodemailer';

async function test() {
  console.log("Testing Hostinger SMTP...");
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Plantsin Test" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Hostinger SMTP Test Successful!",
      text: "If you are reading this, your Nodemailer integration is perfectly configured."
    });
    console.log("Success! Email sent. Message ID:", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error.message);
  }
}
test();
