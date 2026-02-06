import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import { useSynthSound } from "@/hooks/useSynthSound";

// Neural network node component
const NeuralNode = ({ x, y, delay, size = 4 }: { x: number; y: number; delay: number; size?: number }) => (
  <motion.circle
    cx={x}
    cy={y}
    r={size}
    fill="url(#nodeGradient)"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0.8],
    }}
    transition={{
      duration: 0.6,
      delay,
      ease: "easeOut",
    }}
  />
);

// Connection line between nodes
const NeuralConnection = ({ 
  x1, y1, x2, y2, delay 
}: { x1: number; y1: number; x2: number; y2: number; delay: number }) => (
  <motion.line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke="url(#lineGradient)"
    strokeWidth="1"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 0.6 }}
    transition={{
      duration: 0.8,
      delay,
      ease: "easeInOut",
    }}
  />
);

// Data pulse traveling along connection
const DataPulse = ({ 
  x1, y1, x2, y2, delay 
}: { x1: number; y1: number; x2: number; y2: number; delay: number }) => (
  <motion.circle
    r="3"
    fill="#00f5ff"
    filter="url(#glow)"
    initial={{ cx: x1, cy: y1, opacity: 0 }}
    animate={{ 
      cx: [x1, x2],
      cy: [y1, y2],
      opacity: [0, 1, 1, 0],
    }}
    transition={{
      duration: 1.2,
      delay: delay + 0.8,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 2,
    }}
  />
);

