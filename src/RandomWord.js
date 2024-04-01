import { useState, useEffect, useRef } from "react";
import axios from "axios";

function RandomWord({ onRandomWordChange, typingSpeedTestFlow, inputText }) {
  // State to store the random word
  const [randomWord, setRandomWord] = useState(null);
  // Reference to the container div for scrolling
  const containerRef = useRef(null);
  // useEffect to fetch a random word when the typing test starts or resets
  useEffect(() => {
    if (typingSpeedTestFlow.start === true) {
      getRandomWord();
    } // Reset randomWord and scroll position when the typing test resets
    else if (typingSpeedTestFlow.reset === true) {
      setRandomWord("");
      onRandomWordChange("");
      containerRef.current.scrollLeft = 0;
    }
  }, [typingSpeedTestFlow]);

  // useEffect to scroll the container based on input text and random word length
  useEffect(() => {
    if (randomWord !== null && inputText !== undefined) {
      // Calculate the scroll amount based on input text and random word length
      const scrollAmount =
        ((inputText.length * 0.8) / randomWord.length) *
        containerRef.current.scrollWidth;
      containerRef.current.scrollLeft = scrollAmount;
    }
  }, [randomWord, inputText]);

  // Function to fetch a random word from an API
  async function getRandomWord() {
    try {
      axios
        .get("https://random-word-form.herokuapp.com/random/noun?count=10000", {
          headers: {
            Accept: "application/json",
          },
        })
        .then((response) => {
          let word;
          // Concatenate word strings from the API response
          if (response.data.length > 0) word = response.data[0].toString();
          response.data.slice(1).forEach((w) => (word = word + " " + w));
          // Set the random word in the container and update state
          containerRef.current.textContent = word;
          setRandomWord(word);
          // Pass the random word value via props
          onRandomWordChange(word);
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <p></p>
      <div ref={containerRef} className="container">
        {randomWord}
      </div>
    </div>
  );
}

export default RandomWord;
