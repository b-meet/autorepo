import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Github } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Your Projects</h2>
                    <p className="text-white/60">Manage your documentation generation pipelines.</p>
                </div>
                <Link href="/dashboard/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Empty State Card */}
                <Link href="/dashboard/new" className="col-span-1">
                    <Card className="h-64 border-dashed border-2 border-white/10 bg-transparent hover:bg-white/5 flex flex-col items-center justify-center text-center cursor-pointer group">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Plus className="h-6 w-6 text-white/40" />
                        </div>
                        <h3 className="font-medium text-white/80">Create New Project</h3>
                        <p className="text-sm text-white/40 mt-1">Import a repository to get started</p>
                    </Card>
                </Link>

                {/* Demo Project Card */}
                <Card className="h-64 flex flex-col justify-between group cursor-pointer hover:bg-white/5">
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 rounded-lg bg-white/5">
                                <Github className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Active</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-violet-400 transition-colors">vertical-ai/autorepo</h3>
                        <p className="text-sm text-white/50 line-clamp-2">
                            Next.js application for generating README files automatically. Premium UI design system.
                        </p>
                    </div>
                    <div className="text-xs text-white/30 border-t border-white/5 pt-4 flex justify-between">
                        <span>Last updated 2 mins ago</span>
                        <span>v1.0.0</span>
                    </div>
                </Card>
            </div>
        </div>
    );
}
