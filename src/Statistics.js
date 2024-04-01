import { useState, useEffect } from "react";
import { translations } from "./Translations";

const Statistics = ({
  timer,
  selectedTime,
  typingSpeedTestFlow,
  validCharsCount,
  allCharsCount,
  randomWord,
  inputText,
}) => {
  // State variables to store statistics
  const [validWords, setValidWords] = useState(null);
  const [charsAcc, setCharsAcc] = useState(null);
  const [validCharsPerMin, setValidCharsPerMin] = useState(null);
  const [validWordsPerMin, setValidWordsPerMin] = useState(null);

  // Translated text:
  const charsTransl =
    translations[localStorage.getItem("chosenLanguage")]["chars"];
  const wordsTransl =
    translations[localStorage.getItem("chosenLanguage")]["words"];
  const charsAccTransl =
    translations[localStorage.getItem("chosenLanguage")]["charsAcc"];
  const charsPerMinTransl =
    translations[localStorage.getItem("chosenLanguage")]["charsPerMin"];
  const wordsPerMinTransl =
    translations[localStorage.getItem("chosenLanguage")]["wordsPerMin"];

  // useEffect to update statistics whenever dependencies change
  useEffect(() => {
    setValidWords(countValidWords);
    setCharsAcc(countCharsAccuracy);
    setValidCharsPerMin(countValidCharsPerMin);
    setValidWordsPerMin(countValidWordsPerMin);
  }, [
    timer,
    selectedTime,
    typingSpeedTestFlow,
    validCharsCount,
    allCharsCount,
    randomWord,
    inputText,
  ]);

  // Function to count valid words
  const countValidWords = () => {
    if (randomWord && inputText) {
      let randomWordsArray = randomWord.split(" ");
      let inputTextArray = inputText.split("_");
      let countValidWords = randomWordsArray.filter(
        (word, index) => word === inputTextArray[index]
      ).length;
      return countValidWords;
    }
    return 0;
  };

  // Function to count character accuracy
  const countCharsAccuracy = () => {
    if (allCharsCount !== 0) {
      return ((validCharsCount * 100) / allCharsCount).toFixed(0);
    }
    return 0;
  };

  // Function to count valid characters per minute
  const countValidCharsPerMin = () => {
    if (Math.ceil((selectedTime - timer) / 60) !== 0) {
      return (validCharsCount / Math.ceil((selectedTime - timer) / 60)).toFixed(
        0
      );
    }
    return 0;
  };

  // Function to count valid words per minute
  const countValidWordsPerMin = () => {
    if (Math.ceil((selectedTime - timer) / 60) !== 0) {
      return (
        countValidWords() / Math.ceil((selectedTime - timer) / 60)
      ).toFixed(0);
    }
    return 0;
  };

// Render statistics table when the typing speed test is ongoing or completed
  return (
    <>
      {(typingSpeedTestFlow.start ||
        typingSpeedTestFlow.pause ||
        typingSpeedTestFlow.running ||
        typingSpeedTestFlow.endTime) && (
        <div className="custom-table">
          <table>
            <thead>
              <tr>
                <th>
                  <div className="stat-cell">{allCharsCount}</div>
                </th>
                <th>
                  <div className="stat-cell">{validWords}</div>
                </th>
                <th>
                  <div className="stat-cell">
                    {charsAcc}
                    {"%"}
                  </div>
                </th>
                <th>
                  <div className="stat-cell">{validCharsPerMin}</div>
                </th>
                <th>
                  <div className="stat-cell">{validWordsPerMin}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="stat-cell-desc">{charsTransl}</div>
                </td>
                <td>
                  <div className="stat-cell-desc">{wordsTransl}</div>
                </td>
                <td>
                  <div className="stat-cell-desc">{charsAccTransl}</div>
                </td>
                <td>
                  <div className="stat-cell-desc">{charsPerMinTransl}</div>
                </td>
                <td>
                  <div className="stat-cell-desc">{wordsPerMinTransl}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Statistics;
