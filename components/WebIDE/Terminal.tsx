"use client";

import { Trash2, X } from "lucide-react";

interface TerminalProps {
    logs: string[];
    onClear?: () => void;
}

export default function Terminal({ logs, onClear }: TerminalProps) {
    return (
        <div className="h-full w-full bg-[#1a1d29] flex flex-col border-t border-[#2a2d39]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#21242e] border-b border-[#2a2d39]">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                        <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                        <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="text-xs text-[#9ca3af] font-mono uppercase tracking-wider">Terminal</span>
                </div>
                {onClear && (
                    <button
                        onClick={onClear}
                        className="p-1.5 hover:bg-[#2a2d39] rounded transition-colors"
                        title="Clear terminal"
                    >
                        <X className="h-3.5 w-3.5 text-[#6b7280]" />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="font-mono text-sm whitespace-pre-wrap break-all space-y-1">
                    {logs.map((log, i) => (
                        <div
                            key={i}
                            className={cn(
                                log.toLowerCase().includes('error') ? 'text-[#f87171]' :
                                    log.toLowerCase().includes('success') || log.includes('✓') ? 'text-[#4ade80]' :
                                        log.startsWith('>') ? 'text-[#60a5fa]' :
                                            'text-[#9ca3af]'
                            )}
                        >
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
