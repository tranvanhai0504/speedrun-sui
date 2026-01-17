import { challenges } from "@/lib/challenges";
import { ChallengeCard } from "@/components/ChallengeCard";
import { ArrowLeft, CheckCircle2, Copy, ExternalLink, Github, Medal, Share2, Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock Data for the prototype
const MOCK_USER = {
    address: "0x8A99...0727",
    fullAddress: "0x8A991117Ee479A0bA855177Cea5074E4551B0727",
    ens: "builder.sui",
    xp: 450,
    level: 3,
    joinedDate: "October 2024",
    achievements: [
        { id: 1, label: "First Deployment", completed: true },
        { id: 2, label: "Token Creator", completed: true },
        { id: 3, label: "DeFi Master", completed: false },
        { id: 4, label: "NFT Artist", completed: false },
    ],
    completedChallenges: [0, 1]
};

export default async function BuilderPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    // In a real app, fetch user data based on 'id' here
    const user = { ...MOCK_USER, address: id.length > 15 ? `${id.slice(0, 6)}...${id.slice(-4)}` : id };

    // Calculate progress
    const totalChallenges = challenges.length;
    const completedCount = user.completedChallenges.length;
    const progressPercentage = (completedCount / totalChallenges) * 100;

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-20">
                {/* Back Link */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 font-bold text-[#0F2854] hover:underline">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Profile Info */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Profile Card */}
                        <div className="bg-white p-8 rounded-[2rem] border-2 border-[#0F2854] shadow-[8px_8px_0px_0px_#0F2854]">
                            <div className="flex flex-col items-center text-center">
                                {/* Avatar */}
                                <div className="w-32 h-32 bg-[#4988C4] rounded-2xl border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854] mb-6 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${id}`}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <h1 className="text-2xl font-black text-[#0F2854] mb-2 break-all">
                                    {user.ens || user.address}
                                </h1>

                                <div className="flex items-center gap-2 text-sm font-bold text-[#0F2854]/70 mb-6 bg-secondary/30 px-3 py-1 rounded-full border border-[#0F2854]/20">
                                    <span>Joined {user.joinedDate}</span>
                                </div>

                                <div className="flex gap-3 w-full">
                                    <Button variant="outline" className="flex-1 border-2 border-[#0F2854] shadow-[2px_2px_0px_0px_#0F2854] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none">
                                        <Copy className="h-4 w-4 mr-2" /> Copy
                                    </Button>
                                    <Button variant="outline" className="flex-1 border-2 border-[#0F2854] shadow-[2px_2px_0px_0px_#0F2854] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none">
                                        <Share2 className="h-4 w-4 mr-2" /> Share
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-8 border-t-2 border-[#0F2854]/10 pt-8 space-y-6">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="font-black text-[#0F2854] uppercase tracking-wider text-sm">Level {user.level}</span>
                                        <span className="font-bold text-[#4988C4]">{user.xp} XP</span>
                                    </div>
                                    <div className="w-full h-4 bg-gray-100 rounded-full border-2 border-[#0F2854] overflow-hidden">
                                        <div className="h-full bg-[#4988C4]" style={{ width: '65%' }}></div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center bg-[#BDE8F5]/30 p-4 rounded-xl border-2 border-[#0F2854]">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="h-6 w-6 text-[#1C4D8D]" />
                                        <span className="font-bold text-[#0F2854]">Rank</span>
                                    </div>
                                    <span className="font-black text-2xl text-[#1C4D8D]">#42</span>
                                </div>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className="bg-white p-6 rounded-2xl border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854]">
                            <h3 className="font-black text-xl text-[#0F2854] mb-4 flex items-center gap-2">
                                <Medal className="h-5 w-5" /> Achievements
                            </h3>
                            <div className="space-y-3">
                                {user.achievements.map((ach) => (
                                    <div key={ach.id} className={`flex items-center justify-between p-3 rounded-lg border-2 ${ach.completed ? 'bg-[#BDE8F5]/50 border-[#4988C4]' : 'bg-gray-50 border-gray-200'}`}>
                                        <span className={`font-bold ${ach.completed ? 'text-[#0F2854]' : 'text-gray-400'}`}>{ach.label}</span>
                                        {ach.completed ? (
                                            <CheckCircle2 className="h-5 w-5 text-[#4988C4]" />
                                        ) : (
                                            <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Overall Progress */}
                        <div className="bg-[#0F2854] text-white p-8 rounded-[2rem] border-2 border-[#0F2854] shadow-[8px_8px_0px_0px_#4988C4] relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <h2 className="text-3xl font-black mb-2">Builder Progress</h2>
                                    <p className="text-[#BDE8F5] font-medium">You've completed {completedCount} out of {totalChallenges} challenges.</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-5xl font-black mb-1">{Math.round(progressPercentage)}%</div>
                                    <div className="text-xs font-bold uppercase tracking-widest opacity-80">Completed</div>
                                </div>
                            </div>
                            {/* Decorative bg */}
                            <Zap className="absolute -right-6 -bottom-6 w-40 h-40 text-white/5 rotate-12" />
                        </div>

                        {/* Challenge Grid */}
                        <div>
                            <h3 className="text-2xl font-black text-[#0F2854] mb-8 flex items-center gap-3">
                                <span className="bg-[#4988C4] text-white px-3 py-1 rounded-lg border-2 border-[#0F2854] text-sm shadow-[3px_3px_0px_0px_#0F2854]">
                                    {challenges.length}
                                </span>
                                Challenges
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {challenges.map((challenge) => {
                                    // Override status for mock view
                                    const isCompleted = user.completedChallenges.includes(challenge.id);
                                    const status = isCompleted ? "completed" : challenge.status;
                                    const challengeWithStatus = { ...challenge, status };

                                    return (
                                        <div key={challenge.id} className="group relative">
                                            <ChallengeCard challenge={challengeWithStatus as any} />
                                            {isCompleted && (
                                                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm border border-green-700 flex items-center gap-1 z-10">
                                                    <CheckCircle2 className="h-3 w-3" /> VERIFIED
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
