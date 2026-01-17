import { Button } from "@/components/ui/button";
import { Trophy, Zap, Users, ShieldCheck } from "lucide-react";

export function Features() {
    return (
        <section className="py-20 bg-white border-y-2 border-black">
            <div className="container mx-auto px-20">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-black mb-4">Why Speedrun Sui?</h2>
                        <p className="text-xl text-gray-600 max-w-xl">Everything you need to go from zero to hero in Move development.</p>
                    </div>
                    <Button variant="secondary" className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">View All Features</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-accent p-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform duration-200">
                        <div className="w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <Trophy className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="font-black text-xl mb-2">Gamified Learning</h3>
                        <p className="text-sm font-medium text-black/70">Earn XP, NFTs, and badges as you complete challenges and level up.</p>
                    </div>
                    {/* Feature 2 */}
                    <div className="bg-primary p-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform duration-200">
                        <div className="w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <Zap className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="font-black text-xl mb-2">Instant Feedback</h3>
                        <p className="text-sm font-medium text-black/70">Get real-time verification of your code directly on the blockchain.</p>
                    </div>
                    {/* Feature 3 */}
                    <div className="bg-secondary text-white p-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform duration-200">
                        <div className="w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <Users className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="font-black text-xl mb-2">Community Driven</h3>
                        <p className="text-sm font-medium text-white/70">Join thousands of builders sharing knowledge and specialized resources.</p>
                    </div>
                    {/* Feature 4 */}
                    <div className="bg-[#EEEFE0] p-6 rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform duration-200">
                        <div className="w-12 h-12 bg-white border-2 border-black rounded-lg flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                            <ShieldCheck className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="font-black text-xl mb-2">Battle Tested</h3>
                        <p className="text-sm font-medium text-black/70">Learn security best practices and patterns used in production apps.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
