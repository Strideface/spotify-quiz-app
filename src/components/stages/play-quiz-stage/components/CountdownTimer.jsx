import { useEffect, useRef, useState } from "react";

export default function CountdownTimer({ maxTimeLimit, setTimerIsFinished }) {
  const [remainingTime, setRemainingTime] = useState(maxTimeLimit);
  const intervalId = useRef();

  useEffect(() => {
    if (remainingTime === 0) {
      setTimerIsFinished((prevState) => {
        return !prevState;
      });
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
  }, [remainingTime, setRemainingTime, setTimerIsFinished]);

  return (
  <div className=" flex">
    <h2>Time Remaining: {remainingTime}</h2>
  </div>
  );
}
