import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Challenge } from "@/lib/challenges";
import { cn } from "@/lib/utils";

interface ChallengeCardProps {
    challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
    const isLocked = challenge.status === "locked";
    const isCompleted = challenge.status === "completed";

    return (
        <Card className={cn(
            "flex flex-col h-full transition-all duration-200 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden",
            isLocked ? "opacity-90 bg-gray-100" : "hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        )}>
            <CardHeader className="border-b-2 border-black bg-secondary/20 pb-4 px-6 pt-6">
                <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                        "text-xs font-bold font-mono px-2 py-1 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                        isLocked ? "bg-gray-200 text-gray-500" : "bg-primary text-black"
                    )}>
                        CHALLENGE {challenge.id}
                    </span>
                    {isCompleted ? (
                        <CheckCircle2 className="text-black h-6 w-6 fill-green-400" />
                    ) : isLocked ? (
                        <Lock className="text-black h-5 w-5" />
                    ) : (
                        <div className="h-5 w-5 rounded-full bg-blue-500 border-2 border-black animate-pulse" />
                    )}
                </div>
                <CardTitle className="text-xl font-black uppercase tracking-tight">{challenge.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-6 px-6">
                <p className="text-black font-medium leading-relaxed">
                    {challenge.description}
                </p>
            </CardContent>
            <CardFooter className="pt-4 pb-6 px-6">
                <Button
                    className="w-full text-base border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    variant={isLocked ? "secondary" : "default"}
                    disabled={isLocked}
                    asChild={!isLocked}
                >
                    {isLocked ? (
                        <span className="flex items-center gap-2"><Lock size={16} /> Locked</span>
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
