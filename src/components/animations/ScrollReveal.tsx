import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  blur?: boolean;
}

export const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  blur = true,
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const directionOffset = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        filter: blur ? "blur(5px)" : "blur(0px)",
        ...directionOffset[direction],
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              filter: "blur(0px)",
              x: 0,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 0.4,
        delay: delay * 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
