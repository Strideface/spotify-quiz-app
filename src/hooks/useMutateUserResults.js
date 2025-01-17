import { useMutation } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { convertToPercentageScore } from "../util/util";
import { addUserResult } from "../util/firestoreDB-api";

//TODO: Invalidate query key for fetchUserResults in case you add a result but user results was last fetched within 60 secs.
// this is because you have a 60sec stale time on that query. 

// A custom mutation hook just for adding a user result to the DB
// As of writting, the mutation function that is returned is invoked in Quiz.jsx when user selects 'see results'
// A key is added so that the status of the mutation (success, error) can be read in ResultsSavedBanner.jsx

export function useMutateUserResults() {
  const { quizData } = useOutletContext();

  const percentageScore = convertToPercentageScore(
    quizData.current.quizResults.totalPoints,
    quizData.current.quizTotalTracks
  );

  const { mutate } = useMutation({
    mutationKey: ["addUserResult"],
    mutationFn: () => addUserResult({
      genre: "ROCK",
      //quizData.current.genre
      playlist: {
        id: quizData.current.playlist.id,
        name: quizData.current.playlist.name,
      },
      quizResults: {
        percentageScore,
        totalCorrectArtists: quizData.current.quizResults.totalCorrectArtists,
        totalCorrectTracks: quizData.current.quizResults.totalCorrectTracks,
        totalPoints: quizData.current.quizResults.totalPoints,
        totalSkipped: quizData.current.quizResults.totalSkipped,
        totalTimerFinished: quizData.current.quizResults.totalTimerFinished,
      },
      userId: quizData.current.userDetails.userId,
    }),
    retry: 2,
  });

  return mutate;
}
