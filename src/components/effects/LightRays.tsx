import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface LightRaysProps {
  raysOrigin?: "top-center" | "top-left" | "top-right" | "center";
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  className?: string;
}

export const LightRays = ({
  raysOrigin = "top-center",
  raysColor = "#ffffff",
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1,
  followMouse = false,
  mouseInfluence = 0.1,
  className = "",
}: LightRaysProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0 });
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (!followMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [followMouse, mouseX, mouseY]);

  const getOriginPosition = () => {
    const baseX = followMouse ? mousePos.x * 100 : 50;
    const offset = followMouse ? (mousePos.x - 0.5) * mouseInfluence * 100 : 0;
    
    switch (raysOrigin) {
      case "top-left": return { x: 20 + offset, y: 0 };
      case "top-right": return { x: 80 + offset, y: 0 };
      case "center": return { x: 50 + offset, y: 50 };
      default: return { x: baseX, y: 0 };
    }
  };

  const origin = getOriginPosition();
  const numRays = Math.floor(12 * lightSpread);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ perspective: "1000px" }}
    >
      {/* Central glow */}
      <motion.div
        className="absolute"
        style={{
          left: `${origin.x}%`,
          top: `${origin.y}%`,
          transform: "translate(-50%, -50%)",
          width: "300px",
          height: "300px",
          background: `radial-gradient(circle, ${raysColor}40, transparent 70%)`,
          filter: "blur(40px)",
        }}
        animate={pulsating ? { 
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5]
        } : {}}
        transition={{ duration: 3 / raysSpeed, repeat: Infinity }}
      />

      {/* Light rays */}
      {Array.from({ length: numRays }).map((_, i) => {
        const angle = (i / numRays) * 180 - 90 + (followMouse ? (mousePos.x - 0.5) * 30 : 0);
        const delay = i * 0.1;
        const width = 2 + Math.random() * 3;
        const length = (50 + Math.random() * 50) * rayLength;
        const opacity = 0.1 + Math.random() * 0.15;

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${origin.x}%`,
              top: `${origin.y}%`,
              width: `${width}px`,
              height: `${length}%`,
              background: `linear-gradient(to bottom, ${raysColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}, transparent ${fadeDistance * 100}%)`,
              transformOrigin: "top center",
              transform: `rotate(${angle}deg)`,
              filter: "blur(1px)",
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ 
              opacity: [opacity * 0.5, opacity, opacity * 0.5],
              scaleY: [0.8, 1, 0.8],
            }}
            transition={{
              duration: (4 + Math.random() * 2) / raysSpeed,
              delay: delay / raysSpeed,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Additional shimmer rays */}
      {Array.from({ length: Math.floor(numRays / 2) }).map((_, i) => {
        const angle = (i / (numRays / 2)) * 160 - 80 + (followMouse ? (mousePos.x - 0.5) * 20 : 0);
        const width = 1;
        const length = (30 + Math.random() * 40) * rayLength;

        return (
          <motion.div
            key={`shimmer-${i}`}
            className="absolute"
            style={{
              left: `${origin.x}%`,
              top: `${origin.y}%`,
              width: `${width}px`,
              height: `${length}%`,
              background: `linear-gradient(to bottom, ${raysColor}30, transparent 80%)`,
              transformOrigin: "top center",
              transform: `rotate(${angle}deg)`,
            }}
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 2 / raysSpeed,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};
