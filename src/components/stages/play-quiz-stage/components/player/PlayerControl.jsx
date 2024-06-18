import { useEffect, useRef, useState } from "react";
import PlayPauseButton from "./PlayPauseButton";
import RepeatButton from "./RepeatButton";
import ProgressBar from "./ProgressBar";
import { useOutletContext } from "react-router-dom";

export default function PlayerControl({ activeTrackIndex }) {
  const [isPlay, setIsPlay] = useState(false);
  const [error, setError] = useState("");
  const [progressMax, setProgressMax] = useState();
  const [progressValue, setProgressValue] = useState(0);
  const intervalId = useRef();
  const { quizData } = useOutletContext();

  useEffect(() => {
    if (quizData.current.quizTracks) {
      setProgressMax(
        quizData.current.quizTracks[activeTrackIndex.current]?.track?.duration
      );
      console.log(
        `duration within useEffect ${
          quizData.current?.quizTracks[activeTrackIndex.current]?.track
            ?.duration
        }`
      );
    }
    console.log(`progress max within useEffect ${progressMax}`);
  }, [activeTrackIndex, quizData, quizData.current.quizTracks]);

  // This useEffect controls the progress bar value, when it runs, when it stops, when it resets.
  // although progressValue should change and cause a re-render every second,
  // useEffect function only runs if isPlay is true.
  useEffect(() => {
    console.log(`progress value within progress useEffect = ${progressValue}`);
    if (isPlay) {

      if (progressValue === progressMax) {
        // clearInterval(intervalId.current);
        console.log("Track finished");
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

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
      }

    

  }, [isPlay, progressMax, progressValue])


  

  // const handleProgress = () => {
  //   console.log(`progress value within handleProgress = ${progressValue}`);

  //   intervalId.current = setInterval(() => {
  //     setProgressValue((prevState) => {
  //       return prevState + 1000;
  //     });
  //   }, 1000);
  // };

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
          intervalId={intervalId}
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

          // handleProgress={handleProgress}
          intervalId={intervalId}
        />
      </div>
      <div className=" flex p-5 justify-center">
        <ProgressBar progressMax={progressMax} progressValue={progressValue} />
      </div>
    </div>
  );
}
