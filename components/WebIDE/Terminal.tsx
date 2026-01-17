import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { useTheme } from "next-themes";

interface TerminalProps {
    onMount?: (term: XTerm) => void;
}

export default function Terminal({ onMount }: TerminalProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new XTerm({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            theme: {
                background: "#0F2854",
                foreground: "#ffffff",
                cursor: "#ffffff",
                selectionBackground: "rgba(255, 255, 255, 0.3)",
            },
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        term.writeln("\x1b[1;32m> SpeedrunSui Web Terminal Initialized...\x1b[0m");
        term.writeln("  Type 'help' to see available commands.");
        term.write("\r\n$ ");

        if (onMount) {
            onMount(term);
        }

        const handleResize = () => {
            fitAddon.fit();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            term.dispose();
        };
    }, []);

    // Re-fit when container size might have changed (e.g. split pane resize)
    useEffect(() => {
        const observer = new ResizeObserver(() => {
            fitAddonRef.current?.fit();
        });

        if (terminalRef.current) {
            observer.observe(terminalRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="h-full w-full bg-[#0F2854] p-2 overflow-hidden" ref={terminalRef} />
    );
}
