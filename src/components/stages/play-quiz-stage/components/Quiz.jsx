import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchPlaylistTracks } from "../../../../util/spotify-api";
import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../../../LoadingIndicator";
import AnswerSelection from "./AnswerSelection";
import PlayerControl from "./player/PlayerControl";
import Modal from "../../../Modal";
import CountdownTimer from "./CountdownTimer";

export default function Quiz() {
  const activeTrackIndex = useRef();
  const [userResponse, setUserResponse] = useState([]);
  const [timerIsFinished, setTimerIsFinished] = useState(false);
  const artistIsCorrect = useRef();
  const trackIsCorrect = useRef();
  const resultModal = useRef();

  activeTrackIndex.current = userResponse.length;

  console.log(activeTrackIndex.current);

  const { quizData, setQuizStage } = useOutletContext();

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

  // this useEffect opens the results modal to show the result of the latest answer submission
  useEffect(() => {
    if (userResponse.length > 0) {
      resultModal.current.open();
    }
  }, [userResponse]);

  const handleModalOnClick = () => {
    resultModal.current.close();
    // change UI to the final results stage once tracks are exhausted
    if (userResponse.length === quizData.current.quizTracks.length) {
      setQuizStage((prevState) => ({
        ...prevState,
        playQuizStage: false,
        finalResultsStage: true,
      }));
    } else {
      setTimerIsFinished(false);
    }
  };


  return (
    <>
      <Modal ref={resultModal} onClose={handleModalOnClick} title="Results">
        <div className=" flex p-5 justify-center space-y-5">
          <p
            className={
              artistIsCorrect.current ? " text-spotify-green" : " text-red-500"
            }
          >
            {artistIsCorrect.current ? "Correct!" : "Incorrect"}
          </p>
          <p>
            Artist:
            {userResponse.length > 0 &&
              quizData.current.quizTracks[activeTrackIndex.current - 1]
                .artist[0].name}
          </p>
          <p
            className={
              trackIsCorrect.current ? " text-spotify-green" : " text-red-500"
            }
          >
            {trackIsCorrect.current ? "Correct!" : "Incorrect"}
          </p>
          <p>
            Track:
            {userResponse.length > 0 &&
              quizData.current?.quizTracks[activeTrackIndex.current - 1].track
                .name}
          </p>
          <div>
            <button type="button" onClick={handleModalOnClick}>
              {userResponse.length > 0 &&
              userResponse.length < quizData.current.quizTracks.length
                ? "Next Track"
                : "See Results"}
            </button>
          </div>
        </div>
      </Modal>
      <div className=" flex flex-col p-10 justify-center space-y-10">
        {playlistTracksIsLoading && <LoadingIndicator />}
        {playlistTracksData && (
          <>
            <div className=" flex p-10 justify-center space-y-5">
              <h2>Track No: {activeTrackIndex.current + 1}</h2>
              {quizData.current.difficulty !== "easy" &&
                (!timerIsFinished ? (
                  <CountdownTimer
                    maxTimeLimit={5}
                    /* maxTimeLimit set at 30 seconds because both medium and hard have a 30s timer. Can be configurable */
                    setTimerIsFinished={setTimerIsFinished}
                  />
                ) : null)}
            </div>
            <div className=" flex flex-col p-10 justify-center border">
              <AnswerSelection
                key={activeTrackIndex.current}
                activeTrackIndex={activeTrackIndex}
                setUserResponse={setUserResponse}
                artistIsCorrect={artistIsCorrect}
                trackIsCorrect={trackIsCorrect}
                timerIsFinished={timerIsFinished}
                setTimerIsFinished={setTimerIsFinished}
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
