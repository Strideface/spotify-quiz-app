import { useState } from "react";
import PlayPauseButton from "./PlayPauseButton";
import RepeatButton from "./RepeatButton";

export default function PlayerControl({ activeTrackIndex }) {
  const [isPlay, setIsPlay] = useState(false);

  return (
    <div className=" flex p-10 space-x-4 justify-center border">
      <RepeatButton
        isPlay={isPlay}
        setIsPlay={setIsPlay}
        activeTrackIndex={activeTrackIndex}
      />
      <PlayPauseButton
        isPlay={isPlay}
        setIsPlay={setIsPlay}
        activeTrackIndex={activeTrackIndex}
      />
    </div>
  );
}
