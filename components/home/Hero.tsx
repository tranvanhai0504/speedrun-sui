import { Button } from "@/components/ui/button";
import GradientText from "@/components/GradientText";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import HacknativeSVG from "@/components/animationSVG/HacknativeSVG";
import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <section className="container mx-auto px-20 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column: Text */}
                <div className="text-left space-y-8">
                    <div className="text-white inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-black font-bold text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Sparkles className="h-4 w-4" /> New: Challenge 4 Released!
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-black">
                        Level Up Your <br />
                        <GradientText
                            colors={["#4988C4", "#1C4D8D", "#4988C4"]}
                            animationSpeed={3}
                            showBorder={false}
                            className="text-5xl md:text-7xl font-black"
                        >
                            Sui Move Skills
                        </GradientText>
                    </h1>

                    <p className="text-xl text-black/80 font-medium max-w-lg leading-relaxed border-l-4 border-black pl-6">
                        Speedrun Sui is the most fun way to learn Move. Complete quests, earn NFTs, and build your on-chain reputation.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild size="lg" className="rounded-xl h-16 text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                            <Link href="/start">
                                Start Building Now <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-xl h-16 text-lg bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]">
                            <Link href="/challenges">
                                View Challenges
                            </Link>
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
                <div className="relative flex items-center justify-center">
                    <div className="transform scale-150 hover:scale-[1.6] transition-transform duration-500">
                        <HacknativeSVG />
                    </div>
                    <motion.div
                        className="absolute z-0 size-32 pointer-events-none top-5 right-40"
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Image
                            src="/sui-coin.png"
                            alt="Hero Background"
                            fill
                            className="object-contain"
                        />
                    </motion.div>
                    <div className="absolute z-0 size-42 pointer-events-none -bottom-20 -left-0 rotate-80">
                        <Image
                            src="/fm-coin.png"
                            alt="Hero Background"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
