import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Choose the plan that fits your needs. No hidden fees.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-4">
                    {/* Free Tier */}
                    <Card className="flex flex-col p-8 bg-white/5 border-white/10 hover:border-white/20">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-white/60 mb-2">Basic</h3>
                            <div className="text-4xl font-bold font-heading">Free</div>
                            <p className="text-sm text-white/40 mt-1">Forever free for open source.</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Part of Vertical AI Suite', 'Basic Themes', 'Public Repos Only', 'Community Support'].map((feature) => (
                                <li key={feature} className="flex items-center text-sm text-white/80">
                                    <Check className="mr-3 h-4 w-4 text-violet-400" /> {feature}
                                </li>
                            ))}
                        </ul>
                        <Button variant="outline" className="w-full">Get Started</Button>
                    </Card>

                    {/* Pro Tier */}
                    <Card className="flex flex-col p-8 relative border-violet-500/30 bg-violet-900/10 hover:bg-violet-900/20">
                        <div className="absolute top-0 right-0 p-3">
                            <span className="bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Popular</span>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-violet-300 mb-2">Pro</h3>
                            <div className="text-4xl font-bold font-heading">$10<span className="text-lg font-normal text-white/40">/mo</span></div>
                            <p className="text-sm text-white/40 mt-1">For serious developers.</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Everything in Basic', 'Private Repos', 'Standard AI Models', 'Priority Support', 'Custom Branding'].map((feature) => (
                                <li key={feature} className="flex items-center text-sm text-white">
                                    <Check className="mr-3 h-4 w-4 text-violet-400" /> {feature}
                                </li>
                            ))}
                        </ul>
                        <Button className="w-full bg-violet-600 hover:bg-violet-700">Subscribe Now</Button>
                    </Card>

                    {/* Premium Tier */}
                    <Card className="flex flex-col p-8 bg-white/5 border-white/10 hover:border-white/20">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-white/60 mb-2">Premium</h3>
                            <div className="text-4xl font-bold font-heading">$25<span className="text-lg font-normal text-white/40">/mo</span></div>
                            <p className="text-sm text-white/40 mt-1">Best LLMs & Features.</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Everything in Pro', 'GPT-4 / Claude 3 Opus', 'Automated CI/CD', 'API Access', 'Team Collaboration'].map((feature) => (
                                <li key={feature} className="flex items-center text-sm text-white/80">
                                    <Check className="mr-3 h-4 w-4 text-violet-400" /> {feature}
                                </li>
                            ))}
                        </ul>
                        <Button variant="outline" className="w-full">Get Premium</Button>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
