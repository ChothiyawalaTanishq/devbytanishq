import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { ScrollReveal, TiltCard } from "../animations";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechVenture",
    content: "Alex delivered beyond our expectations. The attention to detail and creative solutions transformed our product completely. Absolutely world-class work.",
    rating: 5,
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "CTO, FinanceFlow",
    content: "Working with Alex was a game-changer for our startup. The technical expertise combined with stunning design sense is rare to find. Highly recommended!",
    rating: 5,
    avatar: "MJ",
  },
  {
    name: "Emily Rodriguez",
    role: "Product Lead, CreativeHub",
    content: "The most talented developer I've worked with. Alex brought innovative ideas to every meeting and delivered pixel-perfect implementations on time.",
    rating: 5,
    avatar: "ER",
  },
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) => (
  <ScrollReveal delay={index * 0.15} direction={index === 1 ? "up" : index === 0 ? "left" : "right"}>
    <TiltCard className="h-full" tiltAmount={8}>
      <motion.div 
        className="glass-card h-full flex flex-col"
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Quote Icon */}
        <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
          <Quote size={16} className="rotate-180" />
        </div>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <Star size={16} className="text-gold fill-current" />
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <p className="text-foreground/90 leading-relaxed flex-grow mb-6 text-base md:text-lg">
          "{testimonial.content}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-4 pt-4 border-t border-border/30">
          <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center font-display font-bold text-sm">
            {testimonial.avatar}
          </div>
          <div>
            <div className="font-semibold">{testimonial.name}</div>
            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  </ScrollReveal>
);

export const TestimonialsSection = () => {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-40" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <div className="section-badge inline-flex mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-gold status-indicator" />
              <span>Testimonials</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
              What <span className="gradient-text-gold">Clients</span> Say
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
              Trusted by founders, CTOs, and product leaders worldwide.
            </p>
          </ScrollReveal>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={i} />
          ))}
        </div>

        {/* Client Logos / Trust Badges */}
        <ScrollReveal delay={0.5}>
          <div className="mt-20 text-center">
            <p className="text-muted-foreground text-sm mb-8 tracking-wider uppercase">
              Trusted by leading companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40">
              {["Google", "Meta", "Apple", "Amazon", "Microsoft"].map((company, i) => (
                <motion.span
                  key={company}
                  className="text-xl md:text-2xl font-display font-bold text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.4 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ opacity: 1, scale: 1.05 }}
                >
                  {company}
                </motion.span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
