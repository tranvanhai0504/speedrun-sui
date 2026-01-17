"use client";

import { Play, TestTube, Rocket, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionToolbarProps {
    onCompile: () => void;
    onTest: () => void;
    onDeploy: () => void;
    onReset?: () => void;
    onSave: () => void;
    isLoading?: boolean;
    canDeploy?: boolean;
}

export default function ActionToolbar({ onCompile, onTest, onDeploy, onReset, onSave, isLoading, canDeploy = true }: ActionToolbarProps) {
    return (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#21242e] border-b border-[#2a2d39]">
            <Button
                size="sm"
                onClick={onSave}
                disabled={isLoading}
                className="gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white border-0 h-8 px-4 rounded-md font-medium text-xs shadow-sm"
            >
                <Save className="h-3.5 w-3.5" />
                Save
            </Button>
            <Button
                size="sm"
                onClick={onCompile}
                disabled={isLoading}
                className="gap-2 bg-[#0e639c] hover:bg-[#1177bb] text-white border-0 h-8 px-4 rounded-md font-medium text-xs shadow-sm"
            >
                <Play className="h-3.5 w-3.5" />
                Compile
            </Button>
            <Button
                size="sm"
                onClick={onTest}
                disabled={isLoading}
                className="gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white border-0 h-8 px-4 rounded-md font-medium text-xs shadow-sm"
            >
                <TestTube className="h-3.5 w-3.5" />
                Test
            </Button>
            <Button
                size="sm"
                onClick={onDeploy}
                disabled={isLoading || !canDeploy}
                className="gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white border-0 h-8 px-4 rounded-md font-medium text-xs shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title={!canDeploy ? "Compile code first before deploying" : "Deploy to Sui network"}
            >
                <Rocket className="h-3.5 w-3.5" />
                Deploy
            </Button>
            {onReset && (
                <Button
                    size="sm"
                    onClick={onReset}
                    disabled={isLoading}
                    className="gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white border-0 h-8 px-4 rounded-md font-medium text-xs shadow-sm ml-auto"
                    title="Reset to Template"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reset
                </Button>
            )}
        </div>
    );
}
