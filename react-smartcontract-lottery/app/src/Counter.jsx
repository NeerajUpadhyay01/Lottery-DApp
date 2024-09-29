import React, { useEffect, useState } from "react";

function Counter({ interval }) {
//   console.log(interval)
  const [remainingTime, setRemainingTime] = useState(interval);
  const [isRunning, setIsRunning] = useState(false);
  let intervalId;

  const startCountdown = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalId = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(intervalId);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }
  };

  const resetCountdown = () => {
    setIsRunning(false);
    clearInterval(intervalId);
    setRemainingTime(10 * 60);
  };

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div id="interval">
      <div>{formatTime(remainingTime)}</div>
    </div>
  );
}

export default Counter;
