import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, MouseEvent, ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glare?: boolean;
  tiltAmount?: number;
}

export const TiltCard = ({
  children,
  className = "",
  glare = true,
  tiltAmount = 15,
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltAmount, -tiltAmount]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltAmount, tiltAmount]), springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`perspective-1000 ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-inherit"
          style={{
            background: useTransform(
              [x, y],
              ([latestX, latestY]) =>
                `radial-gradient(circle at ${((latestX as number) + 0.5) * 100}% ${
                  ((latestY as number) + 0.5) * 100
                }%, hsla(0, 0%, 100%, 0.1), transparent 50%)`
            ),
          }}
        />
      )}
    </motion.div>
  );
};
