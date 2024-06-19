import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchPlaylistTracks } from "../../../../util/spotify-api";
import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../../../LoadingIndicator";
import SearchBar from "./SearchBar";
import PlayerControl from "./player/PlayerControl";
import Modal from "../../../Modal";

export default function Quiz() {
  const activeTrackIndex = useRef();
  const [userResponse, setUserResponse] = useState([]);
  const resultModal = useRef();
  const totalPoints = useRef(0);
  const artistIsCorrect = useRef();
  const trackIsCorrect = useRef();

  activeTrackIndex.current = userResponse.length;
  console.log(activeTrackIndex.current);
  console.log(`userResponse in Quiz.jsx = ${userResponse}`);

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
      quizData.current.quizTracks = playlistTracksData.quizTracks;
      quizData.current.quizTracksUri = playlistTracksData.quizTracksUri;
      console.log(quizData.current);
    }
  }, [playlistTracksData, quizData]);

  useEffect(() => {
    if (userResponse.length > 0) {

      if (
        userResponse[activeTrackIndex.current - 1].artist.id ===
        quizData.current.quizTracks[activeTrackIndex.current - 1].artist[0].id
      ) {
        artistIsCorrect.current = true;
        totalPoints.current += 1;
      } else {
        artistIsCorrect.current = false;
      }
  
      if (
        userResponse[activeTrackIndex.current - 1].track.id ===
        quizData.current.quizTracks[activeTrackIndex.current - 1].track.id
      ) {
        trackIsCorrect.current = true;
        totalPoints.current += 1;
      } else {
        trackIsCorrect.current = false;
      }
  
      resultModal.current.open();
      
    }
    
  }, [quizData, userResponse]);

  // const checkSubmittedAnswer = () => {
  //   console.log(`userResponse in checkSubmittedAnswer = ${userResponse}`)
  //   console.log(quizData.current.quizTracks[activeTrackIndex.current -1])

  //   if (
  //     userResponse[activeTrackIndex.current - 1].artist.id ===
  //     quizData.current.quizTracks[activeTrackIndex.current - 1].artist[0]
  //     .id
  //   ) {
  //     artistIsCorrect.current = true;
  //     totalPoints.current += 1
  //   } else {
  //     artistIsCorrect.current = false;
  //   }

  //   if (
  //     userResponse[activeTrackIndex.current - 1].track.id ===
  //     quizData.current.quizTracks[activeTrackIndex.current - 1].track.id
  //   ) {
  //     trackIsCorrect.current = true;
  //     totalPoints.current += 1
  //   } else {
  //     trackIsCorrect.current = false;
  //   }

  //   resultModal.current.open();
  // };

  const handleModalOnClick = () => resultModal.current.close();

  return (
    <>
      <Modal ref={resultModal} title="Results">
        <div className=" flex p-5 justify-center space-y-5">
          <p
            className={
              artistIsCorrect ? " text-spotify-green" : " text-red-500"
            }
          >
            {artistIsCorrect ? "Correct!" : "Incorrect"}
          </p>
          <p>
            Artist:
            {quizData.current.quizTracks &&
              quizData.current.quizTracks[activeTrackIndex.current - 1]
                .artist[0].name}
          </p>
          <p
            className={trackIsCorrect ? " text-spotify-green" : " text-red-500"}
          >
            {trackIsCorrect ? "Correct!" : "Incorrect"}
          </p>
          <p>
            Track:
            {quizData.current.quizTracks &&
              quizData.current?.quizTracks[activeTrackIndex.current - 1].track
                .name}
          </p>
          <div>
            <button type="button" onClick={handleModalOnClick}>Next Track</button>
          </div>
        </div>
      </Modal>
      <div className=" flex flex-col p-10 justify-center space-y-10">
        {playlistTracksIsLoading && <LoadingIndicator />}
        {playlistTracksData && (
          <>
            <div className=" flex p-10 justify-center">
              <h2>Quiz Tracks Ready</h2>
            </div>
            <div className=" flex flex-col p-10 justify-center border">
              <SearchBar
                key={activeTrackIndex.current}
                activeTrackIndex={activeTrackIndex}
                setUserResponse={setUserResponse}
              />
            </div>
            <div className=" flex flex-col p-10 justify-center border">
              <PlayerControl
                key={activeTrackIndex.current}
                activeTrackIndex={activeTrackIndex}
              />
            </div>
          </>
        )}

        {playlistTracksIsError && <p>Error: {playlistTracksError.message}</p>}
      </div>
    </>
  );
}
