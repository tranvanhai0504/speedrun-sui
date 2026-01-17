import { Navbar } from "@/components/Navbar";
import { ChallengeCard } from "@/components/ChallengeCard";
import { challenges } from "@/lib/challenges";
import { Testimonials } from "@/components/Testimonials";
import { ProgressDemo } from "@/components/ProgressDemo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Trophy, ShieldCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary selection:text-white">
      <Navbar />

      <main className="pt-32">
        {/* Hero Section */}
        <section className="container mx-auto px-20 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text */}
            <div className="text-left space-y-8">
              <div className="text-white inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-black font-bold text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Sparkles className="h-4 w-4" /> New: Challenge 4 Released!
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-black">
                Level Up Your <br />
                <span className="bg-primary text-white px-2 decoration-clone">
                  Sui Move Skills
                </span>
              </h1>

              <p className="text-xl text-black/80 font-medium max-w-lg leading-relaxed border-l-4 border-black pl-6">
                Speedrun Sui is the most fun way to learn Move. Complete quests, earn NFTs, and build your on-chain reputation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-xl h-16 text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                  Start Building Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-xl h-16 text-lg bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                  View Challenges
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex flex-col">
                  <span className="font-black text-3xl">10K+</span>
                  <span className="text-sm font-bold text-gray-600">Builders</span>
                </div>
                <div className="bg-black w-0.5 h-10"></div>
                <div className="flex flex-col">
                  <span className="font-black text-3xl">50+</span>
                  <span className="text-sm font-bold text-gray-600">Challenges</span>
                </div>
                <div className="bg-black w-0.5 h-10"></div>
                <div className="flex flex-col">
                  <span className="font-black text-3xl">Free</span>
                  <span className="text-sm font-bold text-gray-600">Forever</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual */}
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-secondary rounded-full border-2 border-black flex items-center justify-center animate-bounce duration-1000 z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Zap className="h-10 w-10 text-black fill-white" />
              </div>

              <div className="bg-white p-2 rounded-[2rem] border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <ProgressDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid ("Why Choose Us") */}
        <section className="py-20 bg-white border-y-2 border-black">
          <div className="container mx-auto px-20">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-black text-black mb-4">Why Speedrun Sui?</h2>
                <p className="text-xl text-gray-600 max-w-xl">Everything you need to go from zero to hero in Move development.</p>
              </div>
              <Button variant="secondary" className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">View All Features</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-accent p-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform duration-200">
                <div className="w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <Trophy className="h-6 w-6 text-black" />
                </div>
                <h3 className="font-black text-xl mb-2">Gamified Learning</h3>
                <p className="text-sm font-medium text-black/70">Earn XP, NFTs, and badges as you complete challenges and level up.</p>
              </div>
              {/* Feature 2 */}
              <div className="bg-primary p-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform duration-200">
                <div className="w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <Zap className="h-6 w-6 text-black" />
                </div>
                <h3 className="font-black text-xl mb-2">Instant Feedback</h3>
                <p className="text-sm font-medium text-black/70">Get real-time verification of your code directly on the blockchain.</p>
              </div>
              {/* Feature 3 */}
              <div className="bg-secondary p-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform duration-200">
                <div className="w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <Users className="h-6 w-6 text-black" />
                </div>
                <h3 className="font-black text-xl mb-2">Community Driven</h3>
                <p className="text-sm font-medium text-black/70">Join thousands of builders sharing knowledge and specialized resources.</p>
              </div>
              {/* Feature 4 */}
              <div className="bg-[#EEEFE0] p-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform duration-200">
                <div className="w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <ShieldCheck className="h-6 w-6 text-black" />
                </div>
                <h3 className="font-black text-xl mb-2">Battle Tested</h3>
                <p className="text-sm font-medium text-black/70">Learn security best practices and patterns used in production apps.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section className="py-24 container mx-auto px-20">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-5xl font-black text-black mb-6">Curriculum</h2>
            <p className="text-xl font-medium text-gray-600 bg-white inline-block px-6 py-2 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              From "Hello World" to DeFi Wizard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="h-full">
                <ChallengeCard challenge={challenge} />
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials - assuming Component exists, wrapping in section for spacing if needed */}
        <section className="py-10">
          <Testimonials />
        </section>

        {/* CTA Section */}
        <section className="py-24 px-20 text-center">
          <div className="max-w-5xl mx-auto bg-primary rounded-[2.5rem] p-12 md:p-20 text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">Ready to Speedrun?</h2>
              <p className="text-xl font-bold opacity-90 mb-10 max-w-xl mx-auto">
                Join 10,000+ developers building the future of Sui. It's free and always will be.
              </p>
              <Button size="lg" className="rounded-xl px-12 h-20 text-xl border-2 border-black bg-white text-black hover:bg-gray-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]">
                Get Started Now <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t-2 border-black bg-white text-center">
        <div className="container mx-auto px-20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-black text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            SPEEDRUN SUI
          </div>
          <p className="text-gray-600 font-bold">© 2024 Speedrun Sui. Built with ❤️ for the community.</p>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="rounded-lg border-2 border-black hover:bg-primary hover:text-white transition-colors">
              <Users size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-lg border-2 border-black hover:bg-primary hover:text-white transition-colors">
              <Zap size={20} />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
