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
        <div className="flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white rounded-xl overflow-hidden">
                <CardHeader className="bg-primary border-b-2 border-black">
                    <CardTitle className="flex justify-between items-center text-black">
                        <span className="font-black text-xl uppercase">Level {level} Builder</span>
                        <span className="text-sm bg-black text-white px-3 py-1 rounded-md font-bold font-mono">{progress}%</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="relative h-8 w-full bg-white border-2 border-black rounded-full overflow-hidden">
                        <div
                            className="h-full bg-secondary border-r-2 border-black transition-all duration-300 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-16 rounded-lg border-2 border-black flex items-center justify-center font-bold text-lg transition-all ${(progress / 25) >= i
                                    ? 'bg-accent text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[1px] translate-y-[1px]'
                                    : 'bg-gray-100 text-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                }`}>
                                {i}
                            </div>
                        ))}
                    </div>

                    <Button onClick={addProgress} className="w-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]" size="lg" variant="default">
                        Gain XP
                    </Button>
                </CardContent>
            </Card>
            <p className="mt-6 text-center text-sm font-bold text-black bg-white border-2 border-black px-4 py-2 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Click "Gain XP" to simulate checking off tasks!
            </p>
        </div>
    );
}
