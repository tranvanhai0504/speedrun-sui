"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Terminal, CheckCircle2, Lock, PlayCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBuilderProfile, useChallenge, useChallenges, useVerifyChallenge } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface ChallengeDetailViewProps {
    id: string;
}

export default function ChallengeDetailView({ id }: ChallengeDetailViewProps) {
    const { data: challenge, isLoading: isLoadingChallenge, error: challengeError } = useChallenge(id);
    const { data: challenges, isLoading: isLoadingList } = useChallenges();
    const { isAuthenticated, user } = useAuth();
    const { data: profile } = useBuilderProfile(user?.address || "");
    const verifyMutation = useVerifyChallenge();

    const allChallenges = challenges?.map((c, index) => {
        const completedChallenges = profile?.completed_challenges || [];
        const isCompleted = completedChallenges.includes(c.challenge_id);
        const isPreviousCompleted = index > 0 && completedChallenges.includes(challenges[index - 1].challenge_id);

        let status: "locked" | "open" | "completed" = "locked";

        if (isCompleted) {
            status = "completed" as const;
        } else if (index === 0 || isPreviousCompleted) {
            status = "open" as const;
        }

        return {
            ...c,
            status
        };
    }) || [];

    const [packageId, setPackageId] = useState("");
    const [digest, setDigest] = useState("");
    const [logs, setLogs] = useState<string[]>([
        "> Ready to verify...",
        "> Waiting for submission..."
    ]);

    const addLog = (msg: string) => setLogs(prev => [...prev, `> ${msg}`]);

    const handleVerify = async () => {
        if (!isAuthenticated || !user) {
            addLog("Error: Please connect wallet and sign in first.");
            return;
        }
        if (!packageId) {
            addLog("Error: Package ID is required.");
            return;
        }

        addLog(`Submitting verification for Challenge ${id}...`);
        addLog(`Package: ${packageId}`);

        try {
            const result = await verifyMutation.mutateAsync({
                user_address: user.address,
                package_id: packageId,
                tx_digest: digest,
                challenge_id: id
            });

            addLog("Verification SUCCESS!");
            addLog(`Result: ${JSON.stringify(result)}`);
        } catch (err: any) {
            addLog(`Verification FAILED: ${err.message || "Unknown error"}`);
        }
    };

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
                <h2 className="text-3xl font-black text-[#0F2854] mb-4">Challenge Not Found / API Error</h2>
                <p className="text-gray-600 mb-8 max-w-md">We couldn't load the challenge details. It might not exist or the API is unavailable.</p>
                <Link href="/challenges">
                    <Button>Back to Challenges</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-12 container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Sidebar: Challenge Navigation */}
                <aside className="w-full lg:w-80 flex-shrink-0">
                    <div className="sticky top-32 space-y-4">
                        <div className="p-4 bg-white rounded-xl border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854]">
                            <h3 className="font-black text-xl mb-4 text-[#0F2854] uppercase tracking-tight">Challenges</h3>
                            <nav className="space-y-2">
                                {allChallenges?.map((c) => {
                                    const isActive = c.challenge_id === id;
                                    const isLocked = c.status === "locked";
                                    return (
                                        <Link
                                            key={c.challenge_id}
                                            href={isLocked ? "#" : `/challenges/${c.challenge_id}`}
                                            className={cn(
                                                "block w-full text-left px-4 py-3 rounded-lg border-2 transition-all font-bold text-sm",
                                                isActive
                                                    ? "bg-[#0F2854] text-white border-[#0F2854] shadow-[2px_2px_0px_0px_#4988C4] translate-x-[2px] translate-y-[2px]"
                                                    : isLocked
                                                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                                        : "bg-white text-[#0F2854] border-[#0F2854] hover:bg-secondary/20 hover:shadow-[2px_2px_0px_0px_#0F2854] hover:-translate-y-0.5"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono opacity-80">#{c.challenge_id}</span>
                                                <span className="truncate">{c.title}</span>
                                                {isLocked && <Lock className="ml-auto h-3 w-3" />}
                                                {c.status === "completed" && <CheckCircle2 className="ml-auto h-3 w-3 text-green-500" />}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </aside>

                {/* Main Content: Instructions & Submission */}
                <main className="flex-1 min-w-0">
                    {/* Challenge Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Link href="/challenges" className="inline-flex items-center gap-1 font-bold text-[#0F2854] hover:underline">
                                <ArrowLeft className="h-4 w-4" /> All Challenges
                            </Link>
                            <span className="text-gray-400">/</span>
                            <span className="font-black text-[#0F2854] uppercase">Challenge {challenge.challenge_id}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#0F2854] mb-4">{challenge.title}</h1>
                        <p className="text-xl text-[#0F2854]/80 font-medium border-l-4 border-[#0F2854] pl-4">
                            {challenge.description}
                        </p>
                    </div>

                    {/* Content & Submission Stack */}
                    <div className="space-y-12">
                        {/* Markdown Instructions */}
                        <div className="bg-white p-8 md:p-12 rounded-[2rem] border-2 border-[#0F2854] shadow-[8px_8px_0px_0px_#0F2854]">
                            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:text-[#0F2854] prose-p:text-[#0F2854]/90 prose-pre:border-2 prose-pre:border-[#0F2854] prose-pre:shadow-[4px_4px_0px_0px_#0F2854]">
                                {challenge.instructions ? (
                                    <ReactMarkdown>{challenge.instructions}</ReactMarkdown>
                                ) : (
                                    <p className="italic text-gray-500">No instructions provided for this challenge yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Submission Section */}
                        <div className="bg-[#4988C4]/10 p-8 rounded-[2rem] border-2 border-[#0F2854] shadow-[8px_8px_0px_0px_#0F2854]">
                            <h3 className="text-2xl font-black mb-6 text-[#0F2854] flex items-center gap-2">
                                <Terminal className="h-6 w-6" /> Submit Your Work
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="packageId" className="text-sm font-bold text-[#0F2854] uppercase tracking-wider">
                                            Package ID
                                        </label>
                                        <Input
                                            id="packageId"
                                            value={packageId}
                                            onChange={(e) => setPackageId(e.target.value)}
                                            placeholder="0x..."
                                            className="font-mono h-12 border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all bg-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="digest" className="text-sm font-bold text-[#0F2854] uppercase tracking-wider">
                                            Transaction Digest (Optional)
                                        </label>
                                        <Input
                                            id="digest"
                                            value={digest}
                                            onChange={(e) => setDigest(e.target.value)}
                                            placeholder="AbC..."
                                            className="font-mono h-12 border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all bg-white"
                                        />
                                    </div>

                                    <Button
                                        size="lg"
                                        onClick={handleVerify}
                                        disabled={verifyMutation.isPending}
                                        className="w-full h-14 text-lg border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854] bg-[#4988C4] hover:bg-[#1C4D8D] text-white"
                                    >
                                        {verifyMutation.isPending ? "Verifying..." : "Submit & Verify"}
                                    </Button>
                                </div>

                                {/* Console Output */}
                                <div className="bg-[#0F2854] rounded-xl p-4 font-mono text-sm text-green-400 border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854] flex flex-col min-h-[200px] max-h-[300px] overflow-y-auto">
                                    <div className="flex items-center gap-2 border-b border-white/20 pb-2 mb-2 sticky top-0 bg-[#0F2854]">
                                        <div className="h-3 w-3 rounded-full bg-red-500" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                        <div className="h-3 w-3 rounded-full bg-green-500" />
                                        <span className="ml-2 text-xs text-white/50">CONSOLE</span>
                                    </div>
                                    <div className="space-y-1 opacity-80 flex-grow font-medium whitespace-pre-wrap break-all">
                                        {logs.map((log, i) => (
                                            <p key={i}>{log}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
