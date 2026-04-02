'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, GitBranch, Zap, Shield, ArrowRight, Check, Search, Code, FileText } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [repoUrl, setRepoUrl] = React.useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1" style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <section className="section" style={{ textAlign: 'center', paddingBottom: '4rem' }}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="badge">Phase 1: One-Click Generator</div>
              <h1 className="gradient-text" style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', lineHeight: 0.95, marginBottom: '2rem' }}>
                READMEs that <br />write themselves.
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
                Autorepo scales your documentation by analyzing your codebase structure and logic. Generate professional READMEs in seconds.
              </p>

              {/* Input Group */}
              <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                display: 'flex',
                gap: '0.75rem',
                padding: '0.5rem',
                backgroundColor: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
              }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
                    <GitBranch size={20} />
                  </div>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter GitHub URL..."
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    style={{ border: 'none', background: 'transparent', paddingLeft: '3.5rem', boxShadow: 'none' }}
                  />
                </div>
                <button className="button">
                  Generate <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Agentic Flow / Process Section */}
        <section className="section" style={{ padding: '8rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.01)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <div className="badge">Autorepo Neural Stack</div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Sophisticated AI agents, <br />scaled to your repo.</h2>
              <p style={{ color: 'var(--text-muted)' }}>From raw source to polished documentation via multiple specialized modules.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', position: 'relative' }}>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Search size={22} />
                </div>
                <h3 style={{ marginBottom: '1rem' }}>Code Ingestion</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  Scans metadata, directory structure, and main entry points to understand project intent.
                </p>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Code size={22} />
                </div>
                <h3 style={{ marginBottom: '1rem' }}>Logic Analysis</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  Leverages LLMs to map dependencies and extract core functionalities from your logic.
                </p>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <FileText size={22} />
                </div>
                <h3 style={{ marginBottom: '1rem' }}>Synthesis</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  Generates technical, aesthetic READMEs tailored to your selected flavor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '2rem' }}>Built for fast-moving developers.</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    "AI Codebase Analysis: Scans repository structure and logic.",
                    "Customizable Styles: Minimal, Technical, or Creative flavours.",
                    "Secure Ingestion: Privacy-first ephemeral code analysis.",
                    "GitHub Sync: Continuous integration updates (Coming Soon)."
                  ].map((text, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ color: '#111', marginTop: '4px' }}><Check size={20} /></div>
                      <p style={{ fontWeight: 500 }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card" style={{ backgroundColor: 'var(--text-main)', color: 'var(--bg-color)', padding: '3rem' }}>
                <div style={{ opacity: 0.8, fontFamily: 'var(--font-geist-mono)', fontSize: '0.9rem' }}>
                  <p style={{ color: '#888', marginBottom: '1rem' }}>// autorepo-diag-v1.0</p>
                  <p style={{ marginBottom: '0.5rem' }}><span style={{ color: '#fff' }}>$</span> scan --target="https://github.com/..."</p>
                  <p style={{ color: '#55ff55', marginBottom: '0.5rem' }}>[OK] Repository identified.</p>
                  <p style={{ color: '#55ff55', marginBottom: '0.5rem' }}>[OK] Structure mapped.</p>
                  <p style={{ color: '#55ff55', marginBottom: '1rem' }}>[OK] Synthesis complete.</p>
                  <p style={{ color: '#fff' }}>New README generated in /outputs/</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Start generating today.</h2>
                <Link href="/auth" className="button" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', borderRadius: '12px' }}>
                  Get Started for Free
                </Link>
          </div>
        </section>
      </main>

      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>autorepo</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>© 2026 Autorepo Inc. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
