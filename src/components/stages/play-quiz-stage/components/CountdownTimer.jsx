import { Chip } from "@nextui-org/chip";
import { useEffect, useRef, useState } from "react";
import TimerIcon from "../../../../images/TimerIcon";

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

  return (
    <Chip
      size="lg"
      className=" md:text-sm-screen-2"
      color={remainingTime < 11 ? "danger" : "primary"}
      startContent={
        <TimerIcon remainingTime={remainingTime} maxTimeLimit={maxTimeLimit} />
      }
      classNames={{ content: " font-medium" }}
    >
      : {remainingTime}
    </Chip>
  );
}
