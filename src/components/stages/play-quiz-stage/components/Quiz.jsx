import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchPlaylistTracks } from "../../../../util/spotify-api";
import { useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../../../LoadingIndicator";
import AnswerSelection from "./AnswerSelection";
import PlayerControl from "./player/PlayerControl";
import Modal from "../../../Modal";
import CountdownTimer from "./CountdownTimer";

export default function Quiz({ inPlay }) {
  const activeTrackIndex = useRef();
  const [userResponse, setUserResponse] = useState([]);
  const [timerIsFinished, setTimerIsFinished] = useState(true);
  const artistIsCorrect = useRef();
  const trackIsCorrect = useRef();
  const resultModal = useRef();

  activeTrackIndex.current = userResponse.length;

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

  // get quiz tracks result from fetchPlaylistTracks once available
  useEffect(() => {
    if (playlistTracksData) {
      quizData.current.quizTracks = playlistTracksData.quizTracks;
      quizData.current.quizTracksUri = playlistTracksData.quizTracksUri;
      console.log(quizData.current);
    }
  }, [playlistTracksData, quizData]);

  // inPlay will only change once, when user closes modal in CustomQuiz. Set timer when inPlay changes.
  useEffect(() => {
    if (inPlay) {
      setTimerIsFinished(false);
    }
  }, [inPlay, setTimerIsFinished]);

  // this useEffect opens the results modal to show the result of the latest answer submission
  useEffect(() => {
    if (userResponse.length > 0) {
      resultModal.current.open();
    }
  }, [userResponse]);

  // handles scenario where timer runs out
  const handleTimerIsFinished = () => {
    quizData.current.quizResults.totalTimerFinished += 1;
    artistIsCorrect.current = false;
    trackIsCorrect.current = false;
    setUserResponse((prevState) => {
      return [...prevState, "TIMER-FINISHED"];
    });
  };

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
              {/* show current track number as long as there's tracks left */}
              {activeTrackIndex.current + 1 <=
                quizData.current?.quizTracks?.length && (
                <h2>Track No: {activeTrackIndex.current + 1}</h2>
              )}
              {/* only render timer if it's not on easy mode and if the quiz is in play with time on the clock */}
              {quizData.current.difficulty !== "easy" &&
                (!timerIsFinished ? (
                  <CountdownTimer
                    maxTimeLimit={
                      quizData.current.difficulty === "medium" ? 60 : 30
                    }
                    /* maxTimeLimit changes depending if difficulty is medium or hard. Configured in this ternary statement */
                    setTimerIsFinished={setTimerIsFinished}
                    handleTimerIsFinished={handleTimerIsFinished}
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
                setTimerIsFinished={setTimerIsFinished}
              />
            </div>
            <div className=" flex flex-col p-10 justify-center border">
              <PlayerControl
                key={activeTrackIndex.current}
                activeTrackIndex={activeTrackIndex}
                timerIsFinished={timerIsFinished}
              />
            </div>
          </>
        )}

        {playlistTracksIsError && <p>Error: {playlistTracksError.message}</p>}
      </div>
    </>
  );
}
