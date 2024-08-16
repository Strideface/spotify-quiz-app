import { useEffect, useRef, useState } from "react";
import PlayPauseButton from "./PlayPauseButton";
import RepeatButton from "./RepeatButton";
import ProgressBar from "./ProgressBar";
import { useOutletContext } from "react-router-dom";
import { Card, CardBody, CardFooter } from "@nextui-org/card";

export default function PlayerControl({ activeTrackIndex, timerIsFinished }) {
  const [isPlay, setIsPlay] = useState(false);
  const [error, setError] = useState("");
  const [progressMax, setProgressMax] = useState();
  const [progressValue, setProgressValue] = useState(0);
  const intervalId = useRef();
  const { quizData } = useOutletContext();

  // This useEffect queries the tracks data once it is ready, as it is dependant on an async fetch call in Quiz.jsx (playlistTracksData)
  // it then sets the progressMax value (how long the track should play for) which can be configured here.
  useEffect(() => {
    if (quizData.current.quizTracks) {
      if (quizData.current.difficulty === "easy") {
        setProgressMax(
          quizData.current.quizTracks[activeTrackIndex.current]?.track?.duration
        );
      }
      if (quizData.current.difficulty === "medium") {
        setProgressMax(30000);
      }
      if (quizData.current.difficulty === "hard") {
        setProgressMax(10000);
      }
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
      <Card isFooterBlurred classNames={{base: " bg-foreground", body: " flex-row p-5 space-x-4 justify-center" }}>
        <CardBody>
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
        </CardBody>

        <CardFooter>
          <ProgressBar
            progressMax={progressMax}
            progressValue={progressValue}
          />
        </CardFooter>
      </Card>
      {/* </div> */}
      {/* <div className=" flex p-5 justify-center">
        <ProgressBar progressMax={progressMax} progressValue={progressValue} />
      </div> */}
    </div>
  );
}
