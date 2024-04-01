import React from "react";
import { Button } from "@mui/material/";
import Avatar from "@mui/material//Avatar";

function LanguageSelector({ onLanguageChange, typingSpeedTestFlow }) {
  // Function to change the language and store it in local storage
  const changeLanguage = (language) => {
    onLanguageChange(language);
    localStorage.setItem("chosenLanguage", language);
  };

  return (
    <>
      {/* Language selector buttons are displayed only during initialization or reset */}
      {(typingSpeedTestFlow.init || typingSpeedTestFlow.reset) && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {/* Button to change language to English */}
          <Button
            startIcon={<Avatar src="images/en.svg"></Avatar>}
            onClick={() => changeLanguage("en")}
          ></Button>
          {/* Button to change language to Polish */}
          <Button
            startIcon={<Avatar src="images/pl.svg"></Avatar>}
            onClick={() => changeLanguage("pl")}
          ></Button>
        </div>
      )}
    </>
  );
}

export default LanguageSelector;
