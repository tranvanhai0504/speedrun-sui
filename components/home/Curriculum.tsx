"use client";

import { ChallengeCard } from "@/components/ChallengeCard";
import { useChallenges } from "@/hooks/useApi";

export function Curriculum() {
    const { data: challenges, isLoading, error } = useChallenges();

    return (
        <section className="py-24 container mx-auto px-20">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-5xl font-black text-black mb-6">Curriculum</h2>
                <p className="text-xl font-medium text-gray-600 bg-white inline-block px-6 py-2 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    From "Hello World" to DeFi Wizard
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse border-2 border-gray-200"></div>
                    ))
                ) : error ? (
                    <div className="col-span-full text-center text-red-500 font-bold p-8 border-2 border-red-200 bg-red-50 rounded-xl">
                        Failed to load curriculum.
                    </div>
                ) : (
                    challenges?.map((challenge) => (
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
        </section>
    );
}
