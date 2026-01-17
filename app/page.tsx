"use client"

import { Testimonials } from "@/components/Testimonials";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Curriculum } from "@/components/home/Curriculum";
import { CTA } from "@/components/home/CTA";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary selection:text-white">
      <main className="pt-32">
        <Hero />
        <Features />
        <Curriculum />
        <section className="py-10">
          <Testimonials />
        </section>
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
