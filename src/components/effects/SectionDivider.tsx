import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "wave" | "gradient" | "dots";
  flip?: boolean;
}

export const SectionDivider = ({ variant = "gradient", flip = false }: SectionDividerProps) => {
  if (variant === "wave") {
    return (
      <div className={`relative h-24 w-full overflow-hidden ${flip ? "rotate-180" : ""}`}>
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"
            fill="url(#wave-gradient)"
            initial={{ d: "M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z" }}
            animate={{
              d: [
                "M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z",
                "M0,60 C360,10 1080,90 1440,40 L1440,100 L0,100 Z",
                "M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z",
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(263 70% 50% / 0.1)" />
              <stop offset="50%" stopColor="hsl(172 100% 50% / 0.05)" />
              <stop offset="100%" stopColor="hsl(263 70% 50% / 0.1)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className="py-16 flex justify-center items-center gap-3">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: i === 2 
                ? "linear-gradient(135deg, hsl(263 70% 55%), hsl(172 100% 50%))" 
                : "hsl(var(--muted))",
            }}
            animate={i === 2 ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>
    );
  }

  // Default gradient line
  return (
    <div className="py-12 flex justify-center">
      <motion.div
        className="w-48 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(263 70% 50% / 0.5), hsl(172 100% 50% / 0.3), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      />
    </div>
  );
};
