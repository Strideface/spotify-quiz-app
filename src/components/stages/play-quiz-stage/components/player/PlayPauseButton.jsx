import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { resumePlayback, pausePlayback } from "../../../../../util/spotify-api";
import { useOutletContext } from "react-router-dom";

export default function PlayPauseButton({
  isPlay,
  setIsPlay,
  activeTrackIndex,
}) {
  // https://icons.getbootstrap.com/icons/play-circle-fill/
  // https://icons.getbootstrap.com/icons/pause-circle/
  const { quizData } = useOutletContext();
  const play = useRef();
  const pause = useRef();
  const [error, setError] = useState("");

  // const {
  //   data: resumeData,
  //   isLoading: resumeIsLoading,
  //   isError: resumeIsError,
  //   error: resumeError,
  //   refetch: refetchResume,
  //   isSuccess: resumeIsSuccess,
  //   status: resumeStatus,
  // } = useQuery({
  //   // need to pass in track uri conditionally because the value being there depends on the data being loaded in Quiz.jsx
  //   queryFn: () =>
  //     resume(
  //       quizData.current.quizTracksUri &&
  //         quizData.current.quizTracksUri[activeTrackIndex.current]
  //     ),
  //   queryKey: [
  //     "resume",
  //     {
  //       track:
  //         quizData.current.quizTracksUri &&
  //         quizData.current.quizTracksUri[activeTrackIndex.current],
  //     },
  //   ],
  //   enabled: false,
  //   refetchOnWindowFocus: false,
  //   retry: 1,
  // });

  // const {
  //   data: pauseData,
  //   isError: pauseIsError,
  //   error: pauseError,
  //   refetch: refetchPause,
  //   status: pauseStatus,
  // } = useQuery({
  //   queryFn: () => pause(),
  //   queryKey: ["pause"],
  //   enabled: false,
  //   refetchOnWindowFocus: false,
  //   retry: 1,
  // });

  console.log(
    `track uri inside PlayPauseButton = ${
      quizData.current.quizTracksUri &&
      quizData.current.quizTracksUri[activeTrackIndex.current]
    }`
  );

  // MAY NEED TO USE USEEFFECT HERE
  const handlePlayOnClick = async () => {
    try {
      await resumePlayback(
        quizData.current.quizTracksUri &&
          quizData.current.quizTracksUri[activeTrackIndex.current]
      );
      setError("");
      setIsPlay((prevState) => {
        return !prevState;
      });
    } catch (error) {
      setError(error);
    }
  };

  const handlePauseOnClick = async () => {
    try {
      await pausePlayback();
      setError("");
      setIsPlay((prevState) => {
        return !prevState;
      });
    } catch (error) {
      setError(error);
    }
  };

  // useEffect(() => {
  //   console.log(`resumeStatus = ${resumeStatus}`);
  //   console.log(`resumeData = ${resumeData}`);
  //   if (resumeStatus === "success") {
  //     setIsPlay((prevState) => {
  //       return !prevState;
  //     });
  //   }

  //   if (pauseStatus === "success") {
  //     setIsPlay((prevState) => {
  //       return !prevState;
  //     });
  //   }
  // }, [pauseStatus, resumeData, resumeStatus, setIsPlay]);

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

  // eslint-disable-next-line no-lone-blocks
  // {
  //   resumeIsError && console.log(`resumeError = ${resumeError}`);
  // }

  return (
    <>
      {isPlay ? pauseButton : playButton}
      {error && <p>{error.message}</p>}
    </>
  );
}