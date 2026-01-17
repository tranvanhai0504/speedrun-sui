"use client";

import { ChallengeCard } from "@/components/ChallengeCard";
import { useBuilderProfile, useChallenges } from "@/hooks/useApi";
import { Sparkles } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function ChallengesPage() {
    const currentAccount = useCurrentAccount();
    const { data: challenges, isLoading, error } = useChallenges();
    const { data: profile, isLoading: isLoadingProfile, refetch } = useBuilderProfile(currentAccount?.address || "");

    const personalChallenges = challenges?.map((challenge, index) => {
        const completedChallenges = profile?.completed_challenges || [];
        const isCompleted = completedChallenges.includes(challenge.challenge_id);
        const isPreviousCompleted = index > 0 && completedChallenges.includes(challenges[index - 1].challenge_id);

        let status: "locked" | "open" | "completed" = "locked";

        if (isCompleted) {
            status = "completed" as const;
        } else if (index === 0 || isPreviousCompleted) {
            status = "open" as const;
        }

        return {
            ...challenge,
            status
        }
    }) || []

    return (
        <main className="min-h-screen pt-32 pb-20 bg-background">
            <div className="container mx-auto px-20">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-white font-bold text-sm border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854] mb-6">
                        <Sparkles className="h-4 w-4" /> Level Up Your Skills
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-[#0F2854] mb-6">
                        Speedrun Challenges
                    </h1>
                    <p className="text-xl font-medium text-gray-600 bg-white inline-block px-6 py-2 rounded-full border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854]">
                        Master Sui Move by Building Real Projects
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse border-2 border-gray-200"></div>
                        ))
                    ) : error ? (
                        <div className="col-span-full text-center text-red-500 font-bold p-8 border-2 border-red-200 bg-red-50 rounded-xl">
                            Failed to load challenges. Please try again later.
                        </div>
                    ) : (
                        personalChallenges?.map((challenge) => (
                            <div key={challenge.challenge_id} className="h-full">
                                <ChallengeCard challenge={{
                                    id: Number(challenge.challenge_id),
                                    title: challenge.title,
                                    description: challenge.description,
                                    status: challenge.status || "locked",
                                }} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
