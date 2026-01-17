import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ChallengeCardProps {
    challenge: {
        id: number | string;
        title: string;
        description: string;
        status: "locked" | "open" | "completed";
    };
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
    const isLocked = challenge.status === "locked";
    const isCompleted = challenge.status === "completed";

    return (
        <Card className={cn(
            "flex flex-col h-full transition-all duration-200 border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#0F2854] bg-white overflow-hidden",
            isLocked ? "bg-gray-100" : "hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0F2854]"
        )}>
            <CardHeader className="border-b-2 border-[#0F2854] bg-secondary/20 pb-4 px-6 pt-6">
                <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                        "text-xs font-bold font-mono px-2 py-1 rounded border-2 border-[#0F2854] shadow-[2px_2px_0px_0px_#0F2854]",
                        isLocked ? "bg-gray-200 text-gray-500" : "bg-primary text-white"
                    )}>
                        CHALLENGE {challenge.id}
                    </span>
                    {isCompleted ? (
                        <CheckCircle2 className="text-[#0F2854] h-6 w-6 fill-green-400" />
                    ) : isLocked ? (
                        <Lock className="text-[#0F2854] h-5 w-5" />
                    ) : (
                        <div className="h-5 w-5 rounded-full bg-blue-500 border-2 border-[#0F2854] animate-pulse" />
                    )}
                </div>
                <CardTitle className="text-xl font-black uppercase tracking-tight text-[#0F2854]">{challenge.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-6 px-6">
                <p className="text-[#0F2854] font-medium leading-relaxed">
                    {challenge.description}
                </p>
            </CardContent>
            <CardFooter className="pt-4 pb-6 px-6">
                <Button
                    className="w-full text-base border-2 border-[#0F2854] shadow-[3px_3px_0px_0px_#0F2854]"
                    variant={isLocked ? "secondary" : "default"}
                    disabled={isLocked}
                    asChild={!isLocked}
                >
                    {isLocked ? (
                        <span className="flex items-center gap-2 text-[#0F2854]"><Lock size={16} /> Locked</span>
                    ) : (
                        <Link href={`/challenges/${challenge.id}`}>
                            Start Challenge <PlayCircle className="ml-2 h-4 w-4" />
                        </Link>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
