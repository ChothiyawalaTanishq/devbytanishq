import { useState, Suspense, lazy, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout";
import { Preloader, GeometricTrail, Spotlight, ScrollIndicator, SectionDivider } from "@/components/effects";
import { HeroSection, AboutSection, SkillsSection, WorkSection, TestimonialsSection, ContactSection } from "@/components/sections";
import Chatbot from "@/components/Chatbot";

// Lazy load WebGL component
const LaserFlow = lazy(() =>
  import("@/components/effects/LaserFlow").then((mod) => ({ default: mod.LaserFlow }))
);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Preloader */}
      <AnimatePresence>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Noise Overlay */}
        <div className="noise-overlay" />

        {/* Cursor Spotlight */}
        <Spotlight />

        {/* Background WebGL Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <Suspense fallback={null}>
            <LaserFlow />
          </Suspense>
        </div>

        {/* Mouse Particle Trail */}
        <GeometricTrail />

        {/* Navigation */}
        <Navbar />

        {/* Scroll Indicator */}
        <AnimatePresence>
          {showScrollIndicator && !isLoading && <ScrollIndicator />}
        </AnimatePresence>

        {/* Main Sections */}
        <main className="relative">
          <HeroSection />
          
          <SectionDivider variant="wave" />
          
          <AboutSection />
          
          <SectionDivider variant="dots" />
          
          <SkillsSection />
          
          <SectionDivider variant="gradient" />
          
          <WorkSection />
          
          <SectionDivider variant="wave" flip />
          
          <ContactSection />
        </main>

      </motion.div>

      {/* AI Chatbot */}
      <Chatbot />
    </>
  );
};

export default Index;
