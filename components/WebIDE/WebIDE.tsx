"use client";

import { useState } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import FileExplorer from "./FileExplorer";
import Editor from "./Editor";
import Terminal from "./Terminal";
import ActionToolbar from "./ActionToolbar";

interface WebIDEProps {
    initialCode?: string;
    onCodeChange?: (value: string | undefined) => void;
}

export default function WebIDE({ initialCode = "// Start coding...", onCodeChange }: WebIDEProps) {
    const [selectedFile, setSelectedFile] = useState<string>("");
    const [code, setCode] = useState(initialCode);
    const [filename, setFilename] = useState("untitled.move");
    const [logs, setLogs] = useState<string[]>([
        "> SpeedrunSui Web IDE Ready",
        "> Select a file from the explorer or start coding",
        ""
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSelect = (path: string, content: string) => {
        setSelectedFile(path);
        setCode(content);
        setFilename(path.split('/').pop() || 'untitled.move');
        addLog(`> Opened ${path}`);
    };

    const handleCodeChange = (value: string | undefined) => {
        setCode(value || "");
        if (onCodeChange) {
            onCodeChange(value);
        }
    };

    const addLog = (message: string) => {
        setLogs(prev => [...prev, message]);
    };

    const handleCompile = async () => {
        setIsLoading(true);
        addLog(`> Compiling ${filename}...`);

        // Simulate compilation
        setTimeout(() => {
            addLog("> ✓ Compilation successful!");
            addLog("> Build artifacts saved to build/");
            setIsLoading(false);
        }, 1500);
    };

    const handleTest = async () => {
        setIsLoading(true);
        addLog(`> Running tests for ${filename}...`);

        // Simulate testing
        setTimeout(() => {
            addLog("> ✓ All tests passed!");
            addLog("> Test summary: 5 passed, 0 failed");
            setIsLoading(false);
        }, 2000);
    };

    const handleDeploy = async () => {
        setIsLoading(true);
        addLog(`> Deploying ${filename} to Sui network...`);

        // Simulate deployment
        setTimeout(() => {
            addLog("> ✓ Deployment successful!");
            addLog("> Package ID: 0x1234...abcd");
            setIsLoading(false);
        }, 2500);
    };

    const handleClearTerminal = () => {
        setLogs(["> Terminal cleared", ""]);
    };

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[600px] border-2 border-[#0F2854] rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#0F2854]"
        >
            {/* File Explorer */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <FileExplorer onFileSelect={handleFileSelect} selectedFile={selectedFile} />
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-[#0F2854] w-1" />

            {/* Editor + Terminal */}
            <ResizablePanel defaultSize={80}>
                <ResizablePanelGroup direction="vertical">
                    {/* Editor with Toolbar */}
                    <ResizablePanel defaultSize={70} minSize={40}>
                        <div className="h-full flex flex-col">
                            <ActionToolbar
                                onCompile={handleCompile}
                                onTest={handleTest}
                                onDeploy={handleDeploy}
                                isLoading={isLoading}
                            />
                            <div className="flex-1 overflow-hidden">
                                <Editor
                                    value={code}
                                    onChange={handleCodeChange}
                                    filename={filename}
                                />
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle className="bg-[#0F2854] h-1" />

                    {/* Terminal */}
                    <ResizablePanel defaultSize={30} minSize={15}>
                        <Terminal logs={logs} onClear={handleClearTerminal} />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
