import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, FolderGit2, Settings, LogOut, Plus } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                            <span className="font-bold text-white">V</span>
                        </div>
                        <span className="font-bold text-lg tracking-tight">Autorepo</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start">
                            <Home className="mr-2 h-4 w-4" /> Home
                        </Button>
                    </Link>
                    <Link href="/dashboard/projects">
                        <Button variant="ghost" className="w-full justify-start">
                            <FolderGit2 className="mr-2 h-4 w-4" /> Projects
                        </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                        <Button variant="ghost" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" /> Settings
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-sm flex items-center justify-between px-6">
                    <h1 className="font-semibold text-lg">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                        <span className="text-sm font-medium">John Doe</span>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
