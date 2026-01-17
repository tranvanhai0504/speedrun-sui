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

interface LocationForm {
    city: string;
    country: string;
}

interface LocationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: LocationForm;
    setForm: (form: LocationForm) => void;
    onSave: () => void;
    isUpdating: boolean;
    countries: string[];
}

export function LocationDialog({ open, onOpenChange, form, setForm, onSave, isUpdating, countries }: LocationDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-4 border-[#0F2854] shadow-[8px_8px_0px_0px_#0F2854] rounded-2xl sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-[#0F2854]">Update Location</DialogTitle>
                    <DialogDescription>
                        Let others know where you're building from.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0F2854]">City</label>
                        <Input
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            placeholder="San Francisco"
                            className="bg-gray-50 border-2 border-[#0F2854] focus-visible:ring-[#0F2854]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#0F2854]">Country</label>
                        <select
                            value={form.country}
                            onChange={(e) => setForm({ ...form, country: e.target.value })}
                            className="w-full h-10 px-3 py-2 bg-gray-50 border-2 border-[#0F2854] rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2854] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {countries.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <Button
                    onClick={onSave}
                    disabled={isUpdating || !form.city.trim() || !form.country.trim()}
                    className="w-full bg-[#0F2854] hover:bg-[#0F2854]/90 text-white font-bold py-2 rounded-xl border-2 border-[#0F2854] shadow-[4px_4px_0px_0px_#4988C4] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUpdating ? "Saving..." : "Save Location"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
