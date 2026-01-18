"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Zap, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface ChallengeSuccessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    xpEarned: number;
    onNextChallenge: () => void;
}

export function ChallengeSuccessDialog({ open, onOpenChange, xpEarned, onNextChallenge }: ChallengeSuccessDialogProps) {

    useEffect(() => {
        if (open) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-white border-4 border-[#0F2854] shadow-[8px_8px_0px_0px_#0F2854] p-0 overflow-hidden sm:rounded-2xl">
                <div className="bg-[#E0F2FE] p-8 text-center border-b-4 border-[#0F2854] relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10 pointer-events-none" />

                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                className="w-24 h-24 bg-[#FFD966] rounded-full border-4 border-[#0F2854] flex items-center justify-center mx-auto mb-4 relative z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <ThumbsUp size={48} className="text-[#0F2854] fill-current" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <DialogTitle className="text-3xl font-black text-[#0F2854] uppercase tracking-tight mb-2 relative z-10">
                        Mission Complete!
                    </DialogTitle>
                    <p className="text-[#0F2854] font-bold opacity-80 relative z-10">
                        Verification Successful
                    </p>
                </div>

                <div className="p-8">
                    {/* XP Reward Card */}
                    <div className="bg-[#F0FDF4] border-2 border-[#0F2854] rounded-xl p-4 flex items-center justify-between mb-8 shadow-[4px_4px_0px_0px_#0F2854]">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-lg border-2 border-[#0F2854]">
                                <Zap className="text-green-600 fill-current" size={24} />
                            </div>
                            <div>
                                <div className="text-xs font-black uppercase text-green-800 tracking-wider">Reward Earned</div>
                                <div className="text-2xl font-black text-[#0F2854]">{xpEarned} XP</div>
                            </div>
                        </div>
                        <div className="bg-green-100 text-green-800 text-xs font-black px-2 py-1 rounded border-2 border-green-200">
                            VERIFIED
                        </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto border-2 border-[#0F2854] font-bold hover:bg-gray-100 h-12"
                        >
                            <X className="mr-2 h-4 w-4" /> Close
                        </Button>
                        <Button
                            onClick={onNextChallenge}
                            className="w-full sm:w-auto bg-[#0F2854] text-white hover:bg-[#1C4D8D] font-bold border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#4988C4] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all h-12"
                        >
                            Next Challenge <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
