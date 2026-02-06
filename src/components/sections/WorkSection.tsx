import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight, Folder, Code2, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { ScrollReveal } from "../animations";
import projectSpotify from "@/assets/project-spotify.jpg";
import projectLMS from "@/assets/project-lms.jpg";
import projectAirquality from "@/assets/project-airquality.jpg";
import projectVoting from "@/assets/project-voting.jpg";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  year: string;
  featured?: boolean;
  liveUrl?: string;
  githubUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Spotify Clone",
    description: "A dynamic, Spotify-inspired music streaming web application with seamless navigation between artists, albums, and playlists. Designed an intuitive interface to enhance the user's listening experience.",
    category: "Frontend",
    tags: ["HTML", "CSS", "JavaScript"],
    image: projectSpotify,
    year: "2024",
    featured: true,
    githubUrl: "https://github.com/CodeHellBoy/Spotify-Clone",
  },
  {
    id: 2,
    title: "AI-Powered LMS",
    description: "Full-stack Learning Management System with responsive UI, quiz modules, dynamic course listings, AI chatbot integration, user authentication, and payment workflows.",
    category: "Full Stack",
    tags: ["HTML", "CSS", "JavaScript", "Bootstrap", "PHP", "MySQL"],
    image: projectLMS,
    year: "2025",
    featured: true,
    githubUrl: "https://github.com/CodeHellBoy/ai-learninghub",
  },
  {
    id: 3,
    title: "AirQuality Monitoring System",
    description: "IoT-based air quality monitoring system using Arduino and drone technology for real-time environmental data collection and analysis.",
    category: "IoT",
    tags: ["Arduino", "C++", "Sensors", "Drone"],
    image: projectAirquality,
    year: "2024",
    githubUrl: "https://github.com/CodeHellBoy/Arduino-AirQuality-Drone",
  },
  {
    id: 4,
    title: "Voting System",
    description: "Secure digital voting platform with user authentication, real-time vote counting, and comprehensive result analytics for transparent elections.",
    category: "Full Stack",
    tags: ["PHP", "MySQL", "JavaScript", "Bootstrap"],
    image: projectVoting,
    year: "2024",
    githubUrl: "https://github.com/CodeHellBoy/voting-system",
  },
];

// 3D Tilt Card Component
const ProjectCard = ({ project, index, size = "normal" }: { project: Project; index: number; size?: "large" | "normal" }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  const brightness = useTransform(mouseXSpring, [-0.5, 0, 0.5], [0.9, 1, 1.1]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const isLarge = size === "large";

  return (
    <motion.div
      ref={cardRef}
      className={`relative group ${isLarge ? "md:col-span-2 md:row-span-2" : ""}`}
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative h-full rounded-2xl overflow-hidden bg-card border border-border/50"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
          filter: isHovered ? `brightness(${brightness.get()})` : "brightness(1)",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Image Container */}
        <div className={`relative overflow-hidden ${isLarge ? "h-72 md:h-96" : "h-52 md:h-64"}`}>
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"
            animate={{ opacity: isHovered ? 0.6 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Category Badge */}
          <motion.div
            className="absolute top-4 left-4 flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-background/80 backdrop-blur-md border border-border/50 flex items-center gap-1.5">
              <Code2 size={12} className="text-primary" />
              {project.category}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-background/80 backdrop-blur-md border border-border/50">
              {project.year}
            </span>
          </motion.div>

          {/* Floating Actions */}
          <motion.div
            className="absolute top-4 right-4 flex gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
            transition={{ duration: 0.2 }}
          >
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                className="p-2.5 rounded-full bg-background/80 backdrop-blur-md border border-border/50 hover:bg-primary/20 hover:border-primary/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={16} />
              </motion.a>
            )}
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                className="p-2.5 rounded-full bg-background/80 backdrop-blur-md border border-border/50 hover:bg-primary/20 hover:border-primary/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink size={16} />
              </motion.a>
            )}
          </motion.div>

          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
            animate={{ x: isHovered ? "200%" : "-100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>

        {/* Content */}
        <div className={`p-6 ${isLarge ? "md:p-8" : ""} space-y-4`}>
          {/* Title with Arrow */}
          <div className="flex items-start justify-between gap-4">
            <h3 className={`font-display font-bold ${isLarge ? "text-2xl md:text-3xl" : "text-xl"} group-hover:text-primary transition-colors duration-300`}>
              {project.title}
            </h3>
            <motion.div
              className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/20 transition-colors"
              animate={{ rotate: isHovered ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowUpRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          </div>

          {/* Description */}
          <p className={`text-muted-foreground leading-relaxed ${isLarge ? "text-base line-clamp-3" : "text-sm line-clamp-2"}`}>
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.slice(0, isLarge ? 6 : 4).map((tag, i) => (
              <motion.span
                key={tag}
                className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                {tag}
              </motion.span>
            ))}
            {project.tags.length > (isLarge ? 6 : 4) && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                +{project.tags.length - (isLarge ? 6 : 4)}
              </span>
            )}
          </div>
        </div>

        {/* Border Glow on Hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? "inset 0 0 0 1px hsl(var(--primary) / 0.5), 0 0 40px hsl(var(--primary) / 0.15)"
              : "inset 0 0 0 1px transparent, 0 0 0 transparent",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Featured Badge */}
        {project.featured && (
          <motion.div
            className="absolute -top-1 -right-1 p-2"
            initial={{ rotate: 12 }}
            animate={{ rotate: [12, 15, 12] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold flex items-center gap-1">
              <Sparkles size={10} />
              Featured
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export const WorkSection = () => {
  return (
    <section id="work" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <ScrollReveal>
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <Folder size={14} className="text-primary" />
              <span className="text-sm font-medium text-primary">Featured Projects</span>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Selected <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Works</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              A curated collection of projects showcasing my expertise in building modern, scalable digital experiences.
            </p>
          </ScrollReveal>
        </div>

        {/* Projects Grid - Equal Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} size="normal" />
          ))}
        </div>

        {/* View All CTA */}
        <ScrollReveal delay={0.5}>
          <div className="text-center mt-16">
            <motion.a
              href="#"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-semibold">View All Projects</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowUpRight size={18} className="group-hover:text-primary transition-colors" />
              </motion.div>
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
