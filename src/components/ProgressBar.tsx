import React, { useState, useEffect } from "react";

export interface ProgressBarProps {
  timer: number;
}

const INTERVAL = 10;

export default function ProgressBar({ timer }: ProgressBarProps) {
  const [remainingTime, setRemainingTime] = useState(timer);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - INTERVAL);
    }, INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);
  
  return <progress value={remainingTime} max={timer} />;
}
