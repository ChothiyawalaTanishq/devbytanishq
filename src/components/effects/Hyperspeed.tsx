import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface HyperspeedOptions {
  onSpeedUp?: () => void;
  onSlowDown?: () => void;
  distortion?: "turbulentDistortion" | "mountainDistortion" | "xyDistortion" | "LongRaceDistortion" | "deepDistortion";
  length?: number;
  roadWidth?: number;
  islandWidth?: number;
  lanesPerRoad?: number;
  fov?: number;
  fovSpeedUp?: number;
  speedUp?: number;
  carLightsFade?: number;
  totalSideLightSticks?: number;
  lightPairsPerRoadWay?: number;
  shoulderLinesWidthPercentage?: number;
  brokenLinesWidthPercentage?: number;
  brokenLinesLengthPercentage?: number;
  lightStickWidth?: [number, number];
  lightStickHeight?: [number, number];
  movingAwaySpeed?: [number, number];
  movingCloserSpeed?: [number, number];
  carLightsLength?: [number, number];
  carLightsRadius?: [number, number];
  carWidthPercentage?: [number, number];
  carShiftX?: [number, number];
  carFloorSeparation?: [number, number];
  colors?: {
    roadColor?: string;
    islandColor?: string;
    background?: string;
    shoulderLines?: string;
    brokenLines?: string;
    leftCars?: [string, string, string];
    rightCars?: [string, string, string];
    sticks?: string;
  };
}

export const hyperspeedPresets: Record<string, HyperspeedOptions> = {
  one: {
    distortion: "turbulentDistortion",
    length: 400,
    roadWidth: 10,
    lanesPerRoad: 3,
    fov: 90,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    colors: {
      roadColor: "#08061f",
      islandColor: "#0a0a1a",
      background: "#000005",
      shoulderLines: "#131318",
      brokenLines: "#14141f",
      leftCars: ["#ff102a", "#eb383e", "#ff102a"],
      rightCars: ["#ffffff", "#dadada", "#ffffff"],
      sticks: "#14141f",
    },
  },
  two: {
    distortion: "mountainDistortion",
    length: 400,
    roadWidth: 9,
    lanesPerRoad: 3,
    fov: 90,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 50,
    colors: {
      roadColor: "#08061f",
      islandColor: "#0a0a1a",
      background: "#000005",
      shoulderLines: "#6528d7",
      brokenLines: "#6528d7",
      leftCars: ["#6528d7", "#8b5cf6", "#a78bfa"],
      rightCars: ["#22d3ee", "#06b6d4", "#0891b2"],
      sticks: "#6528d7",
    },
  },
  cyberpunk: {
    distortion: "xyDistortion",
    length: 400,
    roadWidth: 9,
    lanesPerRoad: 3,
    fov: 90,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 50,
    colors: {
      roadColor: "#0a0015",
      islandColor: "#0a0a1a",
      background: "#000005",
      shoulderLines: "#f0f",
      brokenLines: "#0ff",
      leftCars: ["#f0f", "#ff00ff", "#ff69b4"],
      rightCars: ["#0ff", "#00ffff", "#00ced1"],
      sticks: "#f0f",
    },
  },
};

interface HyperspeedProps {
  effectOptions?: HyperspeedOptions;
  className?: string;
}

export const Hyperspeed = ({ effectOptions = hyperspeedPresets.one, className = "" }: HyperspeedProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current?.parentElement) {
        setDimensions({
          width: canvasRef.current.parentElement.offsetWidth,
          height: canvasRef.current.parentElement.offsetHeight,
        });
      }
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = effectOptions.colors || hyperspeedPresets.one.colors!;
    const totalSticks = effectOptions.totalSideLightSticks || 20;
    const lightPairs = effectOptions.lightPairsPerRoadWay || 40;
    
    interface LightStreak {
      x: number;
      y: number;
      z: number;
      length: number;
      speed: number;
      color: string;
      width: number;
    }

    const streaks: LightStreak[] = [];
    const numStreaks = totalSticks + lightPairs * 2;

    // Initialize streaks
    for (let i = 0; i < numStreaks; i++) {
      const isLeft = i % 2 === 0;
      const colorSet = isLeft ? colors.leftCars : colors.rightCars;
      const color = colorSet ? colorSet[Math.floor(Math.random() * colorSet.length)] : "#ffffff";
      
      streaks.push({
        x: (Math.random() - 0.5) * dimensions.width * 2,
        y: (Math.random() - 0.5) * dimensions.height * 0.5 + dimensions.height * 0.3,
        z: Math.random() * 1000,
        length: 50 + Math.random() * 150,
        speed: 5 + Math.random() * 15,
        color,
        width: 1 + Math.random() * 2,
      });
    }

    let animationId: number;
    const fov = effectOptions.fov || 90;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height * 0.6;

    const animate = () => {
      ctx.fillStyle = colors.background || "#000005";
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Sort by z for proper depth
      streaks.sort((a, b) => b.z - a.z);

      for (const streak of streaks) {
        streak.z -= streak.speed;

        if (streak.z < 1) {
          streak.z = 1000;
          streak.x = (Math.random() - 0.5) * dimensions.width * 2;
          streak.y = (Math.random() - 0.5) * dimensions.height * 0.5 + dimensions.height * 0.3;
        }

        // Perspective projection
        const scale = fov / streak.z;
        const screenX = centerX + streak.x * scale;
        const screenY = centerY + streak.y * scale;

        const endZ = streak.z + streak.length;
        const endScale = fov / endZ;
        const endScreenX = centerX + streak.x * endScale;
        const endScreenY = centerY + streak.y * endScale;

        // Draw streak
        const gradient = ctx.createLinearGradient(endScreenX, endScreenY, screenX, screenY);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.5, streak.color + "80");
        gradient.addColorStop(1, streak.color);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = streak.width * scale * 10;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(endScreenX, endScreenY);
        ctx.lineTo(screenX, screenY);
        ctx.stroke();

        // Add glow
        ctx.shadowColor = streak.color;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = streak.color + "40";
        ctx.lineWidth = streak.width * scale * 20;
        ctx.beginPath();
        ctx.moveTo(endScreenX, endScreenY);
        ctx.lineTo(screenX, screenY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Add center glow
      const centerGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, dimensions.height * 0.5
      );
      centerGradient.addColorStop(0, (colors.shoulderLines || "#6528d7") + "20");
      centerGradient.addColorStop(1, "transparent");
      ctx.fillStyle = centerGradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [dimensions, effectOptions]);

  return (
    <motion.canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className={`absolute inset-0 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
};
