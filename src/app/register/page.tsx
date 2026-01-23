import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowRight, Github, Sparkles } from 'lucide-react';
import { GoogleIcon } from '@/components/ui/icons';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[100px] opacity-30 pointer-events-none" />

            <Card className="w-full max-w-md relative z-10 backdrop-blur-2xl bg-black/40 border-white/10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-violet-500/10 mb-4 border border-violet-500/20">
                        <Sparkles className="h-6 w-6 text-violet-400" />
                    </div>
                    <h1 className="text-3xl font-bold font-heading mb-2 text-white">Join Vertical AI</h1>
                    <p className="text-white/60">Get started with standard-setting tools.</p>
                </div>

                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="John" label="First Name" />
                        <Input placeholder="Doe" label="Last Name" />
                    </div>
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

                    <Button className="w-full h-12 text-lg bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
                        Create Account <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full" type="button">
                            <GoogleIcon className="mr-2 h-4 w-4" /> Google
                        </Button>
                        <Button variant="outline" className="w-full" type="button">
                            <Github className="mr-2 h-4 w-4" /> Github
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-white/60">
                    Already have an account?{' '}
                    <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                        Sign in
                    </Link>
                </div>
            </Card>
        </div>
    );
}
