import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
    {
        name: "Alex Dev",
        role: "Move Beginner",
        content: "I finally understand Sui Objects! The visual indicators help my mental model properly.",
        avatar: "AD",
        color: "bg-emerald-200 text-black border-2 border-black"
    },
    {
        name: "Sarah Code",
        role: "DeFi Builder",
        content: "The challenges are actually fun. I spent 3 hours building a DEX without realizing it.",
        avatar: "SC",
        color: "bg-amber-200 text-black border-2 border-black"
    },
    {
        name: "Mike Chain",
        role: "Smart Contract Engineer",
        content: "Best onboarding experience for Move. Highly recommended for any web3 dev.",
        avatar: "MC",
        color: "bg-sky-200 text-black border-2 border-black"
    }
];

export function Testimonials() {
    return (
        <section className="py-24 bg-secondary/10 border-y-2 border-black">
            <h2 className="text-4xl font-black text-center mb-16 text-black tracking-tight uppercase">
                Builders Love It
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
                {testimonials.map((t, i) => (
                    <Card key={i} className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform duration-300">
                        <CardContent className="pt-8 px-8 pb-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`h-14 w-14 rounded-full flex items-center justify-center font-bold text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${t.color}`}>
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="font-black text-lg text-black">{t.name}</p>
                                    <p className="text-sm font-bold text-gray-500">{t.role}</p>
                                </div>
                            </div>
                            <p className="text-lg font-medium leading-relaxed italic text-black">
                                "{t.content}"
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
