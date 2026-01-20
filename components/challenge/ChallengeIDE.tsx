"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Terminal, Maximize2, Minimize2, Minus } from "lucide-react";
import { motion, AnimatePresence, useDragControls, useMotionValue } from "framer-motion";

const WebIDE = dynamic(() => import("@/components/WebIDE/WebIDE"), { ssr: false });

interface ChallengeIDEProps {
    challengeId?: string;
}

export function ChallengeIDE({ challengeId }: ChallengeIDEProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const dragControls = useDragControls();
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);


    return (
        <>
            {/* Floating Toggle Button - Morphs into IDE */}
            <AnimatePresence mode="wait">
                {!isOpen && (
                    <motion.button
                        key="ide-button"
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full border-2 border-[#0F2854] bg-[#4988C4] text-white shadow-[4px_4px_0px_0px_#0F2854] hover:shadow-[6px_6px_0px_0px_#0F2854] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{
                            scale: 1.2,
                            opacity: 0,
                            transition: { duration: 0.15 }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Terminal className="h-5 w-5" />
                        <span className="text-sm">IDE</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Floating IDE Window - Morphs from button */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="ide-window"
                        drag={!isMaximized}
                        dragControls={dragControls}
                        dragListener={false}
                        dragMomentum={false}
                        dragElastic={0.1}

                        initial={{
                            opacity: 0,
                            scale: 0.1,
                            x: 0,
                            y: 0,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            y: 0,
                            transition: {
                                duration: 0.4,
                                ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
                                opacity: { duration: 0.2, delay: 0.1 }
                            }
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.1,
                            x: 0,
                            y: 0,
                            transition: {
                                duration: 0.25,
                                ease: [0.36, 0, 0.66, -0.56]
                            }
                        }}
                        style={{
                            transformOrigin: "bottom left",
                            x,
                            y
                        }}
                        className={`fixed z-60 bg-white rounded-xl border-4 border-[#0F2854] shadow-[8px_8px_0px_0px_#0F2854] flex flex-col ${isMaximized
                            ? "inset-4"
                            : "bottom-24 left-6 right-6 md:left-6 md:right-auto md:w-[90vw] h-[600px] 2xl:h-[800px]"
                            }`}
                    >
                        {/* Window Header */}
                        <motion.div
                            className="flex items-center justify-between px-4 py-3 border-b-2 border-[#0F2854] bg-[#0F2854] text-white rounded-t-lg cursor-move"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.2 } }}
                            onPointerDown={(e) => {
                                if (!isMaximized) {
                                    dragControls.start(e);
                                }
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <Terminal className="h-5 w-5" />
                                <h3 className="font-black text-lg">Web IDE</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setIsMaximized(!isMaximized);
                                        x.set(0);
                                        y.set(0);
                                    }}
                                    className="p-2 hover:bg-white/20 rounded transition-colors"
                                    title={isMaximized ? "Restore" : "Maximize"}
                                >
                                    {isMaximized ? (
                                        <Minimize2 className="h-5 w-5" />
                                    ) : (
                                        <Maximize2 className="h-5 w-5" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/20 rounded transition-colors"
                                    title="Close"
                                >
                                    <Minus className="h-5 w-5" />
                                </button>
                            </div>
                        </motion.div>

                        {/* IDE Content */}
                        <motion.div
                            className="flex-1 overflow-hidden rounded-b-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.2 } }}
                        >
                            <WebIDE challengeId={challengeId} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
