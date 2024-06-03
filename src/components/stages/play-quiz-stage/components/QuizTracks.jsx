import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchPlaylistTracks } from "../../../../util/spotify-api";
import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../../../LoadingIndicator";
import SearchBar from "./SearchBar";

export default function QuizTracks() {
  const activeTrackIndex = useRef();
  const [userResponse, setUserResponse] = useState([]);

  activeTrackIndex.current = userResponse.length;

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

  useEffect(() => {
    if (playlistTracksData) {
      quizData.current.quizTracks = playlistTracksData;
      console.log(quizData.current);
    }
  }, [playlistTracksData, quizData]);

  return (
    <div className=" flex p-10 justify-center">
      {playlistTracksIsLoading && <LoadingIndicator />}
      {playlistTracksData && (
        <div className=" flex flex-col p-10 justify-center">
          <h2>Quiz Tracks Ready</h2>
          <div className=" flex flex-col p-10 justify-center border">
            <SearchBar activeTrackIndex={activeTrackIndex} />
          </div>
          </div>
      )}

      {playlistTracksIsError && <p>Error: {playlistTracksError.message}</p>}
    </div>
  );
}
