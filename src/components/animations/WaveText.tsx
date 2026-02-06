import { motion, stagger, useAnimate } from "framer-motion";
import { useEffect } from "react";

interface WaveTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const WaveText = ({ text, className = "", delay = 0 }: WaveTextProps) => {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      animate(
        "span",
        { y: [20, 0], opacity: [0, 1] },
        { duration: 0.5, delay: stagger(0.05), ease: [0.25, 0.4, 0.25, 1] }
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, [animate, delay]);

  return (
    <span ref={scope} className={`inline-flex flex-wrap ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 20, opacity: 0 }}
          className={char === " " ? "mr-2" : ""}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};
