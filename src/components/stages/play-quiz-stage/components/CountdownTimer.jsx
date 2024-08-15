import { Chip } from "@nextui-org/chip";
import { useEffect, useRef, useState } from "react";

export default function CountdownTimer({
  maxTimeLimit,
  setTimerIsFinished,
  handleTimerIsFinished,
}) {
  const [remainingTime, setRemainingTime] = useState(maxTimeLimit);
  const intervalId = useRef();

  // check if time has run out else continue to decrease timer
  useEffect(() => {
    if (remainingTime === 0) {
      setTimerIsFinished(true);
      handleTimerIsFinished();
    } else {
      intervalId.current = setInterval(() => {
        setRemainingTime((prevState) => {
          return prevState - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [
    handleTimerIsFinished,
    remainingTime,
    setRemainingTime,
    setTimerIsFinished,
  ]);

  const timerIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-stopwatch-fill"
      viewBox="0 0 16 16"
    >
      <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584l.013-.012.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354-.012.012A6.97 6.97 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0" />
    </svg>
  );

  return (
    <Chip size="lg" className=" md:text-sm-screen-2" color={remainingTime < 11 ? "danger" : "primary"} startContent={timerIcon}>
      : {remainingTime}
    </Chip>
  );
}
