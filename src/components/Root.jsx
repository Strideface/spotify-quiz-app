import { Outlet } from "react-router-dom";
import { useState, useRef } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Root() {
  // state to manage where a user is in the app 'flow'. Default is
  // the game tiles stage where user picks the game type.
  const [quizStage, setQuizStage] = useState({
    gameTilesStage: true,
    selectPlaylistStage: false,
    playQuizStage: false,
    finalResultsStage: false,
  });
  // to control what the user sees on the app, e.g. sign in button
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("spotify_access_token") ? true : false
  );

  // IMPORTANT: note the 'expectations' of using useRef in this way, from React doc:
  // 'Do not write or read ref.current during rendering...You can read or write refs from event handlers or effects'

  const quizData = useRef({
    difficulty: null,
    gameId: null,
    playlist: {
      id: null,
      name: null,
      playlistTotalTracks: null,
      genre: null, // only applicable if 'COMPETE' quiz
    },
    quizTotalTracks: null,
    quizTracks: null,
    quizResults: {
      totalPoints: 0,
      totalCorrectArtists: 0,
      totalCorrectTracks: 0,
      totalSkipped: 0,
      totalTimerFinished: 0,
    },
    userDetails: {
      userId: null,
      name: null,
      country: null,
      image: null,
    },
  });

  return (
    <>
      <NavBar quizStage={quizStage} />
      {/* Outlet acts like the children prop and renders any child elements of this route */}
      <Outlet
        context={{
          quizStage,
          setQuizStage,
          isAuthenticated,
          setIsAuthenticated,
          quizData,
        }}
      />
      <Footer quizStage={quizStage} />
    </>
  );
}
