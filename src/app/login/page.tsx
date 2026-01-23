'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowRight, Github } from 'lucide-react';
import { GoogleIcon } from '@/components/ui/icons';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const supabase = createClient();

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: false, // Login only
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Check your email for the magic link!' });
        }
        setLoading(false);
    };

    const handleSocialLogin = async (provider: 'github' | 'google') => {
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback?next=/dashboard`,
            },
        });
    };

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

                <div className="space-y-6">
                    <form onSubmit={handleMagicLink} className="space-y-4">
                        <Input
                            placeholder="name@example.com"
                            label="Email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button className="w-full h-12 text-lg" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Magic Link'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        {message && (
                            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {message.text}
                            </div>
                        )}
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0a0a0a] px-2 text-white/40">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full" type="button" onClick={() => handleSocialLogin('google')}>
                            <GoogleIcon className="mr-2 h-4 w-4" /> Google
                        </Button>
                        <Button variant="outline" className="w-full" type="button" onClick={() => handleSocialLogin('github')}>
                            <Github className="mr-2 h-4 w-4" /> Github
                        </Button>
                    </div>
                </div>

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
