import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Brevo",
  auth: {
    user: process.env.REACT_APP_BREVO_USERNAME,
    pass: process.env.REACT_APP_BREVO_PASSWORD,
  },
});

export async function sendEmail(data) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from:
      process.env.NODE_ENV === "production"
        ? "Spotify Quiz App Prod (sent from Brevo)"
        : "Spotify Quiz App Dev (sent from Brevo)",
    to: `${process.env.REACT_APP_RECIPIENT_EMAIL}`,
    subject: "A New User Result Has Been Created",
    text: `A New User Result Has Been Created. Check the following details: ${data}`, // plain text body
  });

  return info;
}
