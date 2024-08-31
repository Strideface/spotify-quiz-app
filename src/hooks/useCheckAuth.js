import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

// determine if user is authenticated or not by checking if there is an access token present in local storage.
// If not, user needs to sign in again. QuizStage state is reset to the initial gameTilesStage component.
// Authenticated state is set to false.

export function useAuthCheck() {
  const { setQuizStage, setIsAuthenticated } = useOutletContext();

  useEffect(() => {
    if (!localStorage.getItem("spotify_access_token")) {
      setIsAuthenticated(false);
      setQuizStage({
        gameTilesStage: true,
        selectPlaylistStage: false,
        playQuizStage: false,
        finalResultsStage: false,
      });
    }
  });
}
