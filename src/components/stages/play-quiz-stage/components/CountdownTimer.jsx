import { useEffect, useRef, useState } from "react";

export default function CountdownTimer({ maxTimeLimit, setTimerIsFinished, handleTimerIsFinished }) {
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
  }, [handleTimerIsFinished, remainingTime, setRemainingTime, setTimerIsFinished]);

  return (
  <div className=" flex">
    <h2>Time Remaining: {remainingTime}</h2>
  </div>
  );
}
