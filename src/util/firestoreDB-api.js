import { initializeApp, getApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  Timestamp,
  query,
  orderBy,
  connectFirestoreEmulator,
} from "firebase/firestore/lite";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

import { fetchUsers } from "./spotify-api";

//** Important Notes */
//If, after you have registered your app for App Check, you want to run your app in an environment that App Check would normally not classify as valid,
//such as locally during development, you can create a debug build of your app that uses the App Check debug provider instead of a real attestation provider.
// ** Warning: The debug provider allows access to your Firebase resources from unverified devices. Don't use the debug provider in production builds of your app **

//Because this token allows access to your Firebase resources without a valid device, it is crucial that you keep it private.
//Don't commit it to a public repository, and if a registered token is ever compromised, revoke it immediately in the Firebase console.
//This token is stored locally in your browser and will be used whenever you use your app in the same browser on the same machine.
//If you want to use the token in another browser or on another machine, set FIREBASE_APPCHECK_DEBUG_TOKEN to the token string instead of true (Stored in .env file)

// 1) Create config object for Firebase:

// The Firebase config object contains unique, but non-secret identifiers for your Firebase project.
// https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// 2) Initialize Firebase instance:
const app = initializeApp(firebaseConfig);

// 3) Get instance of Firestore DB (Dev v Prod):

let db = null;

//** DEV
// - set debug token to match what is currently in Firebase console / App Check / Manage debug tokens.
// - run a local version of firestore using emulator.
// - configure interaction with the Cloud Functions for Firebase emulator
if (process.env.NODE_ENV === "development") {
  window.FIREBASE_APPCHECK_DEBUG_TOKEN =
    process.env.REACT_APP_SPOTIFY_QUIZ_APP_DEBUG_TOKEN; // true

  db = getFirestore();
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  // Optional - if you need to connect to the prod version of firestore DB whilst in dev (and hash out previous two lines):
  // db = getFirestore(app);

  const functions = getFunctions(getApp());
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
} else {
  // ** PROD
  db = getFirestore(app);
}

//**by default, if app goes offline, firestore will get any data from local memory cache so if it tries to write data in that time, it will do once back online  */
// https://firebase.google.com/docs/firestore/manage-data/enable-offline?_gl=1*1rsc87*_up*MQ..*_ga*NjQ1ODg5MjQuMTczNjI3NTY2Mg..*_ga_CW55HF8NVT*MTczNjI3NTY2Mi4xLjAuMTczNjI3NTY2Mi4wLjAuMA..#configure_offline_persistence

// 4) Enable App Check

// Create a ReCaptchaEnterpriseProvider instance using reCAPTCHA Enterprise site key.
// ** Warning: Do not try to enable localhost debugging by adding localhost to reCAPTCHA’s allowed domains. Doing so would allow anyone to run your app from their local machines **

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    process.env.REACT_APP_RECAPTCHA_SITE_KEY
  ),
  isTokenAutoRefreshEnabled: true, // Set to true to allow auto-refresh.
});

// Functions

export const fetchUserResults = async () => {
  // due to GDPR, the DB does not store any PII. Therefore, the app needs to look up the user's details by using the
  // stored user id in a call to the spotify api, when the results are requested.
  const userResults = [];
  try {
    //1) get user docs with results, including user ID

    // create query object, ordering from highest score (an index for this query was created in DB)
    const q = query(collection(db, "userResults"), orderBy("score", "desc"));
    // get docs from the collection based on query specs
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      userResults.push(doc.data());
    });

    //2) loop through the user IDs and get the user details from Spotify
    const userIds = [];
    userResults.forEach((user) => {
      userIds.push(user.userId);
    });

    const userDetails = await fetchUsers(userIds);

    // add the user details to their respective results
    // also add a unique key derived from the indexes. This will map to table row key in LeaderBoard.
    // (no other data in a userResult doc is truly unique that can be used - same userId may appear more than once)
    for (let i = 0; i < userResults.length; i++) {
      userResults[i].userName = userDetails[i].name;
      userResults[i].userImage = userDetails[i].image;
      userResults[i].key = i;
    }
    // return an array with user results and details
    return userResults;
  } catch (error) {
    // This error is expected and means that an unauthenticated user has landed on the Leaderboard page.
    // As I still want unauthenticated users to view this page, return userResults array with unidentified names and no images.
    // This isn't ideally how I wanted it, however, in order to retrieve Spotify user details, app users must have an access token (authenticate with Spotify)
    // The error comes from the result of fetchUsers
    if (error.info === "NO_TOKEN") {
      for (let i = 0; i < userResults.length; i++) {
        userResults[i].userName = "?";
        userResults[i].userImage = null;
        userResults[i].key = i;
      }

      return userResults;
    } else {
      // only log error as trying to read the error (e.g. error.status) when it's a 'firebaseError' seems to
      // cause another error (cannot read props of undefined)
      // eslint-disable-next-line no-console
      console.log(error);
      throw new Error("Sorry, an error occured. Please try again later.");
    }
  }
};

export const addUserResult = async (userResult) => {
  try {
    // add a 'createdAt' field before adding to the DB using:
    // Firestore Timestamp class - https://firebase.google.com/docs/reference/js/firestore_lite.timestamp
    userResult.createdAt = Timestamp.now();
    await addDoc(collection(db, "userResults"), userResult);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    // error message is composed in ResultsSavedBanner where the status of this request is displayed.
    throw new Error();
  }
};
