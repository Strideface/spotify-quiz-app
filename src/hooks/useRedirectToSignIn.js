import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

// function that checks the error object passed in as a param to determine whether it is the result of no access or refresh token found in local storage.
// If that is the case, user needs to sign in again. QuizStage state is reset to the initial gameTilesStage component.

export function useRedirectToSignIn(error) {
  const { setQuizStage } = useOutletContext();

  useEffect(() => {
    if (error) {
      if (error?.info === "NO_TOKEN") {
        console.log(error?.message + " - " + error?.info);
        setQuizStage({
          gameTilesStage: true,
          selectPlaylistStage: false,
          playQuizStage: false,
          finalResultsStage: false,
        });
      }
    }
  }, [error, setQuizStage]);
}
