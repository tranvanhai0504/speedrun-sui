"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProgressDemo() {
    const [progress, setProgress] = useState(15);
    const [level, setLevel] = useState(1);

    const addProgress = () => {
        setProgress((prev) => {
            if (prev >= 100) {
                setLevel((l) => l + 1);
                return 0;
            }
            return prev + 25;
        });
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <Card className="w-full max-w-md clay-card border-none bg-white/40 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Level {level} Builder</span>
                        <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">{progress}%</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="relative h-6 w-full bg-secondary/10 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-secondary transition-all duration-500 ease-out shadow-[2px_0_5px_rgba(0,0,0,0.2)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-16 rounded-xl flex items-center justify-center transition-all ${(progress / 25) >= i ? 'bg-primary text-white shadow-clay-btn' : 'bg-white/50 text-muted-foreground'
                                }`}>
                                {i}
                            </div>
                        ))}
                    </div>

                    <Button onClick={addProgress} className="w-full" size="lg" variant="clay">
                        Gain XP
                    </Button>
                </CardContent>
            </Card>
            <p className="mt-4 text-center text-sm text-muted-foreground">
                Click to simulate checking off tasks!
            </p>
        </div>
    );
}
