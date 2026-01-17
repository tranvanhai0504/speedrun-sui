import Link from "next/link";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <nav className="fixed top-6 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 mx-4 md:mx-auto max-w-6xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full">
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 font-black text-2xl text-black tracking-tighter">
                    <div className="bg-primary text-black border-2 border-black p-2 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Rocket className="h-5 w-5" />
                    </div>
                    <span>SPEEDRUN SUI</span>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8">
                <Link href="#" className="font-bold text-black hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4">
                    Challenges
                </Link>
                <Link href="#" className="font-bold text-black hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4">
                    Leaderboard
                </Link>
                <Link href="#" className="font-bold text-black hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4">
                    Docs
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="secondary" className="rounded-full">
                    Connect Wallet
                </Button>
            </div>
        </nav>
    );
}