// Glitch text character
const GlitchChar = ({ char, index }: { char: string; index: number }) => {
  const [glitchChar, setGlitchChar] = useState(char);
  const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`01";
  
  useEffect(() => {
    const glitchDuration = 1500;
    const startDelay = index * 80;
    
    const timeout = setTimeout(() => {
      let iterations = 0;
      const maxIterations = 8;
      
      const interval = setInterval(() => {
        if (iterations >= maxIterations) {
          setGlitchChar(char);
          clearInterval(interval);
          return;
        }
        setGlitchChar(glitchChars[Math.floor(Math.random() * glitchChars.length)]);
        iterations++;
      }, 50);
      
      return () => clearInterval(interval);
    }, startDelay);
    
    return () => clearTimeout(timeout);
  }, [char, index]);

  return (
    <motion.span
      className="inline-block font-mono"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.08,
      }}
    >
      <span 
        className="bg-gradient-to-b from-cyan-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent"
        style={{
          textShadow: glitchChar !== char ? '0 0 10px rgba(0, 245, 255, 0.8)' : 'none',
        }}
      >
        {glitchChar}
      </span>
    </motion.span>
  );
};

// Hexagon loader
const HexagonLoader = ({ progress }: { progress: number }) => {
  const hexPoints = "50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5";
  
  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 100 100"
      className="absolute"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <defs>
        <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00f5ff" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <motion.polygon
        points={hexPoints}
        fill="none"
        stroke="url(#hexGradient)"
        strokeWidth="2"
        strokeDasharray="300"
        initial={{ strokeDashoffset: 300 }}
        animate={{ strokeDashoffset: 300 - (progress / 100) * 300 }}
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  );
};

// Binary rain column
const BinaryColumn = ({ x, delay }: { x: number; delay: number }) => {
  const chars = useMemo(() => 
    Array.from({ length: 15 }, () => Math.random() > 0.5 ? '1' : '0'),
    []
  );
  
  return (
    <motion.div
      className="absolute text-xs font-mono text-cyan-500/30 leading-tight"
      style={{ left: `${x}%` }}
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: '100vh', opacity: [0, 0.5, 0.5, 0] }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {chars.map((char, i) => (
        <div key={i}>{char}</div>
      ))}
    </motion.div>
  );
};

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { playSound } = useSynthSound();
  const soundsPlayedRef = useRef({ powerUp: false, pulse30: false, pulse60: false, complete: false });
  const glitchSoundIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Small delay before showing content for dramatic effect
    setTimeout(() => {
      setShowContent(true);
      playSound('powerUp', 0.2);
    }, 200);
    
    // Play random glitch sounds during loading
    glitchSoundIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.6) {
        playSound('glitch', 0.1);
      }
    }, 400);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 12 + 3;
      });
    }, 120);

    return () => {
      clearInterval(interval);
      if (glitchSoundIntervalRef.current) {
        clearInterval(glitchSoundIntervalRef.current);
      }
    };
  }, [playSound]);

  // Play sounds at progress milestones
  useEffect(() => {
    if (progress >= 30 && !soundsPlayedRef.current.pulse30) {
      soundsPlayedRef.current.pulse30 = true;
      playSound('beep', 0.15);
    }
    if (progress >= 60 && !soundsPlayedRef.current.pulse60) {
      soundsPlayedRef.current.pulse60 = true;
      playSound('beep', 0.15);
    }
    if (progress >= 90 && !soundsPlayedRef.current.complete) {
      soundsPlayedRef.current.complete = true;
      playSound('beep', 0.15);
    }
  }, [progress, playSound]);

  useEffect(() => {
    if (progress >= 100) {
      // Stop glitch sounds
      if (glitchSoundIntervalRef.current) {
        clearInterval(glitchSoundIntervalRef.current);
      }
      
      setTimeout(() => {
        playSound('complete', 0.25);
        setIsExiting(true);
        setTimeout(onComplete, 600);
      }, 400);
    }
  }, [progress, onComplete, playSound]);

  const name = "DEVBYTANISHQ";
  
  // Neural network nodes layout
  const nodes = [
    // Layer 1
    { x: 80, y: 60, layer: 1 },
    { x: 80, y: 120, layer: 1 },
    { x: 80, y: 180, layer: 1 },
    // Layer 2
    { x: 160, y: 40, layer: 2 },
    { x: 160, y: 100, layer: 2 },
    { x: 160, y: 160, layer: 2 },
    { x: 160, y: 220, layer: 2 },
    // Layer 3
    { x: 240, y: 80, layer: 3 },
    { x: 240, y: 140, layer: 3 },
    { x: 240, y: 200, layer: 3 },
    // Layer 4
    { x: 320, y: 100, layer: 4 },
    { x: 320, y: 160, layer: 4 },
  ];

  // Connections between layers
  const connections = [
    // Layer 1 to Layer 2
    { x1: 80, y1: 60, x2: 160, y2: 40 },
    { x1: 80, y1: 60, x2: 160, y2: 100 },
    { x1: 80, y1: 120, x2: 160, y2: 100 },
    { x1: 80, y1: 120, x2: 160, y2: 160 },
    { x1: 80, y1: 180, x2: 160, y2: 160 },
    { x1: 80, y1: 180, x2: 160, y2: 220 },
    // Layer 2 to Layer 3
    { x1: 160, y1: 40, x2: 240, y2: 80 },
    { x1: 160, y1: 100, x2: 240, y2: 80 },
    { x1: 160, y1: 100, x2: 240, y2: 140 },
    { x1: 160, y1: 160, x2: 240, y2: 140 },
    { x1: 160, y1: 160, x2: 240, y2: 200 },
    { x1: 160, y1: 220, x2: 240, y2: 200 },
    // Layer 3 to Layer 4
    { x1: 240, y1: 80, x2: 320, y2: 100 },
    { x1: 240, y1: 140, x2: 320, y2: 100 },
    { x1: 240, y1: 140, x2: 320, y2: 160 },
    { x1: 240, y1: 200, x2: 320, y2: 160 },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)',
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Binary Rain Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <BinaryColumn key={i} x={i * 5 + 2} delay={i * 0.3} />
          ))}
        </div>

        {/* Scanline Effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 245, 255, 0.1) 2px, rgba(0, 245, 255, 0.1) 4px)',
          }}
        />

        {/* Neural Network Visualization */}
        {showContent && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1 }}
          >
            <svg width="400" height="260" viewBox="0 0 400 260" className="opacity-60">
              <defs>
                <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f5ff" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#00f5ff" stopOpacity="0.3" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Connections */}
              {connections.map((conn, i) => (
                <NeuralConnection key={`conn-${i}`} {...conn} delay={i * 0.05} />
              ))}
              
              {/* Data pulses */}
              {connections.slice(0, 8).map((conn, i) => (
                <DataPulse key={`pulse-${i}`} {...conn} delay={i * 0.2} />
              ))}
              
              {/* Nodes */}
              {nodes.map((node, i) => (
                <NeuralNode 
                  key={`node-${i}`} 
                  x={node.x} 
                  y={node.y} 
                  delay={node.layer * 0.2}
                  size={node.layer === 4 ? 6 : 4}
                />
              ))}
            </svg>
          </motion.div>
        )}

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Hexagon Progress Loader */}
          <div className="relative w-32 h-32 flex items-center justify-center mb-8">
            <HexagonLoader progress={progress} />
            
            {/* Inner hexagon */}
            <motion.div
              className="absolute inset-4 flex items-center justify-center"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <svg width="80" height="80" viewBox="0 0 100 100">
                <polygon
                  points="50,10 90,30 90,70 50,90 10,70 10,30"
                  fill="none"
                  stroke="rgba(168, 85, 247, 0.3)"
                  strokeWidth="1"
                />
              </svg>
            </motion.div>
            
            {/* Progress percentage */}
            <motion.span
              className="absolute text-2xl font-bold font-mono bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {Math.min(Math.round(progress), 100)}
            </motion.span>
          </div>

          {/* Glitch Text Name */}
          <div className="flex gap-1 text-3xl md:text-5xl font-bold tracking-wider mb-6">
            {name.split('').map((char, i) => (
              <GlitchChar key={i} char={char} index={i} />
            ))}
          </div>

          {/* Subtitle with typing effect */}
          <motion.div
            className="flex items-center gap-2 text-sm md:text-base text-cyan-400/70 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              _
            </motion.span>
            <span>INITIALIZING NEURAL INTERFACE</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ...
            </motion.span>
          </motion.div>

          {/* Status indicators */}
          <motion.div
            className="flex gap-6 mt-8 text-xs font-mono text-muted-foreground/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {['MODULES', 'ASSETS', 'AI_CORE'].map((item, i) => (
              <motion.div
                key={item}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + i * 0.2 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: progress > (i + 1) * 30 ? '#00f5ff' : '#333',
                    boxShadow: progress > (i + 1) * 30 ? '0 0 10px #00f5ff' : 'none',
                  }}
                  animate={progress > (i + 1) * 30 ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
                <span>{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-cyan-500/30" />
        <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-cyan-500/30" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-500/30" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-purple-500/30" />

        {/* Ambient glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0, 245, 255, 0.05) 0%, transparent 70%)',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};
