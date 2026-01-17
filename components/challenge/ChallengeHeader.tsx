"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ChallengeHeaderProps {
    challengeId: string;
    title: string;
    description: string;
}

export function ChallengeHeader({ challengeId, title, description }: ChallengeHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <Link href="/challenges" className="inline-flex items-center gap-1 font-bold text-[#0F2854] hover:underline">
                    <ArrowLeft className="h-4 w-4" /> All Challenges
                </Link>
                <span className="text-gray-400">/</span>
                <span className="font-black text-[#0F2854] uppercase">Challenge {challengeId}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#0F2854] mb-4">{title}</h1>
            <p className="text-xl text-[#0F2854]/80 font-medium border-l-4 border-[#0F2854] pl-4">
                {description}
            </p>
        </div>
    );
}
