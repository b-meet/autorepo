'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

export default function AuthPage() {
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [step, setStep] = React.useState<'email' | 'otp'>('email');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [countdown, setCountdown] = React.useState(0);

  const supabase = createClient();

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setStep('otp');
      setCountdown(60);
      setMessage('We just sent a 6-digit code to ' + email);
    }
    setLoading(false);
  };

  const verifyOtpDirectly = async (token: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = '/';
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtpDirectly(otp);
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-color)', position: 'relative' }}>
      {/* Header Area */}
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.25rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        backgroundColor: 'var(--bg-color)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <Link 
          href="/" 
          className="button button-outline"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            padding: '0.4rem 0.75rem',
            fontSize: '0.8rem',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '10px',
          }}
        >
          <ChevronLeft size={16} /> Back
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Layout Area - Split screen via .auth-main classes in globals.css */}
      <main className="auth-main">
        {/* Welcome Section */}
        <section className="auth-section auth-section-welcome">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '440px', width: '100%', textAlign: 'left' }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              backgroundColor: 'var(--text-main)', 
              color: 'var(--bg-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <Sparkles size={20} />
            </div>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
              lineHeight: 1.1, 
              marginBottom: '1.25rem',
              fontFamily: 'var(--font-instrument-serif)',
              letterSpacing: '-0.02em',
              color: 'var(--text-main)'
            }}>
              We&apos;ve been waiting for you.
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.5 }}>
              Join a growing community of developers who believe that great code deserves even better documentation.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                "AI-powered repo analysis in seconds",
                "Beautiful, creative README flavours",
                "Developer-first privacy and security"
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ color: 'var(--text-main)' }}><CheckCircle2 size={18} /></div>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-main)' }}>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Auth Interaction Area */}
        <section className="auth-section">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ 
              width: '100%', 
              maxWidth: '400px', 
              padding: '2.5rem',
              border: '1px solid var(--border-color)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                {step === 'email' ? 'Welcome' : 'Check your inbox'}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {step === 'email' ? 'Sign in or create an account' : "We've sent you a 6-digit code"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {step === 'email' ? (
                <motion.div
                  key="email-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <button
                      onClick={() => handleOAuthLogin('github')}
                      disabled={loading}
                      className="button button-outline"
                      style={{ 
                        width: '100%', 
                        borderRadius: '12px', 
                        justifyContent: 'center', 
                        height: '44px', 
                        fontSize: '0.9rem',
                        opacity: loading ? 0.6 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                      GitHub
                    </button>
                    <button
                      onClick={() => handleOAuthLogin('google')}
                      disabled={loading}
                      className="button button-outline"
                      style={{ 
                        width: '100%', 
                        borderRadius: '12px', 
                        justifyContent: 'center', 
                        height: '44px', 
                        fontSize: '0.9rem',
                        opacity: loading ? 0.6 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
                      Google
                    </button>
                  </div>

                  <div style={{ position: 'relative', marginBottom: '1.5rem', textAlign: 'center' }}>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
                    <span style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'var(--card-bg)',
                      padding: '0 0.5rem',
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>or sign in with email</span>
                  </div>

                  <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <input
                      type="email"
                      required
                      className="input"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      style={{ height: '44px', fontSize: '0.9rem' }}
                    />
                    <button type="submit" disabled={loading} className="button" style={{ width: '100%', borderRadius: '12px', height: '44px' }}>
                      {loading ? <Loader2 size={18} className="animate-spin" /> : 'Continue'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      pattern="\d{6}"
                      className="input"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setOtp(val);
                        if (val.length === 6) {
                          // Auto-verify when 6 digits are entered
                          verifyOtpDirectly(val);
                        }
                      }}
                      style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.25rem', height: '56px' }}
                      disabled={loading}
                    />
                    <button type="submit" disabled={loading} className="button" style={{ width: '100%', borderRadius: '12px', height: '44px' }}>
                      {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify code'}
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                      {countdown > 0 ? (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Resend code in {countdown}s
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={loading}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textDecoration: 'underline',
                            cursor: loading ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Resend code
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setStep('email');
                        setCountdown(0);
                        setOtp('');
                        setError(null);
                        setMessage(null);
                      }}
                      style={{
                        marginTop: '1rem',
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                    >
                      Use a different email
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div style={{
                padding: '0.75rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(217, 48, 37, 0.05)',
                color: '#d93025',
                fontSize: '0.8rem',
                textAlign: 'center',
                border: '1px solid rgba(217, 48, 37, 0.1)'
              }}>
                {error}
              </div>
            )}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
