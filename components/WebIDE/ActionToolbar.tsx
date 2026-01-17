"use client";

import { Play, TestTube, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionToolbarProps {
    onCompile: () => void;
    onTest: () => void;
    onDeploy: () => void;
    isLoading?: boolean;
}

export default function ActionToolbar({ onCompile, onTest, onDeploy, isLoading }: ActionToolbarProps) {
    return (
        <div className="flex items-center gap-2 p-3 bg-[#252526] border-b border-[#0F2854]">
            <Button
                size="sm"
                onClick={onCompile}
                disabled={isLoading}
                className="gap-2 bg-[#4988C4] hover:bg-[#1C4D8D] text-white border-2 border-[#0F2854]"
            >
                <Play className="h-4 w-4" />
                Compile
            </Button>
            <Button
                size="sm"
                onClick={onTest}
                disabled={isLoading}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white border-2 border-[#0F2854]"
            >
                <TestTube className="h-4 w-4" />
                Test
            </Button>
            <Button
                size="sm"
                onClick={onDeploy}
                disabled={isLoading}
                className="gap-2 bg-orange-600 hover:bg-orange-700 text-white border-2 border-[#0F2854]"
            >
                <Rocket className="h-4 w-4" />
                Deploy
            </Button>
        </div>
    );
}
