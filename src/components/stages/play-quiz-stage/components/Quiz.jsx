import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchPlaylistTracks } from "../../../../util/spotify-api";
import { useQuery } from "@tanstack/react-query";
import { shuffleArray } from "../../../../util/util";
import LoadingIndicator from "../../../LoadingIndicator";
import AnswerSelection from "./AnswerSelection";
import PlayerControl from "./player/PlayerControl";
import Modal from "../../../Modal";
import CountdownTimer from "./CountdownTimer";
import { Chip } from "@nextui-org/chip";

export default function Quiz({ inPlay, setTracksReady }) {
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
        quizData.current.userDetails.country,
        quizData.current.quizTotalTracks,
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
      // shuffle order of tracks before assignment
      shuffleArray(playlistTracksData);
      quizData.current.quizTracks = playlistTracksData;
      console.log(quizData.current);
      // inform parent component that quiz can be started.
      setTracksReady(true);
    }
  }, [playlistTracksData, quizData, setTracksReady]);

  // inPlay will only change once, when user closes modal in the parent component. Set timer when inPlay changes.
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

      <div className=" flex flex-col justify-center space-y-10 m-auto md:w-2/3">
        {playlistTracksIsLoading && <LoadingIndicator />}
        {playlistTracksData && (
          <>
            <div className=" flex p-5 md:p-10 justify-center space-x-5">
              {/* show current track number as long as there's tracks left */}
              {activeTrackIndex.current + 1 <=
                quizData.current?.quizTracks?.length && (
                  <Chip size="lg" className=" md:text-sm-screen-2">Track No: {activeTrackIndex.current + 1}</Chip>
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
            <div className="flex-col p-10 justify-center space-y-2 border-medium border-foreground rounded-md">
              <AnswerSelection
                key={activeTrackIndex.current}
                activeTrackIndex={activeTrackIndex}
                setUserResponse={setUserResponse}
                artistIsCorrect={artistIsCorrect}
                trackIsCorrect={trackIsCorrect}
                setTimerIsFinished={setTimerIsFinished}
              />
            </div>
            <div className="flex-col p-10 justify-center border-medium border-foreground rounded-md">
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
