import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore/lite";

import { fetchUsers } from "./spotify-api";

// https://firebase.google.com/docs/firestore/quickstart
// Test mode
// Good for getting started with the mobile and web client libraries, but allows anyone to read and overwrite your data.
// After testing, make sure to review the Secure your data section.

// The Firebase config object contains unique, but non-secret identifiers for your Firebase project.
// https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAT2qTdE4WT4jhfrekjS3SjW4WNgG4zwoQ",
  authDomain: "spotify-quiz-app-dev.firebaseapp.com",
  projectId: "spotify-quiz-app-dev",
  storageBucket: "spotify-quiz-app-dev.firebasestorage.app",
  messagingSenderId: "245824577428",
  appId: "1:245824577428:web:bb6f5df56f685d62e9f981",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// enable offline caching. Unsire if this is right: https://firebase.google.com/docs/firestore/manage-data/enable-offline?_gl=1*1rsc87*_up*MQ..*_ga*NjQ1ODg5MjQuMTczNjI3NTY2Mg..*_ga_CW55HF8NVT*MTczNjI3NTY2Mi4xLjAuMTczNjI3NTY2Mi4wLjAuMA..#configure_offline_persistence
// db.enablePersistence();

export const fetchUserResults = async () => {
  // due to GDPR, the DB does not store any PII. Therefore, the app needs to look up the user's details by using the
  // stored user id in a call to the spotify api, when the results are requested.
  const userResults = [];
  try {
    //1) get user docs with results, including user ID
    const querySnapshot = await getDocs(collection(db, "userResults"));
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
    // This is error is expected and means that an unauthenticated user has landed on the Leaderboard page.
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
    console.log(error);
  }
};

// Current 'schema' of userResult document and the values for fields

// {
//   date: Date.now(),
//   playlist: {
//     id: quizData.current.playlist.id,
//     name: quizData.current.playlist.name,
//     genre: quizData.current.playlist.description,
//   },
//   quizResults: {
//     percentageScore,
//     totalCorrectArtists: quizData.current.quizResults.totalCorrectArtists,
//     totalCorrectTracks: quizData.current.quizResults.totalCorrectTracks,
//     totalPoints: quizData.current.quizResults.totalPoints,
//     totalSkipped: quizData.current.quizResults.totalSkipped,
//     totalTimerFinished: quizData.current.quizResults.totalTimerFinished,
//   },
//   userId: quizData.current.userDetails.userId,
// }
