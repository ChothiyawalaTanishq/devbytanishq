import { motion } from "framer-motion";
import { useState } from "react";
import { ScrollReveal } from "../animations";
import CountUp from "../animations/CountUp";
import { Sparkles, Code2, Database, Brain } from "lucide-react";

interface Skill {
  name: string;
  icon: string;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  accentVar: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "AI / ML",
    icon: <Brain size={20} />,
    accentVar: "--accent",
    skills: [
      { name: "Python", icon: "🐍" },
      { name: "Machine Learning", icon: "🤖" },
      { name: "NLP", icon: "💬" },
      { name: "Generative AI", icon: "✨" },
      { name: "TensorFlow", icon: "🧠" },
    ],
  },
  {
    title: "Frontend",
    icon: <Code2 size={20} />,
    accentVar: "--primary",
    skills: [
      { name: "HTML", icon: "🌐" },
      { name: "CSS", icon: "🎨" },
      { name: "JavaScript", icon: "⚡" },
      { name: "Bootstrap", icon: "🅱️" },
    ],
  },
  {
    title: "Backend & Tools",
    icon: <Database size={20} />,
    accentVar: "--teal",
    skills: [
      { name: "PHP", icon: "🐘" },
      { name: "MySQL", icon: "🗄️" },
      { name: "Flask", icon: "⚗️" },
      { name: "Git", icon: "📂" },
    ],
  },
];

const SkillChip = ({ skill, index, accentVar }: { skill: Skill; index: number; accentVar: string }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.07,
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="relative flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-border/40 cursor-default overflow-hidden"
        style={{
          background: hovered
            ? `hsl(var(${accentVar}) / 0.08)`
            : `hsl(var(--secondary) / 0.5)`,
        }}
        whileHover={{
          scale: 1.08,
          borderColor: `hsl(var(${accentVar}) / 0.4)`,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {/* Shimmer sweep on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: "-100%", opacity: 0 }}
          animate={hovered ? { x: "100%", opacity: 1 } : { x: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            background: `linear-gradient(90deg, transparent, hsl(var(${accentVar}) / 0.15), transparent)`,
          }}
        />

        {/* Glow dot */}
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
          style={{ background: `hsl(var(${accentVar}))` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={hovered ? { scale: 1, opacity: 0.8 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        <motion.span
          className="text-xl relative z-10"
          animate={hovered ? { rotate: [0, -15, 15, 0], scale: 1.2 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {skill.icon}
        </motion.span>
        <span className="text-sm font-semibold text-foreground/85 relative z-10 whitespace-nowrap">
          {skill.name}
        </span>
      </motion.div>
    </motion.div>
  );
};

const CategoryCard = ({ category, index }: { category: SkillCategory; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.2, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div className="relative glass-card rounded-3xl p-7 h-full border border-border/30 hover:border-primary/20 transition-all duration-500 overflow-hidden group">
        {/* Animated gradient border top */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, hsl(var(${category.accentVar})), transparent)`,
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2 + 0.3, duration: 0.8, ease: "easeOut" }}
        />

        {/* Background orb */}
        <motion.div
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle, hsl(var(${category.accentVar}) / 0.1), transparent 70%)`,
          }}
        />

        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2 + 0.15 }}
        >
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: `hsl(var(${category.accentVar}) / 0.12)`,
              color: `hsl(var(${category.accentVar}))`,
              boxShadow: `0 0 20px hsl(var(${category.accentVar}) / 0.15)`,
            }}
            whileHover={{ rotate: 10, scale: 1.15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {category.icon}
          </motion.div>
          <h3 className="text-lg font-display font-bold text-foreground">{category.title}</h3>
          <motion.div
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(90deg, hsl(var(${category.accentVar}) / 0.3), transparent)`,
            }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 + 0.5, duration: 0.6 }}
          />
        </motion.div>

        {/* Skill Chips - Flowing wrap layout */}
        <div className="flex flex-wrap gap-2.5">
          {category.skills.map((skill, i) => (
            <SkillChip
              key={skill.name}
              skill={skill}
              index={i}
              accentVar={category.accentVar}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const SkillsSection = () => {
  return (
    <section id="skills" className="relative py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-30" />

      {/* Floating ambient particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/20 pointer-events-none"
          style={{ left: `${15 + i * 18}%`, top: `${10 + i * 15}%` }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 4 + i, delay: i * 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <div className="section-badge inline-flex mb-6">
              <motion.span
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>Skills & Expertise</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={14} className="text-primary" />
              </motion.div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              My <span className="gradient-text">Tech Stack</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              Technologies I work with to bring ideas to life
            </p>
          </ScrollReveal>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <CategoryCard key={category.title} category={category} index={index} />
          ))}
        </div>

        {/* Bottom Stats */}
        <ScrollReveal delay={0.4}>
          <div className="mt-20 flex flex-wrap justify-center gap-12 md:gap-20">
            {[
              { label: "Technologies", value: 14, suffix: "+" },
              { label: "Projects Built", value: 4, suffix: "+" },
              { label: "Always Learning", value: null, display: "∞" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center group cursor-default"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 200 }}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="text-4xl md:text-5xl font-display font-bold gradient-text"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {stat.value !== null ? (
                    <CountUp from={0} to={stat.value} duration={3} separator="," suffix={stat.suffix} className="gradient-text" />
                  ) : (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {stat.display}
                    </motion.span>
                  )}
                </motion.div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
