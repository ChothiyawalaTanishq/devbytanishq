import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import heroAvatar from "@/assets/hero-avatar.jpg";

// Animated gradient orbs
const GradientOrbs = () => (
  <>
    <motion.div
      className="absolute w-[800px] h-[800px] rounded-full opacity-30"
      style={{
        background: "radial-gradient(circle, hsl(263 70% 50% / 0.4), transparent 60%)",
        top: "-20%",
        right: "-10%",
        filter: "blur(60px)",
      }}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 50, 0],
        y: [0, 30, 0],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full opacity-25"
      style={{
        background: "radial-gradient(circle, hsl(172 100% 40% / 0.3), transparent 60%)",
        bottom: "-10%",
        left: "-10%",
        filter: "blur(60px)",
      }}
      animate={{
        scale: [1, 1.15, 1],
        x: [0, -30, 0],
        y: [0, -20, 0],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[400px] h-[400px] rounded-full opacity-20"
      style={{
        background: "radial-gradient(circle, hsl(263 70% 60% / 0.3), transparent 60%)",
        top: "40%",
        left: "30%",
        filter: "blur(40px)",
      }}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
  </>
);

// Floating dots grid
const FloatingDots = () => {
  const dots = Array.from({ length: 40 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 4,
    size: 2 + Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Subtle grid lines
const GridLines = () => (
  <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, hsl(263 70% 50%) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(263 70% 50%) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  </div>
);

// Animated text reveal
const TextReveal = ({ children, delay = 0 }: { children: string; delay?: number }) => (
  <span className="inline-block overflow-hidden">
    <motion.span
      className="inline-block"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

// Role typing animation
const RoleTyping = () => {
  const roles = ["AI/ML Engineer", "Generative AI Developer", "Full-Stack Developer", "Problem Solver"];
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const role = roles[currentRole];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < role.length) {
          setDisplayText(role.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentRole((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRole, roles]);

  return (
    <span className="gradient-text">
      {displayText}
      <motion.span
        className="inline-block w-0.5 h-8 bg-primary ml-1"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </span>
  );
};

// Magnetic button effect
const MagneticButton = ({ children, className, href, download }: { children: React.ReactNode; className?: string; href?: string; download?: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      download={download}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
};

// 3D Avatar
const Avatar3D = () => {
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
    rotateY.set((e.clientX - centerX) * 0.03);
    rotateX.set(-(e.clientY - centerY) * 0.03);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="relative cursor-pointer"
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Orbiting ring */}
      <motion.div
        className="absolute inset-[-20px] rounded-full border border-dashed border-primary/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"
          style={{ boxShadow: "0 0 20px hsl(263 70% 50%)" }}
        />
      </motion.div>

      {/* Glowing border */}
      <motion.div
        className="absolute inset-[-3px] rounded-full"
        style={{
          background: "conic-gradient(from 0deg, hsl(263 70% 55%), hsl(172 100% 50%), hsl(263 70% 55%))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-40"
        style={{
          background: "conic-gradient(from 0deg, hsl(263 70% 55%), hsl(172 100% 50%), hsl(263 70% 55%))",
        }}
      />

      {/* Avatar */}
      <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-background">
        <img
          src={heroAvatar}
          alt="Tanishq Chothiyawala"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
      </div>

      {/* Status badge */}
      <motion.div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full glass-strong border border-teal/30 flex items-center gap-2"
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.span
          className="w-2 h-2 rounded-full bg-teal"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-sm font-medium text-teal">Open to Work</span>
      </motion.div>
    </motion.div>
  );
};

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center relative px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-background">
        <GradientOrbs />
        <FloatingDots />
        <GridLines />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto w-full relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left - Text */}
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            
            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 justify-center lg:justify-start"
            >
              <motion.div
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles size={14} className="text-primary" />
                <span className="text-sm text-muted-foreground">Welcome to my portfolio</span>
              </motion.div>
            </motion.div>

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.1]">
                <TextReveal delay={0.1}>Hi, I'm</TextReveal>{" "}
                <TextReveal delay={0.2}>Tanishq</TextReveal>
              </h1>
              <div className="h-12 md:h-14 lg:h-16 flex items-center justify-center lg:justify-start">
                <span className="text-2xl md:text-3xl lg:text-4xl font-display font-bold">
                  <RoleTyping />
                </span>
              </div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              MCA (Generative AI) student at SRM University, Chennai. Building intelligent 
              systems with Python, ML, NLP & Generative AI.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <MagneticButton
                href="#work"
                className="group relative px-8 py-4 rounded-full font-semibold overflow-hidden inline-flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500" />
                <span className="relative z-10 text-white">View My Work</span>
                <ArrowRight size={18} className="relative z-10 text-white group-hover:translate-x-1 transition-transform" />
              </MagneticButton>

              <MagneticButton
                href="/Tanishq_Resume.pdf"
                className="px-8 py-4 rounded-full font-semibold border border-foreground/20 hover:border-primary/50 transition-colors inline-flex items-center gap-2 bg-background/50 backdrop-blur-sm"
                download="Tanishq_Resume.pdf"
              >
                <Download size={18} />
                Resume
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right - Avatar */}
          <div className="flex justify-center order-1 lg:order-2" style={{ perspective: "1000px" }}>
            <Avatar3D />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-foreground/20 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-2.5 rounded-full bg-primary"
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
