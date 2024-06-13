import { useState } from "react";
import PlayPauseButton from "./PlayPauseButton";
import RepeatButton from "./RepeatButton";
import ProgressBar from "./ProgressBar";

export default function PlayerControl({ activeTrackIndex }) {
  const [isPlay, setIsPlay] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className=" flex flex-col p-5 justify-center">
    <div className=" flex p-5 space-x-4 justify-center border">
      <RepeatButton
        isPlay={isPlay}
        setIsPlay={setIsPlay}
        activeTrackIndex={activeTrackIndex}
        setError={setError}
      />
      <PlayPauseButton
        isPlay={isPlay}
        setIsPlay={setIsPlay}
        activeTrackIndex={activeTrackIndex}
        error={error}
        setError={setError}
      />
    </div>
    <div className=" flex p-5 justify-center">
      <ProgressBar />
      </div>
      </div>
  );
}
