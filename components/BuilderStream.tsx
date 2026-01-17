import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export function BuilderStream() {
    const activities = [
        { user: "0x1a...4f2", action: "completed Challenge 1", time: "2m ago" },
        { user: "0x8b...9c1", action: "deployed Greeting", time: "5m ago" },
        { user: "0x3c...2a9", action: "joined Speedrun Sui", time: "12m ago" },
        { user: "0x7d...e34", action: "completed Challenge 0", time: "15m ago" },
        { user: "0x9f...1b2", action: "earned 'Move Novice'", time: "23m ago" },
    ];

    return (
        <Card className="h-fit sticky top-24">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Builder Stream
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity, i) => (
                        <div key={i} className="flex flex-col gap-1 pb-3 border-b last:border-0 last:pb-0">
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-xs font-bold text-primary">
                                    {activity.user}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {activity.time}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {activity.action}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
