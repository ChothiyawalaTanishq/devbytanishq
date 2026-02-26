import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { Mail, Linkedin, Github, Send, Sparkles, MapPin, Clock, ArrowUpRight, Copy, Check } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { ScrollReveal } from "../animations";

const email = "tanishqchothiyawala23@gmail.com";

const socialLinks = [
  { 
    name: "GitHub", 
    icon: Github, 
    href: "https://github.com/CodeHellBoy", 
    username: "@ChothiyawalaTanishq",
    color: "from-gray-600 to-gray-400" 
  },
  { 
    name: "LinkedIn", 
    icon: Linkedin, 
    href: "https://www.linkedin.com/in/tanishqchothiyawala", 
    username: "tanishqchothiyawala",
    color: "from-blue-600 to-blue-400" 
  },
  { 
    name: "Email", 
    icon: Mail, 
    href: `mailto:${email}`, 
    username: "Say Hello",
    color: "from-primary to-accent" 
  },
];

// Animated gradient orb
const GradientOrb = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute rounded-full blur-[100px] pointer-events-none ${className}`}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

// Magnetic effect wrapper
const MagneticWrapper = ({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

// Animated counter
const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Social card component
const SocialCard = ({ link, index }: { link: typeof socialLinks[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={link.href}
      target={link.name !== "Email" ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="group relative block"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MagneticWrapper strength={0.2}>
        <motion.div
          className="relative p-6 rounded-2xl bg-card border border-border/50 overflow-hidden"
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Gradient background on hover */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0`}
            animate={{ opacity: isHovered ? 0.1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className={`p-3 rounded-xl bg-gradient-to-br ${link.color}`}
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <link.icon size={24} className="text-white" />
              </motion.div>
              <div>
                <h4 className="font-semibold text-lg">{link.name}</h4>
                <p className="text-sm text-muted-foreground">{link.username}</p>
              </div>
            </div>
            <motion.div
              animate={{ x: isHovered ? 5 : 0, y: isHovered ? -5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowUpRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          </div>

          {/* Border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              boxShadow: isHovered
                ? "inset 0 0 0 1px hsl(var(--primary) / 0.5), 0 0 30px hsl(var(--primary) / 0.1)"
                : "inset 0 0 0 1px transparent",
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </MagneticWrapper>
    </motion.a>
  );
};

export const ContactSection = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background Effects */}
      <GradientOrb className="w-[600px] h-[600px] bg-primary/20 top-0 -left-1/4" delay={0} />
      <GradientOrb className="w-[500px] h-[500px] bg-accent/20 bottom-0 -right-1/4" delay={2} />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <ScrollReveal>
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-sm font-medium">Available for opportunities</span>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-4">
              Let's Work
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Together
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? I'm always excited to discuss new opportunities and creative challenges.
            </p>
          </ScrollReveal>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left - Big CTA Card */}
          <ScrollReveal delay={0.25}>
            <motion.div
              className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-card via-card to-muted/30 border border-border/50 h-full"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Decorative elements */}
              <div className="absolute top-6 right-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={24} className="text-primary/50" />
                </motion.div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">Get in touch</p>
                  <h3 className="text-2xl md:text-3xl font-display font-bold">
                    Drop me a line
                  </h3>
                </div>

                {/* Email with copy */}
                <div className="flex flex-wrap items-center gap-3">
                  <motion.button
                    onClick={copyEmail}
                    className="group flex items-center gap-3 px-5 py-3 rounded-full bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Mail size={18} className="text-primary" />
                    <span className="text-sm font-medium truncate max-w-[200px] md:max-w-none">{email}</span>
                    {copied ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </motion.button>
                </div>

                {/* Info badges */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 text-sm">
                    <MapPin size={14} className="text-primary" />
                    <span>India</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 text-sm">
                    <Clock size={14} className="text-primary" />
                    <span>IST (UTC+5:30)</span>
                  </div>
                </div>

                {/* Primary CTA */}
                <motion.a
                  href={`mailto:${email}`}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent font-semibold text-primary-foreground mt-4"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 40px hsl(var(--primary) / 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Send me an email</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Send size={18} />
                  </motion.div>
                </motion.a>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Right - Social Links */}
          <div className="space-y-4">
            {socialLinks.map((link, i) => (
              <SocialCard key={link.name} link={link} index={i} />
            ))}

            {/* Stats Card */}
            <ScrollReveal delay={0.5}>
              <motion.div
                className="p-6 rounded-2xl bg-card border border-border/50 mt-4"
                whileHover={{ scale: 1.01 }}
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { value: 4, suffix: "+", label: "Projects" },
                    { value: 3, suffix: "+", label: "Years Learning" },
                    { value: 24, suffix: "h", label: "Response Time" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>

        {/* Footer */}
        <ScrollReveal delay={0.6}>
          <motion.div
            className="text-center pt-12 border-t border-border/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground text-sm">
              Designed & Built by{" "}
              <span className="text-foreground font-medium">Tanishq Chothiyawala</span>
              {" "}© {new Date().getFullYear()}
            </p>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};
