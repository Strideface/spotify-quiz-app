import { useOutletContext } from "react-router-dom";
import { fetchPlaylistTracks } from "../../util/spotify-api";
import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../LoadingIndicator";

export default function PlayQuizStage() {
  const { quizData } = useOutletContext();

  const {
    data: playlistTracksData,
    error: playlistTracksError,
    isError: playlistTracksIsError,
    isLoading: playlistTracksIsLoading,
  } = useQuery({
    queryFn: () => fetchPlaylistTracks(quizData.current.playlistTracksHref),
    queryKey: ["fetchPlaylistTracks"],
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Only get playlist tracks once. Data is never considered old so no auto refetches.
  });

  return (
    <>
      <h1 className=" flex p-10 justify-center">Play Quiz Stage</h1>
      {playlistTracksIsLoading && <LoadingIndicator />}
      {playlistTracksData && <h2>Quiz Ready</h2>}
      {playlistTracksIsError && <p>Error: {playlistTracksError.message}</p>}
    </>
  );
}
