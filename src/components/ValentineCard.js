import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { AnimateHeartCanvas } from "./animate-heart-canvas"; // Import the library

const ValentineCard = () => {
  const [yesButtonSize, setYesButtonSize] = useState(16); // Initial font size for "YES" button
  const [noButtonSize, setNoButtonSize] = useState(16); // Initial font size for "NO" button
  const [noButtonTextIndex, setNoButtonTextIndex] = useState(0);
  const [currentStatement, setCurrentStatement] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showYesCard, setShowYesCard] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ top: 20, right: 20 });
  const audioRef = useRef(null);
  const [showThinkbox, setShowThinkbox] = useState(true); // State for thinkbox visibility

  const statements = [
    "Don't slid, I'm not being too nice. I just thought you might like it.🙈",
    "We will go to eat some of our fav food. 🍽️😋",
    "And hey, you are my fav hello as well.🐾",
    "I mean I know it can't be a no, but it's fun to ask.🤭",
    "You are the front-end to my back-end 👩‍💻👨‍💻, hehe.",
    "I am the coffee to your cup of chai ☕, lol.",
  ];

  // Texts for the "NO" button
  const noButtonTexts = [
    "NO 😒",
    "WHATTTTT 🙄?",
    "The fact that you even tried clicking it 😠",
    "Wow, clicked again 😡",
    "Dekhlo tussi 😾",
    "Sochlo jiii 🤨",
    "Kya yaar, seriously? 😠",
    "Bas kar, please! 😒",
    "Ab toh haan bol do! 👀",
    "Stop pressing it for fun! 😡",
    "STAAPP! 😤",
    "Still pressing 😠",
    "It can't be a no, IK! 😅",
    "Go, press YES! 🤗",
    "I'm out of texts now! 😂"
  ];


  // Rotate statements every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatement((prev) => (prev + 1) % statements.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [statements.length]);

  // Handle "NO" button click
  const handleNoClick = () => {
    setYesButtonSize((prevSize) => prevSize + 10); // Increase "YES" button size
    setNoButtonSize((prevSize) => Math.max(5, prevSize - 2)); // Decrease "NO" button size
    setNoButtonTextIndex((prevIndex) => (prevIndex + 1) % noButtonTexts.length); // Change "NO" button text

    // Move "NO" button to a random position
    const newTop = Math.random() * (window.innerHeight - 50);
    const newRight = Math.random() * (window.innerWidth - 100);
    setNoButtonPosition({ top: newTop, right: newRight });
  };

  // Handle "YES" button click
  const handleYesClick = () => {
    setShowYesCard(true);
    triggerConfetti();
  };

  // Handle music icon click
  const handleMusicClick = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
    setShowThinkbox(false); // Hide thinkbox after clicking the music button
  };

  // Trigger confetti effect
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Initialize heart animation
  useEffect(() => {
    const animateHeartCanvas = new AnimateHeartCanvas(
      0, // hMin
      360, // hMax
      200, // countHeart
      50, // sizeMin
      150, // sizeMax
      "#ff9a9e" // bgColor
    );
  }, []);

  return (
    <div className="valentine-card">
      {/* Music Icon */}
      <div className="music-container">
      <div className="music-icon" onClick={handleMusicClick}>
        {isMusicPlaying ? "🔇" : "🎵"}
        </div>
        {showThinkbox && (
          <div className="thinkbox">
            Press it to listen to the song you only sent me &lt;3
          </div>
        )}
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} src="blue-song-by-young-kai.mp3" loop />

      {/* Card Content */}
      {!showYesCard ? (
        <>
          <h1>Hey, would the munda reading like to go out with this kudi for a day?</h1>
          <p>{statements[currentStatement]}</p>
          <img src="kitty-cat.gif" alt="Romantic GIF" className="gif" />
          <button
            className="yes-button"
            style={{ fontSize: `${yesButtonSize}px` }}
            onClick={handleYesClick}
          >
            YES YES! HELL YEAH 🥺
            </button>
          <button
            className="no-button"
            style={{
              fontSize: `${noButtonSize}px`,
              top: `${noButtonPosition.top}px`,
              right: `${noButtonPosition.right}px`,
            }}
            onClick={handleNoClick}
          >
            {noButtonTexts[noButtonTextIndex]}
          </button>
        </>
      ) : (
        <div className="yes-card">
          <h2>As if I didn't know already, hehe &lt;3</h2>
          <img src="cute.gif" alt="Celebration GIF" className="gif" />
        </div>
      )}
      {/* Footer */}
      <footer>
        Made with ❤️ by you know <strong>WHO</strong> 😌
      </footer>
    </div>
  );
};

export default ValentineCard;
