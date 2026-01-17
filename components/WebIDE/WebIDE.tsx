"use client";

import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import FileExplorer from "./FileExplorer";
import Editor from "./Editor";
import Terminal from "./Terminal";
import ActionToolbar from "./ActionToolbar";
import { compileCode, runTest } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useIde } from "./IdeContext";
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { toast } from "sonner";

export default function WebIDE() {
    const { isAuthenticated, user } = useAuth();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();
    const {
        files,
        activeFile,
        updateFileContent,
        save,
        isSaving,
        resetToTemplate
    } = useIde();

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [logs, setLogs] = useState<string[]>([
        "> SpeedrunSui Web IDE Ready",
        "> Select a file from the explorer or start coding",
        ""
    ]);
    const [isCompiling, setIsCompiling] = useState(false);
    const [hasCompiledSuccessfully, setHasCompiledSuccessfully] = useState(false);

    const activeContent = activeFile ? (files[activeFile] || "") : "";
    const activeFilename = activeFile ? activeFile.split('/').pop() : "No file selected";

    const addLog = (message: string) => {
        setLogs(prev => [...prev, message]);
    };

    const handleCompile = async () => {
        setIsCompiling(true);
        setHasCompiledSuccessfully(false);
        addLog(`> Compiling...`);

        try {
            const result = await compileCode(files);

            if (result.error) {
                addLog("> ✗ Compilation failed:");
                addLog(result.error);
                setHasCompiledSuccessfully(false);
            } else {
                addLog("> ✓ Compilation successful!");
                if (result.bytecode) {
                    addLog(`> Bytecode size: ${result.bytecode.length} bytes`);
                }
                setHasCompiledSuccessfully(true);
            }
        } catch (error: unknown) {
            addLog("> ✗ Compilation error:");
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            addLog(errorMessage);
            setHasCompiledSuccessfully(false);
        } finally {
            setIsCompiling(false);
        }
    };

    const handleTest = async () => {
        setIsCompiling(true);
        addLog(`> Running tests...`);

        try {
            const result = await runTest(files);

            if (result.error) {
                addLog("> ✗ Tests failed to run:");
                addLog(result.error);
            } else {
                addLog("> Test Output:");
                // Split output by newlines and add each line
                result.output.split('\n').forEach((line: string) => addLog(line));
                if (result.output.includes("FAIL")) {
                    addLog("> ✗ Some tests failed.");
                } else {
                    addLog("> ✓ Tests completed.");
                }
            }
        } catch (error: unknown) {
            addLog("> ✗ Test error:");
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            addLog(errorMessage);
        } finally {
            setIsCompiling(false);
        }
    };

    const handleDeploy = async () => {
        if (!isAuthenticated) {
            addLog("> ⚠ Please sign in to deploy.");
            return;
        }

        setIsCompiling(true);
        addLog(`> Compiling for deployment...`);

        try {
            // 1. Compile
            const result = await compileCode(files);

            if (result.error) {
                throw new Error(result.error);
            }

            if (!result.data || !result.data.modules || !result.data.dependencies) {
                throw new Error("Invalid compilation result: missing modules or dependencies");
            }

            const { modules, dependencies } = result.data;
            addLog("> ✓ Compiled successfully. Requesting signature...");

            // 2. Convert Base64 modules to byte arrays
            const modulesAsBytes = modules.map((base64Module: string) => {
                const binaryString = atob(base64Module);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                return Array.from(bytes);
            });

            // 3. Construct Transaction
            const tx = new Transaction();
            const [upgradeCap] = tx.publish({
                modules: modulesAsBytes,
                dependencies: dependencies,
            });

            // Transfer UpgradeCap to sender
            tx.transferObjects([upgradeCap], tx.pure.address(user?.address || ""));

            // 4. Sign & Execute
            signAndExecute(
                { transaction: tx },
                {
                    onSuccess: (result: any) => {
                        addLog("> ✓ Deployment successful!");
                        const digest = result.digest;
                        addLog(`> Digest: ${digest}`);
                        addLog(`> Explorer: https://testnet.suivision.xyz/txblock/${digest}`);

                        // Extract Package ID
                        const effects = result.effects;
                        if (effects?.created) {
                            const packageObj = effects.created.find((obj: any) =>
                                obj.owner === 'Immutable'
                            );
                            if (packageObj) {
                                const packageId = packageObj.reference?.objectId || packageObj.objectId;
                                if (packageId) {
                                    addLog(`> Package ID: ${packageId}`);
                                    addLog(`> You can now call functions like:`);
                                    addLog(`> ${packageId}::your_module::your_function`);
                                }
                            }
                        }

                        toast.success("Deployed successfully!");
                    },
                    onError: (error: any) => {
                        addLog(`> ✗ Deployment failed: ${error.message}`);
                        toast.error("Deployment failed");
                    }
                }
            );

        } catch (error: unknown) {
            addLog("> ✗ Deployment error:");
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            addLog(errorMessage);
        } finally {
            setIsCompiling(false);
        }
    };

    const handleClearTerminal = () => {
        setLogs(["> Terminal cleared", ""]);
    };

    return (
        <div className={`${isFullscreen
            ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96vw] h-[92vh] z-50 bg-[#1e2029] p-4 rounded-xl border-2 border-[#4988C4] shadow-2xl'
            : 'relative h-full'
            } transition-all duration-300 flex flex-col`}>

            {/* Fullscreen Toggle Button */}
            <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="absolute top-4 right-4 z-10 p-2 bg-[#2a2d39] hover:bg-[#3a3d49] rounded-lg border border-[#4988C4] transition-colors shadow-lg"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
                {isFullscreen ? (
                    <Minimize2 className="h-4 w-4 text-[#4988C4]" />
                ) : (
                    <Maximize2 className="h-4 w-4 text-[#4988C4]" />
                )}
            </button>

            <ResizablePanelGroup
                orientation="horizontal"
                className="flex-1 border border-[#2a2d39] overflow-hidden bg-[#1e2029] shadow-2xl rounded-lg"
            >
                {/* File Explorer */}
                <ResizablePanel defaultSize={20} minSize={12} maxSize={350}>
                    <FileExplorer />
                </ResizablePanel>

                <ResizableHandle
                    withHandle
                    className="bg-[#2a2d39] w-[4px] hover:bg-[#4988C4] transition-colors cursor-col-resize"
                />

                {/* Editor + Terminal */}
                <ResizablePanel defaultSize={80}>
                    <ResizablePanelGroup orientation="vertical">
                        {/* Editor with Toolbar */}
                        <ResizablePanel defaultSize={70} minSize={30}>
                            <div className="h-full flex flex-col">
                                <ActionToolbar
                                    onSave={save}
                                    onCompile={handleCompile}
                                    onTest={handleTest}
                                    onDeploy={handleDeploy}
                                    onReset={resetToTemplate}
                                    isLoading={isSaving || isCompiling}
                                    canDeploy={hasCompiledSuccessfully}
                                />
                                <div className="flex-1 overflow-hidden">
                                    {activeFile ? (
                                        <Editor
                                            value={activeContent}
                                            onChange={(val) => updateFileContent(activeFile, val || "")}
                                            filename={activeFilename || "untitled"}
                                        />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-[#6b7280]">
                                            Select a file to start coding
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ResizablePanel>

                        <ResizableHandle
                            withHandle
                            className="bg-[#2a2d39] h-[4px] hover:bg-[#4988C4] transition-colors cursor-row-resize relative"
                        />

                        {/* Terminal */}
                        <ResizablePanel defaultSize={30} minSize={10}>
                            <Terminal logs={logs} onClear={handleClearTerminal} />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
