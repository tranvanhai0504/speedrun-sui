import { ChallengeCard } from "@/components/ChallengeCard";
import { challenges } from "@/lib/challenges";

export function Curriculum() {
    return (
        <section className="py-24 container mx-auto px-20">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-5xl font-black text-black mb-6">Curriculum</h2>
                <p className="text-xl font-medium text-gray-600 bg-white inline-block px-6 py-2 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    From "Hello World" to DeFi Wizard
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {challenges.map((challenge) => (
                    <div key={challenge.id} className="h-full">
                        <ChallengeCard challenge={challenge} />
                    </div>
                ))}
            </div>
        </section>
    );
}
