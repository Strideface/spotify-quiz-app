import { useRef } from "react";
import { resumePlayback } from "../../../../../util/spotify-api";
import { useOutletContext } from "react-router-dom";
import { Button } from "@nextui-org/button";

export default function RepeatButton({
  isPlay,
  setIsPlay,
  activeTrackIndex,
  error,
  setError,
  setProgressValue,
}) {
  // https://icons.getbootstrap.com/icons/arrow-repeat/
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
      // reset error is there was an error before
      if (error) {
        setError("");
      }
    } catch (error) {
      setError(error);
    }
  };

  const repeatButtonIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="#1ed760" // spotify-green-2
      className="bi bi-arrow-repeat"
      viewBox="0 0 16 16"
    >
      <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
      <path
        fillRule="evenodd"
        d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"
      />
    </svg>
  );

  const repeatButton = (
    <Button
      ref={repeat}
      onPress={handleRepeatOnClick}
      color="success"
      endContent={repeatButtonIcon}
      size="lg"
      radius="full"
      variant="bordered"
    >
      <p className=" hidden sm:block">Repeat</p>
    </Button>
  );

  return repeatButton;
}
