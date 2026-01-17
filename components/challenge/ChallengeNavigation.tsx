"use client";

import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

interface Challenge {
    challenge_id: string;
    title: string;
    status?: "locked" | "open" | "completed";
}

interface ChallengeNavigationProps {
    previousChallenge: Challenge | null;
    nextChallenge: Challenge | null;
}

export function ChallengeNavigation({ previousChallenge, nextChallenge }: ChallengeNavigationProps) {
    return (
        <div className="mt-8 flex items-center justify-between gap-6">
            {/* Previous Challenge */}
            {previousChallenge ? (
                <Link
                    href={`/challenges/${previousChallenge.challenge_id}`}
                    className="flex-1 flex items-center gap-4 px-8 py-6 rounded-full border-2 border-[#0F2854] bg-white hover:bg-secondary/20 hover:shadow-[4px_4px_0px_0px_#0F2854] hover:-translate-x-1 transition-all group"
                >
                    <ArrowLeft className="h-6 w-6 text-[#0F2854] group-hover:scale-110 transition-transform flex-shrink-0" />
                    <div className="text-left">
                        <div className="text-sm text-gray-500 font-bold uppercase">Previous</div>
                        <div className="font-bold text-lg text-[#0F2854]">{previousChallenge.title}</div>
                    </div>
                </Link>
            ) : (
                <div className="flex-1 flex items-center gap-4 px-8 py-6 rounded-full border-2 border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed">
                    <ArrowLeft className="h-6 w-6 text-gray-400 flex-shrink-0" />
                    <div className="text-left">
                        <div className="text-sm text-gray-400 font-bold uppercase">Previous</div>
                        <div className="text-lg text-gray-400">No previous</div>
                    </div>
                </div>
            )}

            {/* Next Challenge */}
            {nextChallenge ? (
                nextChallenge.status === "locked" ? (
                    <div className="flex-1 flex items-center justify-end gap-4 px-8 py-6 rounded-full border-2 border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed">
                        <div className="text-right">
                            <div className="text-sm text-gray-400 font-bold uppercase">Next</div>
                            <div className="text-lg text-gray-400 flex items-center justify-end gap-2">
                                <Lock className="h-5 w-5" />
                                Locked
                            </div>
                        </div>
                        <ArrowLeft className="h-6 w-6 text-gray-400 rotate-180 flex-shrink-0" />
                    </div>
                ) : (
                    <Link
                        href={`/challenges/${nextChallenge.challenge_id}`}
                        className="flex-1 flex items-center justify-end gap-4 px-8 py-6 rounded-full border-2 border-[#0F2854] bg-white hover:bg-secondary/20 hover:shadow-[4px_4px_0px_0px_#0F2854] hover:translate-x-1 transition-all group"
                    >
                        <div className="text-right">
                            <div className="text-sm text-gray-500 font-bold uppercase">Next</div>
                            <div className="font-bold text-lg text-[#0F2854]">{nextChallenge.title}</div>
                        </div>
                        <ArrowLeft className="h-6 w-6 text-[#0F2854] rotate-180 group-hover:scale-110 transition-transform flex-shrink-0" />
                    </Link>
                )
            ) : (
                <div className="flex-1 flex items-center justify-end gap-4 px-8 py-6 rounded-full border-2 border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed">
                    <div className="text-right">
                        <div className="text-sm text-gray-400 font-bold uppercase">Next</div>
                        <div className="text-lg text-gray-400">No next</div>
                    </div>
                    <ArrowLeft className="h-6 w-6 text-gray-400 rotate-180 flex-shrink-0" />
                </div>
            )}
        </div>
    );
}
