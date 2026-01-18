import Link from "next/link";
import { CheckCircle2, Lock, Play, Trophy, Zap, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ChallengeCardProps {
    challenge: {
        id: number | string;
        title: string;
        description: string;
        status: "locked" | "open" | "completed";
        difficulty?: string;
        xp_reward?: number;
        submission_count?: number;
    };
}

const DifficultyStars = ({ level }: { level: string }) => {
    const stars = level === "HARD" ? 3 : level === "MEDIUM" ? 2 : 1;
    return (
        <div className="flex gap-0.5" title={`Difficulty: ${level}`}>
            {[1, 2, 3].map((i) => (
                <Star
                    key={i}
                    size={14}
                    className={cn(
                        "fill-current",
                        i <= stars ? "text-yellow-500" : "text-gray-300"
                    )}
                />
            ))}
        </div>
    );
};

export function ChallengeCard({ challenge }: ChallengeCardProps) {
    const isLocked = challenge.status === "locked";
    const isCompleted = challenge.status === "completed";

    return (
        <Card className={cn(
            "group relative flex flex-col h-full transition-all duration-300 border-4 border-black bg-white overflow-hidden rounded-2xl",
            isLocked ? "bg-gray-100 shadow-none" : "hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        )}>
            {/* Locked Overlay Pattern */}
            {isLocked && (
                <div className="absolute inset-0 bg-[url('/diagonal-stripes.png')] opacity-[0.03] pointer-events-none z-0" />
            )}

            {/* Header / HUD */}
            <div className="flex justify-between items-center p-4 border-b-4 border-black bg-slate-50 relative z-10">
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "text-xs font-mono font-black px-2 py-1 rounded",
                        isLocked ? "bg-gray-400 text-white" : "bg-black text-white"
                    )}>
                        LVL {String(challenge.id).padStart(2, '0')}
                    </span>
                    {challenge.difficulty && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded bg-white border-2 border-black text-xs font-bold">
                            <DifficultyStars level={challenge.difficulty} />
                        </div>
                    )}
                </div>
                <div>
                    {isCompleted ? (
                        <div className="bg-green-400 border-2 border-black p-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <CheckCircle2 className="text-black h-5 w-5" strokeWidth={3} />
                        </div>
                    ) : isLocked ? (
                        <Lock className="text-gray-400 h-6 w-6" />
                    ) : (
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-400 blur-sm rounded-full animate-pulse" />
                            <div className="bg-green-500 border-2 border-black p-1 rounded-full relative z-10">
                                <Play className="text-white h-4 w-4 fill-current ml-0.5" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <CardContent className="flex-grow p-6 flex flex-col gap-4 relative z-10">
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-black leading-none mb-2 group-hover:text-[#4988C4] transition-colors">
                        {challenge.title}
                    </h3>
                    <p className="text-sm font-bold text-gray-500 line-clamp-3 leading-relaxed">
                        {challenge.description}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="mt-auto grid grid-cols-2 gap-3 pt-4">
                    <div className="bg-[#E0F2FE] border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider">Reward</span>
                        <div className="flex items-center gap-1 text-blue-900 font-black text-xl">
                            <Zap size={18} className="fill-current text-yellow-500" />
                            {challenge.xp_reward || 0}
                        </div>
                    </div>
                    <div className="bg-[#F0FDF4] border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <span className="text-[10px] font-black uppercase text-green-800 tracking-wider">Players</span>
                        <div className="flex items-center gap-1 text-green-900 font-black text-xl">
                            <Users size={18} />
                            {challenge.submission_count || 0}
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* Footer Action */}
            <div className="p-4 pt-0 relative z-10">
                <Button
                    className={cn(
                        "w-full h-12 text-lg font-black uppercase tracking-widest border-2 border-black transition-all duration-200",
                        isLocked
                            ? "bg-gray-200 text-gray-400 hover:bg-gray-200 cursor-not-allowed shadow-none border-gray-300"
                            : "bg-[#FFD966] text-black hover:bg-[#FFE082] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    )}
                    disabled={isLocked}
                    asChild={!isLocked}
                >
                    {isLocked ? (
                        <span className="flex items-center gap-2"><Lock size={16} /> Locked</span>
                    ) : (
                        <Link href={`/challenges/${challenge.id}`}>
                            Start Challenge
                        </Link>
                    )}
                </Button>
            </div>
        </Card>
    );
}
