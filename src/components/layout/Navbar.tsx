import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, ArrowUp, Sparkles } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Work", href: "#work" },
  { name: "Contact", href: "#contact" },
];

// Animated indicator dot
const ActiveIndicator = () => (
  <motion.div
    layoutId="activeIndicator"
    className="absolute inset-0 rounded-full"
    style={{
      background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
      opacity: 0.15,
    }}
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
  />
);

// Glowing cursor follow effect
const GlowEffect = ({ mouseX }: { mouseX: number }) => (
  <motion.div
    className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
    style={{ opacity: 0.5 }}
  >
    <motion.div
      className="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background: "radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)",
        left: mouseX,
        top: "50%",
      }}
      animate={{ left: mouseX }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  </motion.div>
);

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
    setShowBackToTop(latest > 500);
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map((link) => link.href.replace("#", ""));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };

  return (
    <>
      {/* Main Navigation - Centered Floating Pill */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <motion.nav
          className={`relative flex items-center transition-all duration-500 ${
            isScrolled
              ? "bg-background/70 shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.2)] border-foreground/10"
              : "bg-background/40 border-foreground/5"
          } backdrop-blur-2xl border rounded-full px-2 py-2`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Glow effect on hover */}
          <AnimatePresence>
            {isHovering && <GlowEffect mouseX={mouseX} />}
          </AnimatePresence>

          {/* Outer glow ring */}
          <motion.div
            className="absolute -inset-px rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--accent) / 0.1), hsl(var(--primary) / 0.2))",
              opacity: isScrolled ? 1 : 0,
            }}
            animate={{
              opacity: isScrolled ? 1 : 0,
            }}
          />

          {/* Logo */}
          <motion.a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#hero");
            }}
            className="relative z-10 flex items-center gap-2 px-3 py-2 mr-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="relative w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary" />
              <Sparkles size={16} className="relative z-10 text-primary-foreground" />
            </motion.div>
          </motion.a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 relative z-10">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && <ActiveIndicator />}
                  <span className="relative z-10">{link.name}</span>
                  
                  {/* Hover underline effect */}
                  <motion.span
                    className="absolute bottom-1 left-1/2 h-px bg-primary"
                    initial={{ width: 0, x: "-50%" }}
                    whileHover={{ width: "60%" }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              );
            })}
          </div>

          {/* CTA Button - WhatsApp */}
          <motion.a
            href="https://wa.me/919925937717?text=Hi%20Tanishq%2C%20I%27m%20interested%20in%20hiring%20you!"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex relative z-10 items-center gap-2 ml-2 px-5 py-2 rounded-full font-semibold text-sm overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-accent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            />
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            
            {/* Glow on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: "0 0 30px hsl(var(--primary) / 0.5)",
              }}
            />
            
            <span className="relative z-10 text-primary-foreground">Hire Me</span>
          </motion.a>

          {/* Mobile Menu Button */}
          <motion.button
            className="relative z-10 md:hidden p-2.5 rounded-full bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors ml-2"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.nav>
      </motion.header>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-background/80 backdrop-blur-xl border border-foreground/10 shadow-lg group"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 30px hsl(var(--primary) / 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp size={18} className="text-primary group-hover:text-foreground transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/95 backdrop-blur-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Animated background orbs */}
            <motion.div
              className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-[100px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-accent/20 blur-[100px]"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Menu Content */}
            <nav className="relative h-full flex flex-col items-center justify-center gap-6 px-8">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className={`relative flex items-center gap-4 text-3xl sm:text-4xl font-display font-bold ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ delay: i * 0.06, ease: [0.25, 0.4, 0.25, 1] }}
                    whileHover={{ x: 10 }}
                  >
                    <span className="text-sm font-mono text-primary/60">0{i + 1}</span>
                    <span className={isActive ? "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" : ""}>
                      {link.name}
                    </span>
                    {isActive && (
                      <motion.span
                        className="w-2 h-2 rounded-full bg-primary"
                        layoutId="mobileActiveIndicator"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.a>
                );
              })}

              {/* Mobile CTA - WhatsApp */}
              <motion.a
                href="https://wa.me/919925937717?text=Hi%20Tanishq%2C%20I%27m%20interested%20in%20hiring%20you!"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 px-10 py-4 rounded-full bg-gradient-to-r from-primary to-accent font-semibold text-lg text-primary-foreground shadow-lg"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ delay: 0.35 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: "0 0 40px hsl(var(--primary) / 0.3)",
                }}
              >
                Let's Connect
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
