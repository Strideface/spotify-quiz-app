/**
 * Import function triggers from their respective submodules:
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
require("dotenv").config();
const { info, error } = require("firebase-functions/logger");
require("firebase-functions/logger/compat");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const nodemailer = require("nodemailer");

// Firebase Functions:

////////////////////////

// send email with document data to verify whenever a write has been performed on the DB.

// 1) creates a nodemailer transporter configured to use Brevo as an SMTP relay for sending email from the app.
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: process.env.BREVO_PORT,
  auth: {
    user: process.env.BREVO_USERNAME,
    pass: process.env.BREVO_PASSWORD,
  },
});

//** Optional - create an alternative transport that uses Brevo in prod but Mailtrap in dev.
// Could be helpful for debugging as it intercepts the email before it hits the recipient*/

// const transporter = nodemailer.createTransport(
//   process.env.NODE_ENV === "production"
//     ? {
//         host: process.env.BREVO_HOST,
//         port: process.env.BREVO_PORT,
//         auth: {
//           user: process.env.BREVO_USERNAME,
//           pass: process.env.BREVO_PASSWORD,
//         },
//       }
//     : {
//         host: process.env.MAILTRAP_HOST,
//         port: process.env.MAILTRAP_PORT,
//         auth: {
//           user: process.env.MAILTRAP_USERNAME,
//           pass: process.env.MAILTRAP_PASSWORD,
//         },
//       }
// );

// 2) function that creates the email and sends
async function sendEmail(data) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from:
      process.env.NODE_ENV === "production"
        ? `Spotify Quiz App Prod <${process.env.BREVO_FROM}>`
        : `Spotify Quiz App Dev <${process.env.BREVO_FROM}>`,
    to: `${process.env.RECIPIENT_EMAIL}`,
    subject: "A New User Result Has Been Created",
    text: `A New User Result Has Been Created. Check the following details: \n\n${JSON.stringify(
      data
    )}`, // plain text body
  });

  return info;
}

// 3) Firebase function that will be triggered when a new doc is created.
exports.sendEmailOnDocCreated = onDocumentCreated(
  "userResults/{userResult}",
  async (event) => {
    try {
      const snapshot = event.data;
      // gets the document object only
      const data = snapshot.data();

      const emailInfo = await sendEmail(data);

      info("Message sent: %s", emailInfo.messageId);
    } catch (err) {
      error(
        "An error occured in the sendEmailOnDocCreated firebase function",
        err
      );
    }
  }
);
