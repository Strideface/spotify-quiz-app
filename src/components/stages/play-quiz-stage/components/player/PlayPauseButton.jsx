/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { resumePlayback, pausePlayback } from "../../../../../util/spotify-api";
import { useOutletContext } from "react-router-dom";
import { Button } from "@nextui-org/button";
import PlayButtonIcon from "../../../../../images/PlayButtonIcon";
import PauseButtonIcon from "../../../../../images/PauseButtonIcon";

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
  const { quizData } = useOutletContext();
  const play = useRef();
  const pause = useRef();

  const handlePlayOnClick = async () => {
    try {
      await resumePlayback(
        quizData.current.quizTracks &&
          quizData.current.quizTracks[activeTrackIndex.current].track.uri,
        // resumeFromStart param true if track finished. This is to handle tracks shorter than their full lentgh
        // i.e. when progressMax is configured to a custom length (at time of writing, such as in medium or hard mode). Effectively repeating the track.
        progressValue >= progressMax ? true : false
      );
      if (progressValue >= progressMax) {
        setProgressValue(0);
      }
      setIsPlay((prevState) => {
        return !prevState;
      });
      // reset error is there was an error before
      if (error) {
        setError("");
      }
    } catch (error) {
      setError(error);
      // eslint-disable-next-line no-console
      console.log(error);
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
      // eslint-disable-next-line no-console
      console.log(error);
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
    <Button
      ref={play}
      onPress={handlePlayOnClick}
      color="success"
      endContent={<PlayButtonIcon />}
      size="lg"
      radius="full"
      variant="bordered"
    >
      <p className=" hidden sm:block">Play</p>
    </Button>
  );

  const pauseButton = (
    <Button
      ref={pause}
      onPress={handlePauseOnClick}
      color="success"
      endContent={<PauseButtonIcon />}
      size="lg"
      radius="full"
      variant="bordered"
    >
      <p className=" hidden sm:block">Pause</p>
    </Button>
  );

  return <>{isPlay ? pauseButton : playButton}</>;
}
