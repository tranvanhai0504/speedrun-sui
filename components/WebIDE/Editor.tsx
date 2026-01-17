"use client";

import { cn } from "@/lib/utils";

interface EditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    filename?: string;
}

export default function Editor({ value, onChange, language = "move", filename = "untitled.move" }: EditorProps) {
    const lines = value.split('\n');

    return (
        <div className="h-full w-full flex flex-col bg-[#1e1e1e]">
            {/* Tab bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#252526] border-b border-[#0F2854]">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e1e1e] rounded-t text-sm text-white/90">
                    <span>{filename}</span>
                </div>
            </div>

            {/* Editor area with line numbers */}
            <div className="flex-1 flex overflow-hidden">
                {/* Line numbers */}
                <div className="bg-[#1e1e1e] px-3 py-4 border-r border-[#333] select-none">
                    {lines.map((_, i) => (
                        <div
                            key={i}
                            className="text-xs text-gray-500 font-mono text-right leading-6"
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>

                {/* Code area */}
                <div className="flex-1 overflow-auto">
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={cn(
                            "w-full h-full bg-transparent text-white font-mono text-sm leading-6",
                            "resize-none outline-none px-4 py-4",
                            "focus:outline-none focus:ring-0",
                            "placeholder:text-gray-500"
                        )}
                        placeholder="// Write your Sui Move code here..."
                        spellCheck={false}
                        style={{
                            lineHeight: '1.5rem', // Match line number height
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
