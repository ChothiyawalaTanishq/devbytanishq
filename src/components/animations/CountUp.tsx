import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  separator?: string;
  direction?: "up" | "down";
  className?: string;
  suffix?: string;
}

const CountUp = ({
  from = 0,
  to,
  duration = 1,
  separator = "",
  direction = "up",
  className = "",
  suffix = "",
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(direction === "up" ? from : to);

  useEffect(() => {
    if (!isInView) return;

    const start = direction === "up" ? from : to;
    const end = direction === "up" ? to : from;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, from, to, duration, direction]);

  const formatNumber = (num: number) => {
    if (!separator) return `${num}${suffix}`;
    return `${num.toLocaleString()}${suffix}`;
  };

  return (
    <span ref={ref} className={className}>
      {formatNumber(count)}
    </span>
  );
};

export default CountUp;
