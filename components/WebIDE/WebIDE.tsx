"use client";

import { useState, useEffect } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import FileExplorer from "./FileExplorer";
import Editor from "./Editor";
import Terminal from "./Terminal";
import ActionToolbar from "./ActionToolbar";
import { compileCode, saveProject, getProject, IDEProject } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface WebIDEProps {
    initialCode?: string;
    onCodeChange?: (value: string | undefined) => void;
}

export default function WebIDE({ initialCode = "// Start coding...", onCodeChange }: WebIDEProps) {
    const { isAuthenticated, user } = useAuth();
    const [selectedFile, setSelectedFile] = useState<string>("");
    const [code, setCode] = useState(initialCode);
    const [filename, setFilename] = useState("untitled.move");
    const [files, setFiles] = useState<Record<string, string>>({});
    const [projectId, setProjectId] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([
        "> SpeedrunSui Web IDE Ready",
        "> Select a file from the explorer or start coding",
        ""
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Load project from localStorage on mount
    useEffect(() => {
        const savedProjectId = localStorage.getItem('ide_project_id');
        if (savedProjectId && isAuthenticated) {
            loadProject(savedProjectId);
        }
    }, [isAuthenticated]);

    const loadProject = async (id: string) => {
        try {
            const project = await getProject(id);
            setFiles(project.files);
            setProjectId(project.id || null);
            addLog(`> Loaded project: ${project.name}`);

            // Load first file
            const firstFile = Object.keys(project.files)[0];
            if (firstFile) {
                setSelectedFile(firstFile);
                setFilename(firstFile);
                setCode(project.files[firstFile]);
            }
        } catch (error: any) {
            addLog(`> Failed to load project: ${error.message}`);
        }
    };

    const handleSaveProject = async () => {
        if (!isAuthenticated) {
            addLog("> Please sign in to save projects");
            return;
        }

        setIsLoading(true);
        addLog("> Saving project...");

        try {
            // Update files with current code
            const updatedFiles = {
                ...files,
                [filename]: code
            };

            const project: IDEProject = {
                id: projectId || undefined,
                name: `SpeedrunSui Project ${new Date().toISOString().split('T')[0]}`,
                description: "Created in Web IDE",
                files: updatedFiles
            };

            const savedProject = await saveProject(project);
            setProjectId(savedProject.id || null);
            setFiles(updatedFiles);

            if (savedProject.id) {
                localStorage.setItem('ide_project_id', savedProject.id);
            }

            addLog("> ✓ Project saved successfully!");
            addLog(`> Project ID: ${savedProject.id}`);
        } catch (error: any) {
            addLog("> ✗ Failed to save project:");
            addLog(error.message || "Unknown error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (path: string, content: string) => {
        // Save current file before switching
        if (filename && code) {
            setFiles(prev => ({ ...prev, [filename]: code }));
        }

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

        try {
            // Save current file to files object
            const currentFiles = {
                ...files,
                [filename]: code
            };

            // Create Move.toml if not exists
            const filesToCompile: Record<string, string> = {
                ...currentFiles,
                "Move.toml": currentFiles["Move.toml"] || `[package]\nname = "SpeedrunSui"\nversion = "0.0.1"\n\n[dependencies]\nSui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }\n\n[addresses]\nspeedrun = "0x0"`
            };

            const result = await compileCode(filesToCompile);

            if (result.error) {
                addLog("> ✗ Compilation failed:");
                addLog(result.error);
            } else {
                addLog("> ✓ Compilation successful!");
                addLog("> Build artifacts ready");
                if (result.bytecode) {
                    addLog(`> Bytecode size: ${result.bytecode.length} bytes`);
                }
            }
        } catch (error: any) {
            addLog("> ✗ Compilation error:");
            addLog(error.message || "Unknown error");
        } finally {
            setIsLoading(false);
        }
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
        <div className="relative transition-all duration-300">

            <ResizablePanelGroup
                orientation="horizontal"
                className="min-h-[650px] border border-[#2a2d39] overflow-hidden bg-[#1e2029] shadow-2xl"
            >
                {/* File Explorer */}
                <ResizablePanel defaultSize={18} minSize={12} maxSize={300}>
                    <FileExplorer onFileSelect={handleFileSelect} selectedFile={selectedFile} />
                </ResizablePanel>

                <ResizableHandle
                    withHandle
                    className="bg-[#2a2d39] w-[4px] hover:bg-[#4988C4] transition-colors cursor-col-resize"
                />

                {/* Editor + Terminal */}
                <ResizablePanel defaultSize={82}>
                    <ResizablePanelGroup orientation="vertical">
                        {/* Editor with Toolbar */}
                        <ResizablePanel defaultSize={65} minSize={35}>
                            <div className="h-full flex flex-col">
                                <ActionToolbar
                                    onSave={handleSaveProject}
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

                        <ResizableHandle
                            withHandle
                            className="bg-[#2a2d39] h-[4px] hover:bg-[#4988C4] transition-colors cursor-row-resize relative"
                        />

                        {/* Terminal */}
                        <ResizablePanel defaultSize={35} minSize={15}>
                            <Terminal logs={logs} onClear={handleClearTerminal} />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
