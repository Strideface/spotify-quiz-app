import { useRef } from "react";
import { resumePlayback } from "../../../../../util/spotify-api";
import { useOutletContext } from "react-router-dom";
import { Button } from "@nextui-org/button";
import RepeatButtonIcon from "../../../../../images/RepeatButtonIcon";

export default function RepeatButton({
  isPlay,
  setIsPlay,
  activeTrackIndex,
  error,
  setError,
  setProgressValue,
}) {
  const repeat = useRef();
  const { quizData } = useOutletContext();

  const handleRepeatOnClick = async () => {
    try {
      await resumePlayback(
        quizData.current.quizTracks &&
          quizData.current.quizTracks[activeTrackIndex.current].track.uri,
        true
      );
      setProgressValue(0);
      if (!isPlay) {
        setIsPlay(true);
      }
      // reset error if there was an error before
      if (error) {
        setError("");
      }
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  const repeatButton = (
    <Button
      ref={repeat}
      onPress={handleRepeatOnClick}
      color="success"
      endContent={<RepeatButtonIcon />}
      size="lg"
      radius="full"
      variant="bordered"
    >
      <p className=" hidden sm:block">Repeat</p>
    </Button>
  );

  return repeatButton;
}
