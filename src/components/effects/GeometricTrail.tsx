import { useRef, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export const GeometricTrail = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const idCounter = useRef(0);
  const lastPosition = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const distance = Math.hypot(
      e.clientX - lastPosition.current.x,
      e.clientY - lastPosition.current.y
    );

    if (distance > 30) {
      lastPosition.current = { x: e.clientX, y: e.clientY };
      
      const newParticle: Particle = {
        id: idCounter.current++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 8 + 4,
        opacity: 0.6,
      };

      setParticles((prev) => [...prev.slice(-15), newParticle]);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => prev.filter((p) => p.opacity > 0.1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          initial={{
            x: particle.x - particle.size / 2,
            y: particle.y - particle.size / 2,
            scale: 1,
            opacity: particle.opacity,
          }}
          animate={{
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
          }}
          style={{
            width: particle.size,
            height: particle.size,
            background: `linear-gradient(135deg, hsl(263 70% 66%), hsl(217 91% 60%))`,
            boxShadow: `0 0 ${particle.size * 2}px hsl(263 70% 66% / 0.5)`,
          }}
        />
      ))}
    </div>
  );
};
