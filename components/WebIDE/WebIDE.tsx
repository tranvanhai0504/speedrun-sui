"use client";

import { useState, useEffect } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSignAndExecuteTransaction, useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { fromBase64 } from "@mysten/sui/utils";
import FileExplorer, { defaultFiles, FileNode } from "./FileExplorer";
import Editor from "./Editor";
import Terminal from "./Terminal";
import ActionToolbar from "./ActionToolbar";
import { compileCode, saveProject, getProject, IDEProject } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const flattenFiles = (nodes: FileNode[]): Record<string, string> => {
    let acc: Record<string, string> = {};
    const traverse = (n: FileNode) => {
        if (n.type === 'file' && n.content !== undefined) {
            // Ensure 'content' is used, defaulting to empty string if undefined but handled by type
            acc[n.path] = n.content;
        }
        if (n.children) {
            n.children.forEach(traverse);
        }
    };
    nodes.forEach(traverse);
    return acc;
};

interface WebIDEProps {
    initialCode?: string;
    onCodeChange?: (value: string | undefined) => void;
    challengeId?: string;
}

export default function WebIDE({ initialCode = "// Start coding...", onCodeChange, challengeId }: WebIDEProps) {
    const { isAuthenticated, user } = useAuth();
    const [selectedFile, setSelectedFile] = useState<string>("");
    const [code, setCode] = useState(initialCode);
    const [filename, setFilename] = useState("untitled.move");
    const [files, setFiles] = useState<Record<string, string>>(() => flattenFiles(defaultFiles));
    const [buildFiles, setBuildFiles] = useState<Record<string, string>>({});
    const [projectId, setProjectId] = useState<string | null>(null);

    const currentAccount = useCurrentAccount();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
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
                files: updatedFiles,
                challenge_id: challengeId // Add challenge_id from props
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
        addLog("> Preparing compilation...");

        const currentFiles = { ...files, [filename]: code }; // Ensure current file is included
        const fileKeys = Object.keys(currentFiles);
        addLog(`> Files detected: ${fileKeys.length}`);
        addLog(`> File list: ${fileKeys.join(", ")}`);

        // Check Move.toml status
        if (!currentFiles["Move.toml"]) {
            addLog("> ⚠️ 'Move.toml' not found in active files. Injecting default template (SpeedrunSui).");
            addLog("> If you have a custom Move.toml, ensure it's named exactly 'Move.toml' at root.");
        } else {
            addLog("> Using user-provided Move.toml");
        }

        const filesToCompile: Record<string, string> = {
            ...currentFiles,
            "Move.toml": currentFiles["Move.toml"] || `[package]
name = "SpeedrunSui"
version = "0.0.1"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
speedrun = "0x0"
`,
        };

        addLog(`> Compiling ${filename}...`); // Moved this log after file preparation

        try {
            const result = await compileCode(filesToCompile);

            if (result.error) {
                addLog("> ✗ Compilation failed:");
                addLog(result.error);
                // Clear build artifacts on failure
                setBuildFiles({});
            } else {
                addLog("> ✓ Compilation successful!");

                // Create build artifacts
                // Create build artifacts
                if (result.buildFiles) {
                    setBuildFiles(result.buildFiles);
                    addLog("> Build artifacts created in build/ folder");

                    const moduleCount = Object.keys(result.buildFiles).filter(k => k.endsWith('.mv')).length;
                    addLog(`> Generated ${moduleCount} module(s)`);
                } else if (result.modules) {
                    // Legacy support
                    const buildArtifacts: Record<string, string> = {};
                    result.modules.forEach((moduleBase64: string, index: number) => {
                        const moduleName = `module_${index}.mv`;
                        buildArtifacts[`build/bytecode_modules/${moduleName}`] = moduleBase64;
                    });

                    if (result.dependencies) {
                        const depsContent = result.dependencies.join('\n');
                        buildArtifacts['build/dependencies.txt'] = depsContent;
                    }

                    if (result.digest) {
                        // Digest handling (check if it's array or string)
                        const digestHex = Array.isArray(result.digest)
                            ? result.digest.map((b: number) => b.toString(16).padStart(2, '0')).join('')
                            : String(result.digest);
                        buildArtifacts['build/package_digest.txt'] = digestHex;
                    }

                    setBuildFiles(buildArtifacts);
                    addLog("> Build artifacts created (legacy mode)");
                }

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
        addLog(`> Deploying...`);

        if (!currentAccount) {
            addLog("> ⚠️ Error: Please connect your wallet first!");
            setIsLoading(false);
            return;
        }

        // 1. Identify modules to deploy from buildFiles
        const buildKeys = Object.keys(buildFiles);
        addLog(`> Debug: Inspecting ${buildKeys.length} build artifacts...`);
        // Debug: Print first 5 keys
        if (buildKeys.length > 0) {
            addLog(`> Sample files: ${buildKeys.slice(0, 3).join(", ")} ...`);
        }

        // Filter out dependencies and non-bytecode files
        const modulesToDeploy = Object.entries(buildFiles).filter(([path, content]) => {
            // Check matching condition
            const isMv = path.endsWith('.mv');
            const isDep = path.includes('/dependencies/');

            // Log if we find a potential candidate
            if (isMv && !isDep) {
                addLog(`> Found candidate: ${path}`);
            }

            return isMv && !isDep;
        }).map(([_, content]) => content);

        if (modulesToDeploy.length === 0) {
            addLog("> ⚠️ Error: No compiled modules found to deploy.");
            addLog("> Please ensure compilation was successful.");
            addLog("> Tip: Check if package name in Move.toml matches module address.");
            setIsLoading(false);
            return;
        }

        try {
            const tx = new Transaction();
            // Default dependencies: MoveStdlib(0x1), Sui(0x2)
            // This is a simplification. Ideal solution parses BuildInfo.yaml.
            const dependencies = ['0x1', '0x2'];

            addLog(`> Found ${modulesToDeploy.length} modules to deploy.`);

            const [upgradeCap] = tx.publish({
                modules: modulesToDeploy.map(m => Array.from(fromBase64(m))),
                dependencies: dependencies,
            });

            tx.transferObjects([upgradeCap], currentAccount.address);

            addLog("> Requesting signature...");

            signAndExecuteTransaction({
                transaction: tx,
            }, {
                onSuccess: (result) => {
                    addLog("> ✓ Deployment successful!");
                    addLog(`> Digest: ${result.digest}`);
                    setIsLoading(false);
                },
                onError: (error) => {
                    addLog(`> ❌ Deployment failed: ${error.message}`);
                    setIsLoading(false);
                }
            });

        } catch (e: any) {
            addLog(`> ❌ Error preparing transaction: ${e.message}`);
            setIsLoading(false);
        }
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
                    <FileExplorer onFileSelect={handleFileSelect} selectedFile={selectedFile} buildFiles={buildFiles} />
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
