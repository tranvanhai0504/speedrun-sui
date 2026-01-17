import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="flex flex-col items-center justify-center py-24 text-center space-y-8 px-4">
            <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight lg:text-7xl">
                    Master Sui Move by{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                        Building
                    </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-[42rem] mx-auto">
                    Level up your Move skills by completing on-chain challenges. Start from a
                    simple NFT and end with a complex DeFi Protocol.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-8 text-lg">
                    Start Building <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                    View Leaderboard
                </Button>
            </div>
        </section>
    );
}
