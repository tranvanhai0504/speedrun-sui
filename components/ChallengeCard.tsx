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
            "flex flex-col h-full transition-all duration-200 border-2",
            isLocked ? "bg-muted/50 opacity-80" : "hover:border-primary/50 hover:shadow-md"
        )}>
            <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                        "text-xs font-mono px-2 py-1 rounded",
                        isLocked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                    )}>
                        CHALLENGE {challenge.id}
                    </span>
                    {isCompleted ? (
                        <CheckCircle2 className="text-green-500 h-5 w-5" />
                    ) : isLocked ? (
                        <Lock className="text-muted-foreground h-5 w-5" />
                    ) : (
                        <div className="h-5 w-5 rounded-full bg-blue-500 animate-pulse" />
                    )}
                </div>
                <CardTitle className="text-xl">{challenge.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm leading-relaxed">
                    {challenge.description}
                </p>
            </CardContent>
            <CardFooter className="pt-4">
                <Button
                    className="w-full"
                    variant={isLocked ? "secondary" : "default"}
                    disabled={isLocked}
                    asChild={!isLocked}
                >
                    {isLocked ? (
                        <span>Locked</span>
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
