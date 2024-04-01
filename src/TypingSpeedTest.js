import React, { useState, useEffect } from "react";
import RandomWord from "./RandomWord";
import ColoredTextfield from "./ColoredTextField";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material/";
import Timer from "./Timer";
import Statistics from "./Statistics";
import "@fontsource/roboto-flex/400.css";
import "@fontsource/oswald";
import LanguageSelector from "./LanguageSelector";
import { translations } from "./Translations";

function TypingSpeedTest() {
  // State for the current random word
  const [currentRandomWord, setCurrentRandomWord] = useState("");
  // State for the currently selected time
  const [currentSelectedTime, setCurrentSelectedTime] = useState(60);
  // State for the current timer value
  const [currentTimer, setCurrentTimer] = useState(0);
  // Available time options
  const timeToSelect = [60, 120, 180];
  // State for handling the current flow of typing speed test
  const [currentTypingSpeedTestFlow, setCurrentTypingSpeedTestFlow] = useState({
    init: true,
    start: false,
    running: false,
    pause: false,
    reset: false,
    endTime: false,
  });
  // State for the count of valid characters typed
  const [validCharsCount, setValidCharsCount] = useState(0);
  // State for the count of all characters typed
  const [allCharsCount, setAllCharsCount] = useState(0);
  // State for the input text
  const [inputText, setInputText] = useState("");
  // State for the chosen language
  const [chosenLanguage, setChosenLanguage] = useState(
    localStorage.getItem("chosenLanguage") ||
      navigator.language.split("-")[0] || "en"
  );
  // Translated text:
  const timeTransl =
    translations[localStorage.getItem("chosenLanguage")]["time"];

    // Update chosen language in local storage
  useEffect(() => {
    localStorage.setItem("chosenLanguage", chosenLanguage);
  }, [chosenLanguage]);

  const handleRandomWordChange = (word) => {
    // Update the current random word
    setCurrentRandomWord(word);
  };

  const handleChange = (event) => {
    // Handle change in selected time
    setCurrentSelectedTime(event.target.value);
  };

  const handleTimerChange = (time) => {
    // Handle change in timer value
    setCurrentTimer(time);
  };

  const handleFlow = (flow) => {
    // Handle flow changes in typing speed test
    setCurrentTypingSpeedTestFlow(flow);
  };

  const handleValidCharsCount = (chars) => {
    // Handle changes in the count of valid characters typed
    setValidCharsCount(chars);
  };

  const handleAllCharsCount = (chars) => {
    // Handle changes in the count of all characters typed
    setAllCharsCount(chars);
  };

  const handleInput = (input) => {
    // Handle changes in input text
    setInputText(input);
  };
// Render the typing speed test component
  return (
    <div>
      <LanguageSelector onLanguageChange={setChosenLanguage} typingSpeedTestFlow={currentTypingSpeedTestFlow}></LanguageSelector>
      <p className="header">Typing Speed Test</p>
      <Statistics
        timer={currentTimer}
        selectedTime={currentSelectedTime}
        typingSpeedTestFlow={currentTypingSpeedTestFlow}
        validCharsCount={validCharsCount}
        allCharsCount={allCharsCount}
        randomWord={currentRandomWord}
        inputText={inputText}
      ></Statistics>
      <Paper className="paper">
        <RandomWord
          onRandomWordChange={handleRandomWordChange}
          typingSpeedTestFlow={currentTypingSpeedTestFlow}
          inputText={inputText}
        />
        <ColoredTextfield
          trueColor="green"
          falseColor="red"
          randomWord={currentRandomWord}
          typingSpeedTestFlow={currentTypingSpeedTestFlow}
          onValidCharsCountChange={handleValidCharsCount}
          onAllCharsCountChange={handleAllCharsCount}
          onInputTextChange={handleInput}
        />

        {(currentTypingSpeedTestFlow.init || currentTypingSpeedTestFlow.reset) && (
          <FormControl className="formControl">
            <InputLabel>{timeTransl}</InputLabel>
            <Select
              value={currentSelectedTime}
              label="Time"
              onChange={handleChange}
              className="select"
              disabled={
                currentTypingSpeedTestFlow.start ||
                currentTypingSpeedTestFlow.pause ||
                currentTypingSpeedTestFlow.running ||
                currentTypingSpeedTestFlow.endTime
              }
            >
              {timeToSelect.map((index) => {
                return (
                  <MenuItem className="menuItem" key={index} value={index}>
                    {index}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      </Paper>
      <Timer
        selectedTime={currentSelectedTime}
        onTimerChange={handleTimerChange}
        onTypingSpeedTestFlowChange={handleFlow}
        typingSpeedTestFlow={currentTypingSpeedTestFlow}
      ></Timer>
    </div>
  );
}

export default TypingSpeedTest;
