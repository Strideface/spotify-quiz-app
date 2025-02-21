import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { convertToPercentageScore } from "../util/util";
import { addUserResult } from "../util/firestoreDB-api";

// A custom mutation hook just for adding a user result to the DB
// As of writting, the mutation function that is returned is invoked in Quiz.jsx when user selects 'see results'
// A key is added so that the status of the mutation (success, error) can be read in ResultsSavedBanner.jsx

export function useMutateUserResults() {
  const { quizData } = useOutletContext();
  const queryClient = useQueryClient();

  const percentageScore = convertToPercentageScore(
    quizData.current.quizResults.totalPoints,
    quizData.current.quizTotalTracks
  );

  // ## ALWAYS ENSURE THE FIELDS IN USERRESULT DOC IN DB MATCH THE TABLE KEYS IN LEADERBOARD ##
  const { mutate } = useMutation({
    mutationKey: ["addUserResult"],
    mutationFn: () =>
      addUserResult({
        playlistId: quizData.current.playlist.id,
        playlistName: quizData.current.playlist.name,
        genre: quizData.current.playlist.genre,
        score: percentageScore,
        userId: quizData.current.userDetails.userId,
      }),
    // invalidate the query made in LeaderBoard component to ensure latest user result is shown, as cache for
    // that query may store old data now. Dependant on stale time set in that query and length of time it takes
    // for a user to navigate to the leaderboard and finish a compete quiz. E.g. If stale time is 60secs, and i look at the leaderboard...
    // then i start a compete quiz, app adds my results, then look at the leaderboard again, more than 60secs would have likely passed anyway
    // and query would fetch new data.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["fetchUserResults"] }),
    retry: 2,
  });

  return mutate;
}
