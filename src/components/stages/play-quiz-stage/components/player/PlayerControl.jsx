import { useEffect, useRef, useState } from "react";
import PlayPauseButton from "./PlayPauseButton";
import RepeatButton from "./RepeatButton";
import ProgressBar from "./ProgressBar";
import { useOutletContext } from "react-router-dom";

export default function PlayerControl({ activeTrackIndex, timerIsFinished }) {
  const [isPlay, setIsPlay] = useState(false);
  const [error, setError] = useState("");
  const [progressMax, setProgressMax] = useState();
  const [progressValue, setProgressValue] = useState(0);
  const intervalId = useRef();
  const { quizData } = useOutletContext();

  // This useEffect gets the tracks data once it is ready, as it is dependant on an async fetch call in Quiz.jsx (playlistTracksData)
  useEffect(() => {
    if (quizData.current.quizTracks) {
      setProgressMax(
        quizData.current.quizTracks[activeTrackIndex.current]?.track?.duration
      );
    }
  }, [activeTrackIndex, quizData, quizData.current.quizTracks]);

  // This useEffect controls the progress bar value, when it runs, when it stops, when it resets.
  // although progressValue should change and cause a re-render every second,
  // useEffect function only runs if isPlay is true.
  useEffect(() => {
    if (isPlay) {
      if (progressValue >= progressMax) {
        setIsPlay((prevState) => {
          return !prevState;
        });
      } else {
        intervalId.current = setInterval(() => {
          setProgressValue((prevState) => {
            return prevState + 1000;
          });
        }, 1000);
      }
    }

    //The clearInterval method is used inside the useEffect cleanup function
    //to stop the interval when the component unmounts.
    //this means a new interval function is being set on every render which prevents 'Memory leaks'
    //see: https://www.geeksforgeeks.org/how-to-use-setinterval-method-inside-react-components/

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [isPlay, progressMax, progressValue]);

  return (
    <div className=" flex flex-col p-5 justify-center">
      <div className=" flex p-5 space-x-4 justify-center border">
        <RepeatButton
          isPlay={isPlay}
          setIsPlay={setIsPlay}
          activeTrackIndex={activeTrackIndex}
          error={error}
          setError={setError}
          setProgressValue={setProgressValue}
        />
        <PlayPauseButton
          isPlay={isPlay}
          setIsPlay={setIsPlay}
          activeTrackIndex={activeTrackIndex}
          error={error}
          setError={setError}
          progressMax={progressMax}
          progressValue={progressValue}
          setProgressValue={setProgressValue}
          timerIsFinished={timerIsFinished}
        />
      </div>
      <div className=" flex p-5 justify-center">
        <ProgressBar progressMax={progressMax} progressValue={progressValue} />
      </div>
    </div>
  );
}
