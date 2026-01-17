import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Terminal, CheckCircle2 } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { challenges, Challenge } from "@/lib/challenges";

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
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Challenges
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
                    {/* Left Column: Instructions */}
                    <div className="overflow-y-auto pr-4 border-r border-border/40">
                        <div className="prose dark:prose-invert max-w-none">
                            <ReactMarkdown>{challenge.instructions}</ReactMarkdown>
                        </div>

                        <div className="mt-8 p-4 bg-muted rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Terminal className="h-4 w-4" />
                                Helpful Tips
                            </h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                <li>Make sure you are on the Sui Testnet.</li>
                                <li>Check the console for deployment errors.</li>
                                <li>Use the Sui Explorer to verify your package ID.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Submission Panel */}
                    <div className="flex flex-col gap-6">
                        <Card className="p-6">
                            <h3 className="text-xl font-bold mb-4">Submit Challenge</h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Deploy your contract and paste the Package ID below. We will verify
                                that it meets the requirements.
                            </p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="packageId" className="text-sm font-medium">
                                        Package ID
                                    </label>
                                    <Input
                                        id="packageId"
                                        placeholder="0x..."
                                        className="font-mono"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="digest" className="text-sm font-medium">
                                        Transaction Digest (Optional)
                                    </label>
                                    <Input
                                        id="digest"
                                        placeholder="AbC..."
                                        className="font-mono"
                                    />
                                </div>

                                <Button className="w-full" size="lg">
                                    Submit & Verify
                                </Button>
                            </div>
                        </Card>

                        <Card className="flex-grow bg-black text-green-400 p-4 font-mono text-sm overflow-hidden flex flex-col">
                            <div className="flex items-center gap-2 border-b border-green-900 pb-2 mb-2">
                                <div className="h-3 w-3 rounded-full bg-red-500" />
                                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                                <span className="ml-2 text-xs text-green-700">CONSOLE</span>
                            </div>
                            <div className="space-y-1 opacity-80">
                                <p>{">"} Ready to verify...</p>
                                <p>{">"} Waiting for submission...</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
