import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowRight, Github } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />

            <Card className="w-full max-w-md relative z-10 backdrop-blur-2xl bg-black/40 border-white/10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-heading mb-2 text-white">Welcome Back</h1>
                    <p className="text-white/60">Sign in to continue to Autorepo</p>
                </div>

                <form className="space-y-6">
                    <Input
                        placeholder="name@example.com"
                        label="Email"
                        type="email"
                    />
                    <Input
                        placeholder="••••••••"
                        label="Password"
                        type="password"
                    />

                    <Button className="w-full h-12 text-lg">
                        Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0a0a0a] px-2 text-white/40">Or continue with</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" type="button">
                        <Github className="mr-2 h-4 w-4" /> Github
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-white/60">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                        Sign up
                    </Link>
                </div>
            </Card>
        </div>
    );
}
