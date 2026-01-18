"use client";

import { useChallenges, useAdminChallengeMutation } from "@/hooks/useApi";
import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Challenge } from "@/lib/api";
import { AdminChallengeDialog } from "@/components/dialogs/AdminChallengeDialog";

export default function ChallengesAdminPage() {
    const { data: challenges, isLoading } = useChallenges();
    const { create: createMutation, update: updateMutation, delete: deleteMutation } = useAdminChallengeMutation();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState<Partial<Challenge> | null>(null);

    const filteredChallenges = challenges?.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.challenge_id.includes(searchTerm)
    );

    const handleEdit = (challenge: Challenge) => {
        setEditingChallenge(challenge);
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingChallenge(null);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (formData: Partial<Challenge>) => {
        try {
            if (editingChallenge && editingChallenge.challenge_id) {
                await updateMutation.mutateAsync({ id: editingChallenge.challenge_id, data: formData });
            } else {
                await createMutation.mutateAsync({ ...formData, challenge_id: `challenge-${Date.now()}` } as Challenge);
            }
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

            <AdminChallengeDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                challenge={editingChallenge}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
