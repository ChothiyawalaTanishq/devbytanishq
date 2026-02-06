import { motion } from "framer-motion";

interface GlitterTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GlitterText = ({ children, className = "" }: GlitterTextProps) => {
  return (
    <span className={`relative inline-block overflow-hidden ${className}`}>
      {children}
      <motion.span
        className="absolute inset-0 -translate-x-full"
        style={{
          background: "linear-gradient(90deg, transparent, hsla(0, 0%, 100%, 0.2), hsla(0, 0%, 100%, 0.4), hsla(0, 0%, 100%, 0.2), transparent)",
        }}
        animate={{
          translateX: ["−100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 2,
        }}
      />
    </span>
  );
};
