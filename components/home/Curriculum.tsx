"use client";

import { ChallengeCard } from "@/components/ChallengeCard";
import { useBuilderProfile, useChallenges } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { motion } from "framer-motion";

export function Curriculum() {
    const currentAccount = useCurrentAccount();
    const { data: challenges, isLoading, error } = useChallenges();
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

    const itemVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <section className="py-24 container mx-auto px-4 md:px-20 relative overflow-hidden">

            <div className="text-center mb-24 max-w-3xl mx-auto relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl font-black text-[#0F2854] mb-6 tracking-tight"
                >
                    THE PATH
                </motion.h2>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-block relative"
                >
                    <p className="text-xl font-bold text-[#0F2854] bg-[#C3E2FF] border-4 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854] px-8 py-3 rounded-xl transform -rotate-1 relative z-10">
                        From "Hello World" to DeFi Wizard
                    </p>
                    <div className="absolute inset-0 bg-[#FFD966] border-4 border-[#0F2854] rounded-xl translate-x-1.5 translate-y-1.5 -z-0 rotate-1"></div>
                </motion.div>
            </div>

            <div className="relative max-w-6xl mx-auto">
                {/* Central Line */}
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute left-4 md:left-1/2 top-0 bg-[#0F2854] w-3 md:-translate-x-1/2 rounded-full hidden md:block"
                />
                <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute left-4 top-0 w-3 bg-[#0F2854] rounded-full md:hidden"
                />

                <div className="space-y-8 md:space-y-12 relative z-10 pb-12">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className={cn(
                                "relative flex items-center w-full",
                                "md:justify-between flex-col md:flex-row gap-8 md:gap-0 pl-12 md:pl-0"
                            )}>
                                {/* Spacer for alternating layout */}
                                <div className="w-full md:w-[45%] order-2 md:order-1 hidden md:block" />

                                {/* Center Node */}
                                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-gray-200 border-4 border-gray-300 md:-translate-x-1/2 z-20" />

                                {/* Card Placeholder */}
                                <div className="w-full md:w-[45%] order-1 md:order-1 h-64 bg-gray-100 rounded-xl animate-pulse border-2 border-gray-200" />
                            </div>
                        ))
                    ) : error ? (
                        <div className="text-center text-red-500 font-bold p-8 border-4 border-[#0F2854] bg-red-50 rounded-xl shadow-[4px_4px_0px_0px_#0F2854] w-full max-w-lg mx-auto relative z-20">
                            Failed to load curriculum.
                        </div>
                    ) : (
                        sortedChallenges?.map((challenge, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <motion.div
                                    key={challenge.challenge_id}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    variants={itemVariant}
                                    className={cn(
                                        "relative flex items-center w-full",
                                        "flex-col md:flex-row gap-8 md:gap-0 pl-12 md:pl-0"
                                    )}>
                                    {/* Desktop: Left side content for even, Empty for odd */}
                                    <div className={cn(
                                        "w-full md:w-[45%] hidden md:flex",
                                        isEven ? "justify-end order-1" : "order-3"
                                    )}>
                                        {isEven && (
                                            <motion.div
                                                initial={{ x: 10, opacity: 0 }}
                                                whileInView={{ x: 0, opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                className="w-full transform transition-transform hover:scale-105 duration-300"
                                            >
                                                <ChallengeCard challenge={{
                                                    id: Number(challenge.challenge_id),
                                                    title: challenge.title,
                                                    description: challenge.description,
                                                    status: challenge.status || "locked",
                                                    difficulty: challenge.difficulty,
                                                    xp_reward: challenge.xp_reward,
                                                    submission_count: challenge.submission_count,
                                                }} />
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Center Node & Connector */}
                                    <div className="absolute left-1.5 md:left-1/2 flex flex-col items-center justify-center md:-translate-x-1/2 z-20 order-2 h-full top-0 pointer-events-none">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                                            className="w-8 h-8 bg-[#FF7D7D] rounded-full border-4 border-[#0F2854] relative z-front shadow-[2px_2px_0px_0px_#0F2854]"
                                        >
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                                        </motion.div>
                                    </div>

                                    {/* Mobile Connector Line */}
                                    <div className="absolute left-[22px] top-8 w-8 h-1 bg-[#0F2854] md:hidden" />

                                    {/* Desktop Connector Line */}
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                                        className={cn(
                                            "absolute top-1/2 h-1 bg-[#0F2854] hidden md:block w-[5%] origin-left -z-10",
                                            isEven ? "left-[45%] origin-right" : "right-[45%]"
                                        )} />

                                    {/* Desktop: Right side content for odd, Empty for even */}
                                    <div className={cn(
                                        "w-full md:w-[45%] flex relative !z-30",
                                        !isEven ? "justify-start order-3 pl-28" : "order-1 hidden md:flex"
                                    )}>
                                        {!isEven && (
                                            <motion.div
                                                initial={{ x: -10, opacity: 0 }}
                                                whileInView={{ x: 0, opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                className="w-full transform transition-transform hover:scale-105 duration-300"
                                            >
                                                <ChallengeCard challenge={{
                                                    id: Number(challenge.challenge_id),
                                                    title: challenge.title,
                                                    description: challenge.description,
                                                    status: challenge.status || "locked",
                                                    difficulty: challenge.difficulty,
                                                    xp_reward: challenge.xp_reward,
                                                    submission_count: challenge.submission_count,
                                                }} />
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Mobile: Always show card */}
                                    <div className="w-full md:hidden order-3">
                                        <motion.div
                                            initial={{ x: 50, opacity: 0 }}
                                            whileInView={{ x: 0, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <ChallengeCard challenge={{
                                                id: Number(challenge.challenge_id),
                                                title: challenge.title,
                                                description: challenge.description,
                                                status: challenge.status || "locked",
                                                difficulty: challenge.difficulty,
                                                xp_reward: challenge.xp_reward,
                                                submission_count: challenge.submission_count,
                                            }} />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}
