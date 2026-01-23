import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Bot, Code2, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar (Simple for now) */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="font-bold text-white">V</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Autorepo</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-white text-black hover:bg-white/90 border-0 shadow-none">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto text-center relative mb-32">
          {/* Glow Effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/20 rounded-[100%] blur-[120px] -z-10 pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-violet-300 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Vertical AI Suite
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent drop-shadow-sm">
            Documentation that <br />
            <span className="text-gradient">Writes Itself</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate premium, developer-ready README.md files for your repositories in seconds.
            Powered by advanced LLMs that understand your code.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg shadow-violet-500/20 shadow-2xl">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="h-14 px-8 text-lg">
              View Examples
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 mb-32">
          <Card className="hover:scale-[1.02] transition-transform duration-500">
            <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 border border-violet-500/20">
              <Bot className="h-6 w-6 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Analysis</h3>
            <p className="text-white/60 leading-relaxed">
              We analyze your codebase structure and logic to generate comprehensive documentation that actually makes sense.
            </p>
          </Card>

          <Card className="hover:scale-[1.02] transition-transform duration-500">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
              <Code2 className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Style Selection</h3>
            <p className="text-white/60 leading-relaxed">
              Choose from multiple professional implementation styles. From minimal aesthetics to detailed technical specs.
            </p>
          </Card>

          <Card className="hover:scale-[1.02] transition-transform duration-500">
            <div className="h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 border border-pink-500/20">
              <Zap className="h-6 w-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Automated CI/CD</h3>
            <p className="text-white/60 leading-relaxed">
              Integrate with GitHub Actions to automatically update your README whenever you push code changes.
            </p>
          </Card>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 text-center text-white/30 text-sm">
        <p>&copy; 2026 Vertical AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
