import { useOutletContext } from "react-router-dom";
import { fetchPlaylistTracks } from "../../../../util/spotify-api";
import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../../../LoadingIndicator";
import { useEffect } from "react";

export default function CustomQuiz() {
  const { quizData } = useOutletContext();

  const {
    data: playlistTracksData,
    error: playlistTracksError,
    isError: playlistTracksIsError,
    isLoading: playlistTracksIsLoading,
  } = useQuery({
    queryFn: () =>
      fetchPlaylistTracks(
        quizData.current.playlistTracksHref,
        quizData.current.userDetails.country
      ),
    queryKey: [
      "fetchPlaylistTracks",
      { tracks: quizData.current.playlistTracksHref },
    ],
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Only get playlist tracks once. Data is never considered old so no auto refetches.
  });
  // the query is not caching previous results, probably due to what's in the response header
  // 'Cache-Control: public, max-age=0'

  // useEffect(() => {
  //   if (playlistTracksData) {

  //   }
  // },[]);

  return (
    <>
      <h1 className=" flex p-10 justify-center">Play Quiz Stage</h1>
      {playlistTracksIsLoading && <LoadingIndicator />}
      {playlistTracksData && <h2>Quiz Ready</h2>}
      {playlistTracksIsError && <p>Error: {playlistTracksError.message}</p>}
    </>
  );
}
