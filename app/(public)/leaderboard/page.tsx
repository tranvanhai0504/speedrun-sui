"use client";

import { useLeaderboard } from "@/hooks/useApi";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Trophy, Medal, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
    const { data: leaderboardData, isLoading, error } = useLeaderboard();
    const currentAccount = useCurrentAccount();

    const leaderboard = leaderboardData?.leaderboard || [];

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Trophy className="h-6 w-6 text-yellow-500 fill-yellow-500" />;
            case 1:
                return <Medal className="h-6 w-6 text-gray-400 fill-gray-400" />;
            case 2:
                return <Medal className="h-6 w-6 text-amber-700 fill-amber-700" />;
            default:
                return <span className="font-bold text-[#0F2854] text-lg w-6 text-center">{index + 1}</span>;
        }
    };

    return (
        <main className="min-h-screen pt-32 pb-20 bg-background">
            <div className="container mx-auto px-4 md:px-20">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-white font-bold text-sm border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854] mb-6">
                        <Trophy className="h-4 w-4" /> Hall of Fame
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-[#0F2854] mb-6">
                        Leaderboard
                    </h1>
                    <p className="text-xl font-medium text-gray-600 bg-white inline-block px-6 py-2 rounded-full border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854]">
                        Top Builders in the Sui Ecosystem
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-white rounded-3xl border-2 border-[#0F2854] shadow-[8px_8px_0px_0px_#0F2854] overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-6 bg-secondary/10 border-b-2 border-[#0F2854] font-black text-[#0F2854] uppercase tracking-wider text-sm md:text-base">
                        <div className="col-span-2 text-center">Rank</div>
                        <div className="col-span-6 md:col-span-6">Builder</div>
                        <div className="col-span-2 text-center">Level</div>
                        <div className="col-span-2 text-right">XP</div>
                    </div>

                    <div className="divide-y-2 divide-[#0F2854]/10">
                        {isLoading ? (
                            Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="grid grid-cols-12 gap-4 p-6 animate-pulse">
                                    <div className="col-span-2 bg-gray-200 h-6 rounded"></div>
                                    <div className="col-span-6 bg-gray-200 h-6 rounded"></div>
                                    <div className="col-span-2 bg-gray-200 h-6 rounded"></div>
                                    <div className="col-span-2 bg-gray-200 h-6 rounded"></div>
                                </div>
                            ))
                        ) : error ? (
                            <div className="p-12 text-center text-red-500 font-bold">
                                Failed to load leaderboard. Please try again later.
                            </div>
                        ) : (
                            leaderboard.map((builder, index) => {
                                const isCurrentUser = currentAccount?.address === builder.address;
                                return (
                                    <div
                                        key={builder.address}
                                        className={cn(
                                            "grid grid-cols-12 gap-4 p-6 items-center transition-colors hover:bg-secondary/5",
                                            isCurrentUser && "bg-yellow-50 hover:bg-yellow-100"
                                        )}
                                    >
                                        <div className="col-span-2 flex justify-center">
                                            {getRankIcon(index)}
                                        </div>
                                        <div className="col-span-6 md:col-span-6 flex items-center gap-3 overflow-hidden">
                                            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-blue-100 border-2 border-[#0F2854] flex items-center justify-center shrink-0">
                                                <User className="h-6 w-6 text-[#0F2854]" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="font-bold text-[#0F2854] truncate">
                                                    {builder.sui_ns?.name || `${builder.address.slice(0, 6)}...${builder.address.slice(-4)}`}
                                                </span>
                                                {isCurrentUser && (
                                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">You</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <span className="font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-300 text-sm">
                                                Lvl {builder.level}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <span className="font-black text-[#0F2854]">
                                                {builder.total_xp.toLocaleString()} XP
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
