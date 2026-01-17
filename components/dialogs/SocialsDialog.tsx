"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface SocialsForm {
    twitter: string;
    github: string;
    telegram: string;
    discord: string;
}

interface SocialsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: SocialsForm;
    setForm: (form: SocialsForm) => void;
    onSave: () => void;
    isUpdating: boolean;
}

export function SocialsDialog({ open, onOpenChange, form, setForm, onSave, isUpdating }: SocialsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-4 border-[#0F2854] shadow-[8px_8px_0px_0px_#0F2854] rounded-2xl sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-[#0F2854]">Update Socials</DialogTitle>
                    <DialogDescription>
                        Connect your social profiles to build your reputation.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0F2854]">Twitter Handle</label>
                        <Input
                            value={form.twitter}
                            onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                            placeholder="@username"
                            className="bg-gray-50 border-2 border-[#0F2854] focus-visible:ring-[#0F2854]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0F2854]">GitHub Username</label>
                        <Input
                            value={form.github}
                            onChange={(e) => setForm({ ...form, github: e.target.value })}
                            placeholder="username"
                            className="bg-gray-50 border-2 border-[#0F2854] focus-visible:ring-[#0F2854]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0F2854]">Telegram</label>
                        <Input
                            value={form.telegram}
                            onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                            placeholder="@username"
                            className="bg-gray-50 border-2 border-[#0F2854] focus-visible:ring-[#0F2854]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0F2854]">Discord</label>
                        <Input
                            value={form.discord}
                            onChange={(e) => setForm({ ...form, discord: e.target.value })}
                            placeholder="username#1234"
                            className="bg-gray-50 border-2 border-[#0F2854] focus-visible:ring-[#0F2854]"
                        />
                    </div>
                </div>
                <Button
                    onClick={onSave}
                    disabled={isUpdating}
                    className="w-full bg-[#0F2854] hover:bg-[#0F2854]/90 text-white font-bold py-2 rounded-xl border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#4988C4] active:translate-y-[2px] active:shadow-none transition-all"
                >
                    {isUpdating ? "Saving..." : "Save Socials"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
