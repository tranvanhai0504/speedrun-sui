"use client";

import { Trash2 } from "lucide-react";

interface TerminalProps {
    logs: string[];
    onClear?: () => void;
}

export default function Terminal({ logs, onClear }: TerminalProps) {
    return (
        <div className="h-full w-full bg-[#0F2854] flex flex-col">
            <div className="flex items-center justify-between gap-2 border-b border-white/20 px-4 py-2">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-white/50 font-mono uppercase">Terminal</span>
                </div>
                {onClear && (
                    <button
                        onClick={onClear}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Clear terminal"
                    >
                        <Trash2 className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="font-mono text-sm text-green-400 whitespace-pre-wrap break-all">
                    {logs.map((log, i) => (
                        <div key={i} className={log.toLowerCase().includes('error') ? 'text-red-400' : ''}>
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
