import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Challenge } from "@/lib/api";
import { useState, useEffect } from "react";

interface AdminChallengeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    challenge: Partial<Challenge> | null;
    onSubmit: (data: Partial<Challenge>) => Promise<void>;
}

export function AdminChallengeDialog({ open, onOpenChange, challenge, onSubmit }: AdminChallengeDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Challenge>>({
        title: "",
        description: "",
        xp_reward: 100,
        difficulty: "EASY",
        required_modules: [],
        status: "locked",
    });

    useEffect(() => {
        if (open) {
            if (challenge) {
                setFormData(challenge);
            } else {
                // Reset for create mode
                setFormData({
                    title: "",
                    description: "",
                    xp_reward: 100,
                    difficulty: "EASY",
                    required_modules: [],
                    status: "locked",
                });
            }
        }
    }, [open, challenge]);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            await onSubmit(formData);
            onOpenChange(false);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-white">
                <DialogHeader>
                    <DialogTitle>{challenge ? "Edit Challenge" : "Create Challenge"}</DialogTitle>
                    <DialogDescription>
                        Configure the challenge details below.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={formData.title || ""}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>XP Reward</Label>
                            <Input
                                type="number"
                                value={formData.xp_reward || 0}
                                onChange={(e) => setFormData({ ...formData, xp_reward: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Difficulty</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.difficulty || "EASY"}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                            >
                                <option value="EASY">EASY</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="HARD">HARD</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status (Initial)</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.status || "locked"}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            >
                                <option value="locked">Locked</option>
                                <option value="open">Open</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Markdown Instructions</Label>
                        <Textarea
                            className="min-h-[150px] font-mono"
                            value={formData.instructions || ""}
                            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                            placeholder="# Instructions..."
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleSubmit} className="bg-[#0F2854] text-white" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Challenge"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
