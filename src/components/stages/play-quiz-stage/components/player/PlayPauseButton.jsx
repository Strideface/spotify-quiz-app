/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { resumePlayback, pausePlayback } from "../../../../../util/spotify-api";
import { useOutletContext } from "react-router-dom";

export default function PlayPauseButton({
  isPlay,
  setIsPlay,
  activeTrackIndex,
  error,
  setError,
  progressMax,
  progressValue,
  setProgressValue,
  timerIsFinished,
}) {
  // https://icons.getbootstrap.com/icons/play-circle-fill/
  // https://icons.getbootstrap.com/icons/pause-circle/
  const { quizData } = useOutletContext();
  const play = useRef();
  const pause = useRef();

  const handlePlayOnClick = async () => {
    try {
      await resumePlayback(
        quizData.current.quizTracksUri &&
          quizData.current.quizTracksUri[activeTrackIndex.current],
          // resumeFromStart param true if track finished. This is to handle tracks shorter than their full lentgh 
          // i.e. when progressMax is configured to a custom length. Effectively repeating the track.
        (progressValue >= progressMax ? true : false)
      );
      if (progressValue >= progressMax) {
        setProgressValue(0);
      }
      setIsPlay((prevState) => {
        return !prevState;
      });
      if (error) {
        setError("");
      }
    } catch (error) {
      setError(error);
    }
  };

  const handlePauseOnClick = async () => {
    try {
      await pausePlayback();
      setIsPlay((prevState) => {
        return !prevState;
      });
      if (error) {
        setError("");
      }
    } catch (error) {
      setError(error);
    }
  };

  // this side effect plays the track automatically if timer has not run out, therefore the quiz is in play.
  useEffect(() => {
    if (!timerIsFinished) {
      handlePlayOnClick();
    }
  }, [timerIsFinished]);

  // this side effect pauses the track after progressMax is reached, if difficulty is set to medium or hard.
  // on these difficulty settings, a track should only be played for a limited amount of time 
  // progressMax should reflect this custom length
  useEffect(() => {
    if (
      quizData.current.difficulty !== "easy" &&
      progressValue >= progressMax
    ) {
      handlePauseOnClick();
    }
  }, [progressValue]);

  const playButton = (
    <button ref={play} type="button" value="play" onClick={handlePlayOnClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        fillRule="currentColor"
        className="bi bi-play-circle-fill"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
      </svg>
    </button>
  );

  const pauseButton = (
    <button
      ref={pause}
      type="button"
      value="pause"
      onClick={handlePauseOnClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        fillRule="currentColor"
        className="bi bi-pause-circle"
        viewBox="0 0 16 16"
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0z" />
      </svg>
    </button>
  );

  return (
    <>
      {isPlay ? pauseButton : playButton}
      {error && <p>{error.message}</p>}
    </>
  );
}
