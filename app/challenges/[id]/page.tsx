import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Terminal, CheckCircle2, Lock, PlayCircle, Circle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { challenges, Challenge } from "@/lib/challenges";
import { cn } from "@/lib/utils";

// Correctly typing params for Next.js 15+ (asynchronous params)
export default async function ChallengePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const challengeId = parseInt(id);
    const challenge = challenges.find((c) => c.id === challengeId);

    if (!challenge) {
        notFound();
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
                                {challenges.map((c) => {
                                    const isActive = c.id === challengeId;
                                    const isLocked = c.status === "locked";
                                    return (
                                        <Link
                                            key={c.id}
                                            href={isLocked ? "#" : `/challenges/${c.id}`}
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
                                                <span className="font-mono opacity-80">#{c.id}</span>
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
                            <span className="font-black text-[#0F2854] uppercase">Challenge {challenge.id}</span>
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
                                <ReactMarkdown>{challenge.instructions}</ReactMarkdown>
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
                                            placeholder="AbC..."
                                            className="font-mono h-12 border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all bg-white"
                                        />
                                    </div>

                                    <Button size="lg" className="w-full h-14 text-lg border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854] bg-[#4988C4] hover:bg-[#1C4D8D] text-white">
                                        Submit & Verify
                                    </Button>
                                </div>

                                {/* Console Output */}
                                <div className="bg-[#0F2854] rounded-xl p-4 font-mono text-sm text-green-400 border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854] flex flex-col min-h-[200px]">
                                    <div className="flex items-center gap-2 border-b border-white/20 pb-2 mb-2">
                                        <div className="h-3 w-3 rounded-full bg-red-500" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                        <div className="h-3 w-3 rounded-full bg-green-500" />
                                        <span className="ml-2 text-xs text-white/50">CONSOLE</span>
                                    </div>
                                    <div className="space-y-1 opacity-80 flex-grow font-medium">
                                        <p>{">"} Ready to verify...</p>
                                        <p>{">"} Waiting for submission...</p>
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
