import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useState, useRef } from "react";

import { checkAuth } from "../util/authentication";

export default function Root() {
  // create state to manage where a user is in the app 'flow'. Default is
  // the game tiles stage where user picks the game type.
  const [quizStage, setQuizStage] = useState({
    gameTilesStage: true,
    selectPlaylistStage: false,
    playQuizStage: false,
  });
  // to control what the user sees on the app, e.g. sign in button
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());
  // to control if a modal is shown or hidden. As there will be more than one modal in the app, add a prop for each modal instance.
  // specific modal can then be set in whichever component it is needed and advoids prop drilling.
  const [showModal, setShowModal] = useState({
    selectDifficultyModal: false,
  });
  
  // IMPORTANT: note the 'expectations' of using useRef in this way, from React doc:
  // 'Do not write or read ref.current during rendering...You can read or write refs from event handlers or effects'

  const quizData = useRef({
    difficulty: null,
    gameId: null,
    playlistTracksHref: null,
    quizTracks: [],
    userDetails: {
      name: null,
      country: null,
    },
  });
  

  return (
    <>
      <Header />
      <Outlet
        context={{
          quizStage,
          setQuizStage,
          isAuthenticated,
          setIsAuthenticated,
          showModal,
          setShowModal,
          quizData,
        }}
      />
      {/* Outlet acts like the children prop and renders any child elements of this route */}
    </>
  );
}
