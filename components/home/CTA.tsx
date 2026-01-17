import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
    return (
        <section className="py-24 px-20 text-center">
            <div className="max-w-5xl mx-auto bg-primary rounded-[2.5rem] p-12 md:p-20 text-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">Ready to Speedrun?</h2>
                    <p className="text-xl font-bold opacity-90 mb-10 max-w-xl mx-auto">
                        Join 10,000+ developers building the future of Sui. It's free and always will be.
                    </p>
                    <Button size="lg" className="rounded-xl px-12 h-20 text-xl border-2 border-black bg-white text-black hover:bg-gray-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]">
                        Get Started Now <ArrowRight className="ml-2 h-6 w-6" />
                    </Button>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
        </section>
    );
}
