import { Navbar } from "@/components/Navbar";
import { ChallengeCard } from "@/components/ChallengeCard";
import { challenges } from "@/lib/challenges";
import { Testimonials } from "@/components/Testimonials";
import { ProgressDemo } from "@/components/ProgressDemo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-950 dark:to-slate-900 overflow-x-hidden font-sans">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 text-primary font-bold text-sm mb-8 shadow-sm border border-white/50">
            <Sparkles className="h-4 w-4" /> New: Challenge 4 Released!
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-800 dark:text-white drop-shadow-sm">
            Level Up Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              Sui Move Skills
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Speedrun Sui is the most fun way to learn Move. complete quests, earn NFTs,
            and build your on-chain reputation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="rounded-full px-12 text-lg shadow-xl shadow-primary/30 h-16">
              Start Building Now <ArrowRight className="ml-2" />
            </Button>
            <Button variant="ghost" size="lg" className="rounded-full h-16 text-lg hover:bg-white/50">
              View Curriculum
            </Button>
          </div>
        </section>

        {/* Progress Demo Section */}
        <section className="py-12 bg-white/30 backdrop-blur-sm border-y border-white/50">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="px-8 text-left space-y-6">
              <h2 className="text-3xl font-bold text-slate-800">Visual Progress Tracking</h2>
              <p className="text-lg text-muted-foreground">
                Watch your developer level grow as you ship code. Every challenge completed
                earns you XP and unlocks new abilities.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center text-white font-bold">✓</div>
                  <span>Real-time verification</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">✓</div>
                  <span>On-chain achievements</span>
                </li>
              </ul>
            </div>
            <ProgressDemo />
          </div>
        </section>

        {/* Curriculum Section */}
        <section className="py-24 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-800 mb-4">Curriculum</h2>
            <p className="text-muted-foreground text-lg">From "Hello World" to DeFi Wizard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                <ChallengeCard challenge={challenge} />
              </div>
            ))}
          </div>
        </section>

        <Testimonials />

        {/* CTA Section */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-4xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to Speedrun?</h2>
              <p className="text-xl opacity-90 mb-10 max-w-xl mx-auto">
                Join 10,000+ developers building the future of Sui. It's free and always will be.
              </p>
              <Button size="lg" variant="secondary" className="rounded-full px-12 h-16 text-lg shadow-lg">
                Get Started
              </Button>
            </div>

            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
        </section>
      </main>

      <footer className="py-12 text-center text-slate-500 font-medium">
        <p>© 2024 Speedrun Sui. Built with ❤️ for the community.</p>
      </footer>
    </div>
  );
}
