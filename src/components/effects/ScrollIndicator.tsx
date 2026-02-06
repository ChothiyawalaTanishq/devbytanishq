import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const ScrollIndicator = () => {
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.6 }}
    >
      <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Scroll
      </span>
      <motion.div
        className="w-6 h-10 rounded-full border border-muted-foreground/30 flex justify-center pt-2"
        animate={{ borderColor: ["hsl(0 0% 50% / 0.3)", "hsl(263 70% 60% / 0.5)", "hsl(0 0% 50% / 0.3)"] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-primary"
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};
