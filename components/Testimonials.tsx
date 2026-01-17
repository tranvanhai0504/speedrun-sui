import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
    {
        name: "Alex Dev",
        role: "Move Beginner",
        content: "I finally understand Sui Objects! The clay UI supports my mental model properly.",
        avatar: "AD",
        color: "bg-purple-200 text-purple-700"
    },
    {
        name: "Sarah Code",
        role: "DeFi Builder",
        content: "The challenges are actually fun. I spent 3 hours building a DEX without realizing it.",
        avatar: "SC",
        color: "bg-orange-200 text-orange-700"
    },
    {
        name: "Mike Chain",
        role: "Smart Contract Engineer",
        content: "Best onboarding experience for Move. Highly recommended for any web3 dev.",
        avatar: "MC",
        color: "bg-blue-200 text-blue-700"
    }
];

export function Testimonials() {
    return (
        <section className="py-24">
            <h2 className="text-4xl font-black text-center mb-12 text-primary tracking-tight">
                Builders Love It
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
                {testimonials.map((t, i) => (
                    <Card key={i} className="bg-white/50 backdrop-blur-sm border-2 border-white/50 hover:-translate-y-2 transition-transform duration-300">
                        <CardContent className="pt-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold ${t.color} shadow-inner`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="font-bold">{t.name}</p>
                                    <p className="text-sm text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                            <p className="text-lg leading-relaxed italic opacity-90">
                                "{t.content}"
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
