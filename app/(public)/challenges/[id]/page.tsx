"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChallengeHeader } from "@/components/challenge/ChallengeHeader";
import { ChallengeInstructions } from "@/components/challenge/ChallengeInstructions";
import { ChallengeSubmission } from "@/components/challenge/ChallengeSubmission";
import { ChallengeNavigation } from "@/components/challenge/ChallengeNavigation";
import { ChallengeIDE } from "@/components/challenge/ChallengeIDE";
import { useChallenge, useChallenges } from "@/hooks/useApi";
import { useBuilderProfile } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";

export default function ChallengePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // Unwrap params - in client components we need to handle this differently
    const [id, setId] = React.useState<string>("");

    React.useEffect(() => {
        params.then(p => setId(p.id));
    }, [params]);

    const { data: challenge, isLoading: isLoadingChallenge, error: challengeError } = useChallenge(id);
    const { data: allChallenges, isLoading: isLoadingList } = useChallenges();
    const { user } = useAuth();
    const { data: profile } = useBuilderProfile(user?.address || "");

    if (!id) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2854]"></div>
            </div>
        );
    }

    if (isLoadingChallenge || isLoadingList) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F2854]"></div>
            </div>
        );
    }

    if (challengeError || !challenge) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-background flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-3xl font-black text-[#0F2854] mb-4">Challenge Not Found</h2>
                <p className="text-gray-600 mb-8 max-w-md">We couldn't load the challenge details. It might not exist or the API is unavailable.</p>
                <Link href="/challenges">
                    <Button>Back to Challenges</Button>
                </Link>
            </div>
        );
    }

    // Calculate challenge status and navigation
    const sortedChallenges = (allChallenges || [])
        .sort((a, b) => Number(a.challenge_id) - Number(b.challenge_id))
        .map((c, index, array) => {
            const completedChallenges = profile?.completed_challenges || [];
            const isCompleted = completedChallenges.includes(c.challenge_id);
            const isPreviousCompleted = index > 0 && completedChallenges.includes(array[index - 1].challenge_id);

            let status: "locked" | "open" | "completed" = "locked";
            if (isCompleted) {
                status = "completed";
            } else if (index === 0 || isPreviousCompleted) {
                status = "open";
            }

            return { ...c, status };
        });

    const currentIndex = sortedChallenges.findIndex(c => c.challenge_id === id);
    const previousChallenge = currentIndex > 0 ? sortedChallenges[currentIndex - 1] : null;
    const nextChallenge = currentIndex < sortedChallenges.length - 1 ? sortedChallenges[currentIndex + 1] : null;

    return (
        <div className="min-h-screen pt-32 pb-12 container mx-auto px-4 sm:px-6 lg:px-16">
            <div className="flex flex-col gap-8">
                <main className="flex-1 min-w-0">
                    <ChallengeHeader
                        challengeId={challenge.challenge_id}
                        title={challenge.title}
                        description={challenge.description}
                    />

                    <div className="space-y-12">
                        <ChallengeInstructions instructions={challenge.instructions || null} />

                        <ChallengeSubmission challengeId={id} />
                    </div>
                </main>

                <ChallengeNavigation
                    previousChallenge={previousChallenge}
                    nextChallenge={nextChallenge}
                />
            </div>

            {/* Floating IDE Window */}
            <ChallengeIDE />
        </div>
    );
}

// Import React for hooks
import React from "react";
