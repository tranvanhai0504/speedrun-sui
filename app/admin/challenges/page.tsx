"use client";

import { useChallenges, useAdminChallengeMutation } from "@/hooks/useApi";
import { useState } from "react";
import { Plus, Edit, Trash2, Search, MoreVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Challenge } from "@/lib/api";

export default function ChallengesAdminPage() {
    const { data: challenges, isLoading } = useChallenges();
    const { create: createMutation, update: updateMutation, delete: deleteMutation } = useAdminChallengeMutation();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState<Partial<Challenge> | null>(null);

    // Form Stats
    const [formData, setFormData] = useState<Partial<Challenge>>({
        title: "",
        description: "",
        xp_reward: 100,
        difficulty: "EASY",
        required_modules: [],
        status: "locked",
    });

    const filteredChallenges = challenges?.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.challenge_id.includes(searchTerm)
    );

    const handleEdit = (challenge: Challenge) => {
        setEditingChallenge(challenge);
        setFormData(challenge);
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingChallenge(null);
        setFormData({
            title: "",
            description: "",
            xp_reward: 100,
            difficulty: "EASY",
            required_modules: [],
            status: "locked",
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (editingChallenge && editingChallenge.challenge_id) {
                await updateMutation.mutateAsync({ id: editingChallenge.challenge_id, data: formData });
            } else {
                await createMutation.mutateAsync({ ...formData, challenge_id: `challenge-${Date.now()}` } as Challenge);
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to save challenge", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this challenge?")) {
            await deleteMutation.mutateAsync(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0F2854]">Challenges</h1>
                    <p className="text-gray-500">Manage platform challenges</p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="bg-[#0F2854] text-white hover:bg-[#1C4D8D] font-bold shadow-[2px_2px_0px_0px_#4988C4]"
                >
                    <Plus className="mr-2 h-4 w-4" /> Create Challenge
                </Button>
            </div>

            <div className="bg-white rounded-xl border-2 border-[#E5E5EA] p-4">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search challenges..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-200"
                    />
                </div>

                {isLoading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : (
                    <div className="space-y-2">
                        {filteredChallenges?.map((challenge) => (
                            <div
                                key={challenge.challenge_id}
                                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-[#4988C4] hover:shadow-sm transition-all group bg-white"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                                        #{challenge.challenge_id}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0F2854]">{challenge.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className={`px-2 py-0.5 rounded-full ${challenge.difficulty === "EASY" ? "bg-green-100 text-green-700" :
                                                    challenge.difficulty === "MEDIUM" ? "bg-yellow-100 text-yellow-700" :
                                                        "bg-red-100 text-red-700"
                                                }`}>
                                                {challenge.difficulty}
                                            </span>
                                            <span>{challenge.xp_reward} XP</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" variant="ghost" onClick={() => handleEdit(challenge)}>
                                        <Edit className="h-4 w-4 text-gray-500" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleDelete(challenge.challenge_id)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {filteredChallenges?.length === 0 && (
                            <div className="text-center py-8 text-gray-400">No challenges found.</div>
                        )}
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl bg-white">
                    <DialogHeader>
                        <DialogTitle>{editingChallenge ? "Edit Challenge" : "Create Challenge"}</DialogTitle>
                        <DialogDescription>
                            Configure the challenge details below.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>XP Reward</Label>
                                <Input
                                    type="number"
                                    value={formData.xp_reward}
                                    onChange={(e) => setFormData({ ...formData, xp_reward: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.difficulty}
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
                                    value={formData.status}
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
                                value={formData.description}
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
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} className="bg-[#0F2854] text-white">Save Challenge</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
