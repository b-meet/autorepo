import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";

export default function FAQPage() {
    const faqs = [
        { q: "Is Autorepo safe to use with private repositories?", a: "Yes. We use OAuth2 for authentication and only request read access to specific repositories. Your code is never stored persistently, only processed in-memory." },
        { q: "Can I customize the generated README?", a: "Absolutely. You can choose from 'Minimal', 'Technical', or 'Marketing' presets, and provide custom instructions to the AI agent." },
        { q: "Which LLMs do you use?", a: "The Free plan uses efficent models like GPT-3.5-Turbo. Pro and Premium plans unlock GPT-4, Claude 3 Opus, and specialized code models for superior accuracy." },
        { q: "Do you support languages other than JavaScript?", a: "Autorepo supports all major programming languages including Python, Go, Rust, Java, and more." },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">Frequently Asked Questions</h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Everything you need to know about Autorepo.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-6">
                    {faqs.map((faq, i) => (
                        <Card key={i} className="p-6 bg-white/5 hover:bg-white/10 transition-colors">
                            <h3 className="text-lg font-bold mb-3 text-white">{faq.q}</h3>
                            <p className="text-white/60 leading-relaxed">{faq.a}</p>
                        </Card>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
