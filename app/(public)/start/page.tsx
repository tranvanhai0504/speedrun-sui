"use client";

import Link from "next/link";
import {
    Terminal,
    Download,
    Play,
    ChevronRight,
    CheckCircle2,
    Cpu,
    Wallet,
    Code2,
    Settings,
    Zap,
    Box,
    Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChallenges } from "@/hooks/useApi";
import { ChallengeCard } from "@/components/ChallengeCard";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useBuilderProfile } from "@/hooks/useApi";

interface StepCartridgeProps {
    number: string;
    title: string;
    description: string;
    icon: React.ElementType;
    children?: React.ReactNode;
    isLast?: boolean;
}

function StepCartridge({ number, title, description, icon: Icon, children, isLast }: StepCartridgeProps) {
    return (
        <div className={cn("relative flex gap-6", !isLast && "pb-12")}>
            {/* Connecting Line */}
            {!isLast && (
                <div className="absolute left-[26px] top-14 bottom-0 w-1 bg-black z-0" />
            )}

            {/* Icon / Number */}
            <div className="relative z-10 flex-shrink-0">
                <div className="bg-white border-4 border-black w-14 h-14 flex items-center justify-center rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <span className="font-black text-xl">{number}</span>
                </div>
            </div>

            {/* Content Card */}
            <div className="flex-grow">
                <div className="bg-white border-4 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative group">
                    {/* Decorative background icon */}
                    <Icon className="absolute -right-4 -bottom-4 w-32 h-32 text-gray-100 -rotate-12 pointer-events-none group-hover:text-blue-50 transition-colors" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-black text-white p-1.5 rounded-md">
                                <Icon size={20} />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight text-[#0F2854]">{title}</h3>
                        </div>
                        <p className="text-gray-600 font-bold mb-6 max-w-2xl text-lg leading-relaxed">
                            {description}
                        </p>
                        <div className="space-y-4">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function StartPage() {
    const { data: challenges, isLoading } = useChallenges();
    const currentAccount = useCurrentAccount();
    const { data: profile } = useBuilderProfile(currentAccount?.address || "");

    const sortedChallenges = challenges?.sort((a, b) => Number(a.challenge_id) - Number(b.challenge_id)).map((challenge, index, array) => {
        const completedChallenges = profile?.completed_challenges || [];
        const isCompleted = completedChallenges.includes(challenge.challenge_id);
        const isPreviousCompleted = index > 0 && completedChallenges.includes(array[index - 1].challenge_id);

        let status: "locked" | "open" | "completed" = "locked";

        if (isCompleted) {
            status = "completed" as const;
        } else if (index === 0 || isPreviousCompleted) {
            status = "open" as const;
        }

        return {
            ...challenge,
            status
        };
    });

    return (
        <div className="min-h-screen bg-[#F0F4F8] pb-20">
            {/* Hero Header */}
            <div className="bg-[#0F2854] text-white py-20 pt-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-[#FFD966] text-black px-4 py-1.5 rounded-full border-2 border-black font-black uppercase tracking-widest text-sm mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                        <Cpu size={18} />
                        System Initialization
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
                        Setup Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4988C4] to-[#4988C4]">Rig</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-bold text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Before we start the speedrun, we need to calibrate your development environment. Follow these steps to prepare for launch.
                    </p>
                </div>
            </div>

            {/* Video Placeholder Section */}
            <div className="container mx-auto px-4 -mt-10 relative z-20 mb-20">
                <div className="max-w-4xl mx-auto bg-black rounded-2xl p-2 shadow-[8px_8px_0px_0px_#4988C4] border-4 border-black">
                    <div className="aspect-video bg-gray-900 rounded-xl relative overflow-hidden flex items-center justify-center group cursor-pointer">
                        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10"></div>
                        <div className="text-center p-8">
                            <div className="w-20 h-20 bg-[#FFD966] rounded-full flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_white] mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Play className="ml-2 w-8 h-8 text-black fill-current" />
                            </div>
                            <h3 className="text-white font-black text-2xl uppercase tracking-widest mb-2">Orientation Briefing</h3>
                            <p className="text-gray-400 font-mono">Watch the setup guide (Coming Soon)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Steps Container */}
            <div className="container mx-auto px-4 max-w-4xl mb-32">
                <div className="space-y-0">
                    {/* Step 1: Prerequisites */}
                    <StepCartridge
                        number="01"
                        title="Essential Tools"
                        description="Equip yourself with the fundamental tools required for Sui development. You'll need Node.js for the frontend and Rust/Cargo for the Move smart contracts."
                        icon={Settings}
                    >
                        <div className="grid md:grid-cols-3 gap-4">
                            <a href="https://nodejs.org/" target="_blank" className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4988C4] hover:bg-blue-50 transition-colors group">
                                <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                    <span className="font-black text-green-700">JS</span>
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Node.js</div>
                                    <div className="text-xs text-gray-500">v18+ Required</div>
                                </div>
                            </a>
                            <a href="https://git-scm.com/" target="_blank" className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4988C4] hover:bg-blue-50 transition-colors group">
                                <div className="w-10 h-10 bg-orange-100 rounded flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                    <span className="font-black text-orange-700">Git</span>
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Git</div>
                                    <div className="text-xs text-gray-500">Version Control</div>
                                </div>
                            </a>
                            <a href="https://rustup.rs/" target="_blank" className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4988C4] hover:bg-blue-50 transition-colors group">
                                <div className="w-10 h-10 bg-black rounded flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                                    <span className="font-black text-white">Rs</span>
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Rust & Cargo</div>
                                    <div className="text-xs text-gray-500">Core Language</div>
                                </div>
                            </a>
                        </div>
                    </StepCartridge>

                    {/* Step 2: Sui Binaries */}
                    <StepCartridge
                        number="02"
                        title="Install Sui CLI"
                        description="Install the Sui command-line interface. This is your primary weapon for interacting with the Sui network, compiling Move code, and deploying contracts."
                        icon={Terminal}
                    >
                        <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto shadow-inner border-2 border-black">
                            <div className="flex items-center gap-2 mb-2 text-gray-500 border-b border-gray-700 pb-2">
                                <Terminal size={14} />
                                <span>terminal</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-green-400 mb-1"># MacOS / Linux (using Brew)</p>
                                    <p className="select-all cursor-pointer">brew install sui</p>
                                </div>
                                <div>
                                    <p className="text-green-400 mb-1"># From Source (Cargo)</p>
                                    <p className="select-all cursor-pointer">cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui</p>
                                </div>
                                <div>
                                    <p className="text-blue-400 mb-1"># Verify Installation</p>
                                    <p className="select-all cursor-pointer">sui --version</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <a href="https://docs.sui.io/guides/developer/getting-started/sui-install" target="_blank" className="text-sm font-bold text-[#4988C4] hover:underline flex items-center gap-1">
                                Full Installation Guide <ChevronRight size={14} />
                            </a>
                        </div>
                    </StepCartridge>

                    {/* Step 3: Wallet Setup */}
                    <StepCartridge
                        number="03"
                        title="Wallet Configuration"
                        description="You need a safe place to store your loot. Install a Sui wallet to manage your assets, sign transactions, and interact with the dApps you build."
                        icon={Wallet}
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            <Button variant="outline" className="h-auto p-4 flex-1 border-2 border-black hover:bg-gray-50 justify-start" asChild>
                                <a href="https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbnyfyjmg" target="_blank">
                                    <div className="bg-blue-100 p-2 rounded-md mr-4">
                                        <Download size={20} className="text-blue-700" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-black text-[#0F2854]">Sui Wallet</div>
                                        <div className="text-xs text-gray-500">Official Browser Extension</div>
                                    </div>
                                </a>
                            </Button>
                            <Button variant="outline" className="h-auto p-4 flex-1 border-2 border-black hover:bg-gray-50 justify-start" asChild>
                                <a href="https://suiet.app/" target="_blank">
                                    <div className="bg-purple-100 p-2 rounded-md mr-4">
                                        <Download size={20} className="text-purple-700" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-black text-[#0F2854]">Suiet Wallet</div>
                                        <div className="text-xs text-gray-500">Popular Alternative</div>
                                    </div>
                                </a>
                            </Button>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-[#4988C4] p-4 text-sm text-blue-900 rounded-r-md">
                            <strong>Tip:</strong> Switch your wallet network to <strong>Testnet</strong> to obtain free SUI tokens from the faucet for development.
                        </div>
                    </StepCartridge>

                    {/* Step 4: Challenge 0 */}
                    <StepCartridge
                        number="04"
                        title="First Deployment"
                        description="Your environment is ready. It's time to run a milestone check. Complete Challenge 0 to verify your setup and mint your first 'Speedrun Sui' completion NFT."
                        icon={Code2}
                        isLast={true}
                    >
                        <div className="flex items-center gap-4 bg-[#FFD966] p-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <div className="bg-white p-3 rounded-lg border-2 border-black">
                                <CheckCircle2 size={32} className="text-green-500" />
                            </div>
                            <div className="flex-grow">
                                <h4 className="font-black text-lg text-black">Challenge 1: Hello World</h4>
                                <p className="text-sm font-bold opacity-80 text-black">Learn the basics of Move & Scaffold-Sui</p>
                            </div>
                            <Button size="lg" className="bg-black text-white hover:bg-gray-800 border-2 border-black font-black uppercase" asChild>
                                <Link href="/challenges/1">
                                    Start Now
                                </Link>
                            </Button>
                        </div>
                    </StepCartridge>
                </div>
            </div>

            {/* Why Build on Sui Move Section */}
            <div className="bg-white border-y-4 border-black py-24 mb-20 relative">
                {/* Diagonal Pattern Background */}
                <div className="absolute inset-0 bg-[url('/diagonal-stripes.png')] opacity-5 pointer-events-none" />

                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black uppercase text-[#0F2854] mb-4">Why Build on <span className="text-[#4988C4]">Sui Move</span>?</h2>
                        <p className="text-xl text-gray-500 font-bold max-w-3xl mx-auto">
                            Sui isn't just another L1. It redefines ownership with an object-centric data model and the Move programming language.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Benefit 1 */}
                        <div className="bg-[#F0F4F8] p-8 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_black] hover:-translate-y-1 transition-transform">
                            <div className="w-16 h-16 bg-[#FFD966] rounded-xl border-4 border-black flex items-center justify-center mb-6 shadow-[2px_2px_0px_0px_black]">
                                <Box size={32} className="text-black" />
                            </div>
                            <h3 className="text-2xl font-black uppercase mb-3 text-[#0F2854]">Object Centric</h3>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                Everything in Sui is an object. Unlike other chains where storage is account-based, Sui's object model makes asset ownership intuitive and composable by default.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="bg-[#F0F4F8] p-8 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_black] hover:-translate-y-1 transition-transform">
                            <div className="w-16 h-16 bg-[#4988C4] rounded-xl border-4 border-black flex items-center justify-center mb-6 shadow-[2px_2px_0px_0px_black]">
                                <Zap size={32} className="text-white fill-current" />
                            </div>
                            <h3 className="text-2xl font-black uppercase mb-3 text-[#0F2854]">Parallel Execution</h3>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                Because objects are distinct, transactions that don't touch the same objects can run in parallel. This unlocks massive scalability and low latency.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className="bg-[#F0F4F8] p-8 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_black] hover:-translate-y-1 transition-transform">
                            <div className="w-16 h-16 bg-black rounded-xl border-4 border-white flex items-center justify-center mb-6 shadow-[2px_2px_0px_0px_gray]">
                                <Rocket size={32} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-black uppercase mb-3 text-[#0F2854]">Move Language</h3>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                Born from Meta's Diem project, Move is designed for safety. It prevents double-spending and reentrancy attacks at the language level.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Challenges Overview Section */}
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-sm mb-4">
                        <Terminal size={14} />
                        Curriculum
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase text-[#0F2854] mb-4">Available Challenges</h2>
                    <p className="text-xl text-gray-500 font-bold max-w-2xl mx-auto">
                        Your roadmap from zero to hero. Complete these challenges to master Sui development.
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-20 font-bold text-gray-400 animate-pulse">
                        Loading Challenges data...
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedChallenges?.map((challenge) => (
                            <div key={challenge.challenge_id} className="h-full">
                                <ChallengeCard challenge={{
                                    id: Number(challenge.challenge_id),
                                    title: challenge.title,
                                    description: challenge.description,
                                    status: challenge.status || "locked",
                                    difficulty: challenge.difficulty,
                                    xp_reward: challenge.xp_reward,
                                    submission_count: challenge.submission_count,
                                }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-32 text-center">
                <p className="text-gray-500 font-bold mb-4">Need backup?</p>
                <Button variant="link" className="text-[#4988C4] font-black text-lg">
                    Join the Telegram Support Channel <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    );
}
