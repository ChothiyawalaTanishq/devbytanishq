import { useState, useEffect } from "react";

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleDuration?: number;
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export const ScrambleText = ({
  text,
  className = "",
  scrambleDuration = 1500,
}: ScrambleTextProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    
    let iteration = 0;
    const totalIterations = text.length * 3;
    
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration / 3) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );
      
      iteration++;
      
      if (iteration >= totalIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, scrambleDuration / totalIterations);
  };

  return (
    <span
      className={`cursor-pointer ${className}`}
      onMouseEnter={scramble}
    >
      {displayText}
    </span>
  );
};
