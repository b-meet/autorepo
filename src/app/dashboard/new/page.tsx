import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Github, Wand2 } from 'lucide-react';

export default function NewProjectPage() {
    return (
        <div className="max-w-2xl mx-auto pt-10">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold font-heading mb-2">Import Repository</h1>
                <p className="text-white/60">Enter your GitHub repository URL to generate documentation.</p>
            </div>

            <Card className="p-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Repository URL</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Github className="absolute left-3 top-3 h-5 w-5 text-white/30" />
                                <input
                                    className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 hover:border-white/20 transition-all font-mono text-sm"
                                    placeholder="github.com/username/repo"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h3 className="text-sm font-medium text-white/70">Readme Style</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-4 rounded-xl border border-violet-500/50 bg-violet-500/10 text-left transition-all">
                                <div className="font-bold text-violet-300 text-sm mb-1">Developer Focused</div>
                                <div className="text-xs text-white/50">Technical, detailed, API specs included.</div>
                            </button>
                            <button className="p-4 rounded-xl border border-white/10 bg-white/5 text-left hover:bg-white/10 transition-all">
                                <div className="font-bold text-white text-sm mb-1">Marketing Focused</div>
                                <div className="text-xs text-white/50">Feature highlights, screenshots first.</div>
                            </button>
                        </div>
                    </div>

                    <Button className="w-full h-12 text-lg mt-4">
                        <Wand2 className="mr-2 h-4 w-4" /> Generate Magic
                    </Button>
                </div>
            </Card>
        </div>
    );
}
