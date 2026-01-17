"use client"

import { Testimonials } from "@/components/Testimonials";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Curriculum } from "@/components/home/Curriculum";
import { CTA } from "@/components/home/CTA";
import { Footer } from "@/components/home/Footer";

import { motion, Variants } from "framer-motion";

export default function Home() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary selection:text-white">
      <main className="pt-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Hero />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Features />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Curriculum />
        </motion.div>

        <motion.section
          className="py-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Testimonials />
        </motion.section>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <CTA />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
