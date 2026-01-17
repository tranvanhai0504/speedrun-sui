import { Button } from "@/components/ui/button";
import { Rocket, Users, Zap } from "lucide-react";

export function Footer() {
    return (
        <footer className="py-12 border-t-2 border-black bg-white text-center">
            <div className="container mx-auto px-20 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="font-black text-xl flex items-center gap-2">
                    <div className="bg-[#4988C4] text-white border-2 border-[#0F2854] p-1.5 rounded-lg shadow-[2px_2px_0px_0px_#0F2854]">
                        <Rocket className="h-4 w-4" />
                    </div>
                    SPEEDRUN SUI
                </div>
                <p className="text-gray-600 font-bold">© 2024 Speedrun Sui. Built with ❤️ for the community.</p>
                <div className="flex gap-4">
                    <Button variant="ghost" size="icon" className="rounded-lg border-2 border-black hover:bg-primary hover:text-white transition-colors">
                        <Users size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-lg border-2 border-black hover:bg-primary hover:text-white transition-colors">
                        <Zap size={20} />
                    </Button>
                </div>
            </div>
        </footer>
    );
}
