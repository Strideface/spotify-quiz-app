/**
 * Import function triggers from their respective submodules:
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const {
  log,
  info,
  debug,
  warn,
  error,
  write,
} = require("firebase-functions/logger");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase/app");
const { sendEmail } = require("../src/util/email");

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase instance:
initializeApp(firebaseConfig);

// Functions:

// send email with document data to verify whenever a write has been performed on the DB.
onDocumentCreated("userResults/{userResult}", (event) => {
  try {
    const snapshot = event.data;
    // gets the document object only
    const data = snapshot.data();

    const info = sendEmail(data);

    info("Message sent: %s", info.messageId);
  } catch (err) {
    error("An error occured in the onDocumentCreated firebase function", err);
  }
});
