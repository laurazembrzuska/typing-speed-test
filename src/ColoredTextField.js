import React, { useRef, useEffect, useState } from "react";
import { translations } from "./Translations";

const ColoredTextfield = ({
  trueColor,
  falseColor,
  randomWord,
  typingSpeedTestFlow,
  onValidCharsCountChange,
  onAllCharsCountChange,
  onInputTextChange,
}) => {
  // Reference to the output div containing colored spans
  const outputRef = useRef(null);
  // Reference to the input element where user types
  const inputRef = useRef(null);
  // State for user input text and counters
  const [inputText, setInputText] = useState("");
  // Counter to track the position of characters
  const [positionCounter, setPositionCounter] = useState(0);
  // Counter for valid characters
  const [validCharsCount, setValidCharsCount] = useState(0);
  // Counter for all characters typed
  const [allCharsCount, setAllCharsCount] = useState(0);

  // Translated text:
  const typeHereTransl =
    translations[localStorage.getItem("chosenLanguage")]["typeHere"];

  // Function to determine color for each letter
  const getColorForLetter = (letter, index) => {
    // If the letter matches the expected one
    if (randomWord && randomWord[index] === letter) {
      return trueColor;
    } // If the letter is a space -> no color
    else if (randomWord && randomWord[index] === " " && letter === "_") {
      return "white";
    } // If the letter doesn't match the expected one
    return falseColor;
  };

  // Update input text colors
  const updateColors = () => {
    // Return if the application has just started and the user has not yet clicked start
    if (!typingSpeedTestFlow.start) return;

    const output = outputRef.current;
    const spans = output.querySelectorAll("span");

    let validCharsCountTmp = 0;
    let allCharsCountTmp = 0;

    spans.forEach((span, index) => {
      // Set color for each span based on the corresponding letter
      span.style.color = getColorForLetter(span.textContent, index);
      // Count valid characters
      validCharsCountTmp =
        span.style.color === trueColor || span.style.color === "white"
          ? validCharsCountTmp + 1
          : validCharsCountTmp;
      // Count all chars
      allCharsCountTmp++;
    });
    // Update validCharsCount and allCharsCount states
    setValidCharsCount(validCharsCountTmp);
    setAllCharsCount(allCharsCountTmp);
    // Update inputText by joining textContent of spans
    setInputText(
      Array.from(spans)
        .map((span) => span.textContent)
        .join("")
    );
  };
  // Check if input should be disabled based on typing flow state
  const checkIfDisabled = (event) => {
    if (
      typingSpeedTestFlow.init ||
      typingSpeedTestFlow.pasue ||
      typingSpeedTestFlow.reset ||
      typingSpeedTestFlow.endTime
    )
      event.preventDefault();
  };
  // Handle keydown events for typing
  const handleKeyDown = (event) => {
    if (
      typingSpeedTestFlow.init ||
      typingSpeedTestFlow.pause ||
      typingSpeedTestFlow.reset ||
      typingSpeedTestFlow.endTime
    )
      return;

    let { key } = event;
    const color =
      key === (randomWord && randomWord[inputText?.length || 0])
        ? trueColor
        : falseColor;

    if (event.key === "Backspace") {
      // Handle backspace key
      const output = outputRef.current;
      const spans = output.querySelectorAll("span");
      if (
        spans.length > 0 &&
        spans.length - 1 + positionCounter >= 0 &&
        spans[spans.length - 1 + positionCounter]
      ) {
        const elementToRemove = spans[spans.length - 1 + positionCounter];
        output.removeChild(elementToRemove);
      }
    } else if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "Enter"
    ) {
      // Handle arrow keys and enter key
    } else if (event.key === "ArrowLeft") {
      // Handle left arrow key
      setPositionCounter((prevValue) => prevValue - 1);
      if (positionCounter < -inputText.length + 1) {
        setPositionCounter(-inputText.length + 1);
      }
    } else if (event.key === "ArrowRight") {
      // Handle right arrow key
      setPositionCounter((prevValue) => prevValue + 1);
      if (positionCounter > 0) {
        setPositionCounter(0);
      }
    } else {
      // Handle regular character input
      const output = outputRef.current;
      const spans = output.querySelectorAll("span");

      const nowySpan = document.createElement("span");

      nowySpan.style.color = getColorForLetter(key, color);

      nowySpan.textContent = event.code === "Space" ? "_" : key;

      if (spans.length > 0) {
        // If there are any spans, insert the new span in the middle
        if (spans.length === 0) {
          output.prepend(nowySpan);
        } else {
          if (spans[spans.length - 1 + positionCounter] !== undefined)
            spans[spans.length - 1 + positionCounter].after(nowySpan);
          else output.insertBefore(nowySpan, spans[0]);
        }
      } else {
        // If there are no spans, add the first span
        output.appendChild(nowySpan);
      }
      // Update colors and scroll to the right
      updateColors();
      outputRef.current.scrollLeft = outputRef.current.scrollWidth;
    }
  };
  // useEffect to initialize component and cleanup when necessary
  useEffect(() => {
    // Initial setup: Update colors and scroll to the right
    updateColors();
    outputRef.current.scrollLeft = outputRef.current.scrollWidth;
    // Cleanup: Remove all spans when start or reset
    if (typingSpeedTestFlow.start || typingSpeedTestFlow.reset) {
      outputRef = null;
      inputRef = null;

      const output = outputRef.current;
      const spans = output.querySelectorAll("span");
      spans.forEach((span) => {
        output.removeChild(span);
      });
    }
  }, []);
  // useEffect to reset the component when reset flow is true
  useEffect(() => {
    if (typingSpeedTestFlow.reset === true) {
      // Reset inputText, positionCounter, validCharsCount, allCharsCount
      setInputText("");
      setPositionCounter(0);
      setValidCharsCount(0);
      setAllCharsCount(0);
      // Remove all spans from output
      const output = outputRef.current;
      const spans = output.querySelectorAll("span");
      spans.forEach((span) => {
        output.removeChild(span);
      });
    }
  }, [typingSpeedTestFlow]);
  // useEffect to update counts and input text
  useEffect(() => {
    onValidCharsCountChange(validCharsCount);
    onAllCharsCountChange(allCharsCount);
  }, [validCharsCount, allCharsCount]);
  // useEffect to update input text
  useEffect(() => {
    onInputTextChange(inputText);
  }, [inputText]);
  // Render the component
  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      <div
        ref={outputRef}
        className="output"
        contentEditable={false}
        onKeyDown={checkIfDisabled}
      ></div>
      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleKeyDown}
        className="keyboard-input"
        placeholder={typeHereTransl}
      />
    </div>
  );
};
export default ColoredTextfield;
