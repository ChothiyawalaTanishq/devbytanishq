import { motion, useMotionValue, useSpring } from "framer-motion";
import { MapPin } from "lucide-react";
import { useRef } from "react";
import { ScrollReveal } from "../animations";
import heroAvatar from "@/assets/hero-avatar.jpg";

// 3D tilt image component
const TiltImage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    rotateY.set((e.clientX - centerX) * 0.02);
    rotateX.set(-(e.clientY - centerY) * 0.02);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="relative"
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 to-teal/30 blur-3xl opacity-50" />
      
      {/* Border gradient */}
      <motion.div
        className="absolute inset-[-2px] rounded-3xl"
        style={{
          background: "linear-gradient(135deg, hsl(263 70% 55%), hsl(172 100% 50%))",
        }}
      />

      {/* Image */}
      <div className="relative w-72 h-80 md:w-96 md:h-[450px] rounded-3xl overflow-hidden border-2 border-background">
        <img
          src={heroAvatar}
          alt="Tanishq Chothiyawala"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
      </div>
    </motion.div>
  );
};

export const AboutSection = () => {
  return (
    <section id="about" className="relative py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-20" />
      <motion.div
        className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Image */}
          <div className="flex justify-center lg:justify-start" style={{ perspective: "1000px" }}>
            <TiltImage />
          </div>

          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            
            {/* Badge */}
            <ScrollReveal>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-foreground/10 bg-foreground/5"
                whileHover={{ scale: 1.05 }}
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">About Me</span>
              </motion.div>
            </ScrollReveal>

            {/* Title */}
            <ScrollReveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                Shaping the <span className="gradient-text">future</span> with AI
              </h2>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal delay={0.2}>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                I'm Tanishq Chothiyawala, an MCA (Generative AI) student at SRM University, Chennai, 
                passionate about building intelligent systems that solve real-world problems.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                With expertise in Python, Machine Learning, NLP, and Generative AI, I've developed 
                an AI-powered Learning Management System and completed the Google AI-ML Virtual 
                Internship through AICTE. Currently seeking opportunities to grow as an AI/ML engineer 
                and contribute to innovative projects.
              </p>
            </ScrollReveal>

            {/* Location */}
            <ScrollReveal delay={0.4}>
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass border border-foreground/10"
                whileHover={{ scale: 1.05, borderColor: "hsl(263 70% 55% / 0.3)" }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MapPin size={20} className="text-primary" />
                </motion.div>
                <span className="font-medium">Surat, Gujarat, India</span>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
