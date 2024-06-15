import { useRef, useState } from "react";
import PlayPauseButton from "./PlayPauseButton";
import RepeatButton from "./RepeatButton";
import ProgressBar from "./ProgressBar";

export default function PlayerControl({ activeTrackIndex }) {
  const [isPlay, setIsPlay] = useState(false);
  const [error, setError] = useState("");
  const [progressMax, setProgressMax] = useState();
  const [progressValue, setProgressValue] = useState(0);
  const intervalId = useRef();

  // note sure where this goes yet
  const handleProgress = () => {
    intervalId.current = setInterval(() => {
      if (progressValue >= progressMax) {
        setIsPlay(false);
        clearInterval(intervalId.current);
        console.log("Track finished");
      }
      setProgressValue((prevState) => {
        return prevState + 1000;
      });
      console.log(progressValue);
    }, 1000);
  };

  return (
    <div className=" flex flex-col p-5 justify-center">
      <div className=" flex p-5 space-x-4 justify-center border">
        <RepeatButton
          isPlay={isPlay}
          setIsPlay={setIsPlay}
          activeTrackIndex={activeTrackIndex}
          error={error}
          setError={setError}
          handleProgress={handleProgress}
          intervalId={intervalId}
        />
        <PlayPauseButton
          isPlay={isPlay}
          setIsPlay={setIsPlay}
          activeTrackIndex={activeTrackIndex}
          error={error}
          setError={setError}
          setProgressMax={setProgressMax}
          handleProgress={handleProgress}
          intervalId={intervalId}
        />
      </div>
      <div className=" flex p-5 justify-center">
        <ProgressBar progressMax={progressMax} progressValue={progressValue} />
      </div>
    </div>
  );
}
