import Link from "next/link";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 mx-4 md:mx-auto max-w-6xl bg-white/80 backdrop-blur-md rounded-full shadow-[0px_10px_30px_rgba(0,0,0,0.05)] border border-white/50">
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 font-black text-2xl text-primary tracking-tighter">
                    <div className="bg-primary text-white p-2 rounded-xl shadow-lg">
                        <Rocket className="h-5 w-5" />
                    </div>
                    <span>SPEEDRUN SUI</span>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8">
                <Link href="#" className="font-bold text-muted-foreground hover:text-primary transition-colors">
                    Challenges
                </Link>
                <Link href="#" className="font-bold text-muted-foreground hover:text-primary transition-colors">
                    Leaderboard
                </Link>
                <Link href="#" className="font-bold text-muted-foreground hover:text-primary transition-colors">
                    Docs
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="clay" className="rounded-full shadow-lg hover:transalate-y-1">
                    Connect Wallet
                </Button>
            </div>
        </nav>
    );
}
