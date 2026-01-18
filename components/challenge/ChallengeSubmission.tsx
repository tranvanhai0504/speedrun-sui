"use client";

import { useState } from "react";
import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVerifyChallenge } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { ChallengeSuccessDialog } from "@/components/dialogs/ChallengeSuccessDialog";
import { useRouter } from "next/navigation";

interface ChallengeSubmissionProps {
    challengeId: string;
}

export function ChallengeSubmission({ challengeId }: ChallengeSubmissionProps) {
    const { isAuthenticated, user } = useAuth();
    const verifyMutation = useVerifyChallenge();
    const router = useRouter();

    const [packageId, setPackageId] = useState("");
    const [digest, setDigest] = useState("");
    const [logs, setLogs] = useState<string[]>([
        "> Ready to verify...",
        "> Waiting for submission..."
    ]);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [earnedXP, setEarnedXP] = useState(0);

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

        addLog(`Submitting verification for Challenge ${challengeId}...`);
        addLog(`Package: ${packageId}`);

        try {
            const result = await verifyMutation.mutateAsync({
                user_address: user.address,
                package_id: packageId,
                tx_digest: digest,
                challenge_id: challengeId
            });

            addLog("Verification SUCCESS!");
            addLog(`Result: ${JSON.stringify(result)}`);

            // Assuming the API returns the XP earned or we can fetch it/use a default
            const xp = result?.xp_reward || 100; // Fallback or extract from result
            setEarnedXP(xp);
            setShowSuccessDialog(true);

        } catch (err: any) {
            addLog(`Verification FAILED: ${err.message || "Unknown error"}`);
        }
    };

    const handleNextChallenge = () => {
        const nextId = String(Number(challengeId) + 1);
        setShowSuccessDialog(false);
        router.push(`/challenges/${nextId}`);
    };

    return (
        <>
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

            <ChallengeSuccessDialog
                open={showSuccessDialog}
                onOpenChange={setShowSuccessDialog}
                xpEarned={earnedXP}
                onNextChallenge={handleNextChallenge}
            />
        </>
    );
}
