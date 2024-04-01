import { useState, useEffect } from "react";
import { Button } from "@mui/material/";
import { translations } from "./Translations";

const Timer = ({
  selectedTime,
  onTimerChange,
  onTypingSpeedTestFlowChange,
  typingSpeedTestFlow,
}) => {
  // State variables to manage timer and interval
  const [timer, setTimer] = useState(selectedTime); 
  const [timeInterval, setTimeInterval] = useState(selectedTime); 

  // Translations for button labels:
  const startTransl =
    translations[localStorage.getItem("chosenLanguage")]["start"];
  const continueTransl =
    translations[localStorage.getItem("chosenLanguage")]["continue"];
  const pauseTransl =
    translations[localStorage.getItem("chosenLanguage")]["pause"];
  const resetTransl =
    translations[localStorage.getItem("chosenLanguage")]["reset"];

  useEffect(() => {
    // Update the timer value when the selectedTime prop changes
    setTimer(selectedTime);
    setTimeInterval(selectedTime);
  }, [selectedTime]);

  useEffect(() => {
    // Trigger function to handle timer changes
    onTimerChange(timer);

    // If timer reaches 0, update the typing flow status
    if (timer === 0) {
      // let typingSpeedTestFlow = {
      //   init: false,
      //   start: false,
      //   running: false,
      //   pause: false,
      //   reset: false,
      //   endTime: true,
      // };
      onTypingSpeedTestFlowChange({
        init: false,
        start: false,
        running: false,
        pause: false,
        reset: false,
        endTime: true,
      });
    }
  }, [timer]);

  // Function to start the timer
  const startTimer = () => {
    // let typingSpeedTestFlow = {
    //   init: false,
    //   start: true,
    //   running: false,
    //   pause: false,
    //   reset: false,
    //   endTime: false,
    // };
    // Update typing flow status
    onTypingSpeedTestFlowChange({
      init: false,
      start: true,
      running: false,
      pause: false,
      reset: false,
      endTime: false,
    });

    // Start the timer interval
    setTimeInterval(
      setInterval(() => {
        // Decrease the timer value by 1 second
        setTimer((prev) => Math.max(0, prev - 1)); // Ensure the timer doesn't become negative
      }, 1000)
    );
  };

  // Function to continue the timer after the pause button
  const continueTimer = () => {
    if (typingSpeedTestFlow.start || typingSpeedTestFlow.pause) {
      // Use setInterval to update the timer every 1000 milliseconds (1 second)

      setTimeInterval(
        setInterval(() => {
          // Update the timer by decrementing the previous value by 1
          setTimer((prev) => Math.max(0, prev - 1)); // Ensure the timer doesn't go below 0
        }, 1000)
      );

      // let typingSpeedTestFlow = {
      //   init: false,
      //   start: false,
      //   running: true,
      //   pause: false,
      //   reset: false,
      //   endTime: false,
      // };
      // Update typing flow status
      onTypingSpeedTestFlowChange({
        init: false,
        start: false,
        running: true,
        pause: false,
        reset: false,
        endTime: false,
      });
    }
  };

  // Function to pause the timer
  const pauseTimer = () => {
    // Clear the interval to stop the timer from updating
    clearInterval(timeInterval);

    // let typingSpeedTestFlow = {
    //   init: false,
    //   start: false,
    //   running: false,
    //   pause: true,
    //   reset: false,
    //   endTime: false,
    // };
    // Update typing flow status
    onTypingSpeedTestFlowChange({
      init: false,
      start: false,
      running: false,
      pause: true,
      reset: false,
      endTime: false,
    });
  };

  // Function to reset the timer
  const resetTimer = () => {
    // Reset the timer value to the selectedTime converted to seconds
    setTimer(selectedTime);
// Trigger function to handle timer changes
    onTimerChange(selectedTime);
    // Clear the interval to stop the timer
    clearInterval(timeInterval);
// Update typing flow status
    // let typingSpeedTestFlow = {
    //   init: false,
    //   start: false,
    //   running: false,
    //   pause: false,
    //   reset: true,
    //   endTime: false,
    // };
    onTypingSpeedTestFlowChange({
      init: false,
      start: false,
      running: false,
      pause: false,
      reset: true,
      endTime: false,
    });
  };

  // Render the timer and control buttons in the component
  return (
    <div className="Timer">
      {/* Render timer progress if not initialized, ended, or reset */}
      {!typingSpeedTestFlow.init &&
        !typingSpeedTestFlow.endTime &&
        !typingSpeedTestFlow.reset && (
          <div className="timer-container">
            <div
              className="timer"
              style={{
                "--percent": `${
                  ((selectedTime - timer) * 100) / selectedTime
                }%`,
              }}
            >
              <span className="percent-text">{timer}</span>
            </div>
          </div>
        )}
      <div className="btn-wrapper">
        {/* Button to start the timer */}
        {(typingSpeedTestFlow.init || typingSpeedTestFlow.reset) && (
          <Button className="button" variant="contained" onClick={startTimer}>
            {startTransl}
          </Button>
        )}
        {/* Button to continue the timer */}
        {typingSpeedTestFlow.pause && (
          <Button
            className="button"
            variant="contained"
            onClick={continueTimer}
          >
            {continueTransl}
          </Button>
        )}
        {/* Button to pause the timer */}
        {(typingSpeedTestFlow.start || typingSpeedTestFlow.running) && (
          <Button className="button" variant="contained" onClick={pauseTimer}>
            {pauseTransl}
          </Button>
        )}
        {/* Button to reset the timer */}
        {!typingSpeedTestFlow.init && !typingSpeedTestFlow.reset && (
          <Button className="button" variant="contained" onClick={resetTimer}>
            {resetTransl}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Timer;
