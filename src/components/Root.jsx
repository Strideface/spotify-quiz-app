import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";

export default function Root() {
  // create state to manage where a user is in the app 'flow'. Default is
  // the game tiles stage where user picks the game type.
  const [quizStage, setQuizStage] = useState({
    gameTilesStage: true,
    selectPlaylistStage: false,
    playQuizStage: false,
  });
  // to control what the user sees on the app, e.g. sign in with spotify
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <Header />
      <Outlet
        context={{
          quizStage,
          setQuizStage,
          isAuthenticated,
          setIsAuthenticated,
        }}
      />
      {/* Outlet acts like the children prop and renders any child elements of this route */}
    </>
  );
}
