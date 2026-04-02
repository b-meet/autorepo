'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, 
  Settings, 
  User, 
  Clock, 
  Zap,
  Layout,
  LogOut,
  Plus,
  MessageSquare,
  Menu,
  X,
  Maximize2,
  Minimize2,
  Monitor
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

type GenerationStep = 'IDLE' | 'SCANNING' | 'ANALYZING' | 'SYNTHESIZING' | 'COMPLETED';

interface ScanHistory {
  id: string;
  name: string;
  url: string;
  date: string;
}

export default function DashboardPage() {
  const [step, setStep] = React.useState<GenerationStep>('IDLE');
  const [repoUrl, setRepoUrl] = React.useState('');
  const [logs, setLogs] = React.useState<string[]>([]);
  const [recentScans] = React.useState<ScanHistory[]>([]);
  
  // Layout States
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [previewVisible, setPreviewVisible] = React.useState(true);
  const [previewEnlarged, setPreviewEnlarged] = React.useState(false);

  const supabase = createClient();

  const handleStartGeneration = () => {
    if (!repoUrl) return;
    setStep('SCANNING');
    setLogs([]);
    addLog('Initiating repository ingestion...');
    
    setTimeout(() => {
      addLog('Scanning directory structure...');
      addLog('Filtering out node_modules, .git, and large binary files.');
    }, 1000);

    setTimeout(() => {
      setStep('ANALYZING');
      addLog('Mapping logical entry points...');
      addLog('Identified: React (Next.js), TypeScript, Framer Motion.');
    }, 3000);

    setTimeout(() => {
      setStep('SYNTHESIZING');
      addLog('Synthesizing professional README structure...');
      addLog('Tone set to: Premium Technical Minimalist.');
    }, 6000);

    setTimeout(() => {
      setStep('COMPLETED');
      addLog('README Generation Complete.');
    }, 9000);
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const resetToNew = () => {
    setStep('IDLE');
    setRepoUrl('');
    setLogs([]);
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sections">
        
        {/* LEFT SIDEBAR */}
        <aside className="dash-sidebar" style={{ width: sidebarCollapsed ? '68px' : '280px' }}>
          {/* Sidebar Toggle & Logo */}
          <div style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '0.5rem' }}>
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '4px', borderRadius: '6px' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Menu size={20} />
              </button>
              {!sidebarCollapsed && (
                <Link href="/" style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                  autorepo
                </Link>
              )}
            </div>
            
            <button 
              onClick={resetToNew}
              className="button button-outline" 
              style={{ 
                width: '100%', 
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start', 
                gap: '0.75rem', 
                borderRadius: '10px', 
                fontSize: '0.85rem',
                padding: '0.65rem',
                border: '1px dashed var(--border-color)',
                backgroundColor: 'rgba(0,0,0,0.02)',
                minWidth: 0
              }}
            >
              <Plus size={16} /> {!sidebarCollapsed && <span>New Scan</span>}
            </button>
          </div>
          
          {/* History */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.5rem' }}>
            {recentScans.length > 0 && !sidebarCollapsed && (
              <div style={{ padding: '1rem 0.5rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Recent Scans
              </div>
            )}
            {/* ... other history items if any ... */}
          </div>

          {/* Bottom Side Actions */}
          <div style={{ padding: '0.5rem 0.5rem 1.5rem' }}>
            <div className="dash-nav-item" style={{ 
              marginBottom: '0.5rem', 
              padding: '0.65rem 0.75rem',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              margin: sidebarCollapsed ? '0.25rem' : '0.25rem 0.75rem'
            }}>
              <Settings size={18} style={{ marginRight: sidebarCollapsed ? '0' : '0.75rem' }} /> 
              {!sidebarCollapsed && <span>Settings</span>}
            </div>

            <div style={{ 
              marginTop: '1rem',
              padding: sidebarCollapsed ? '0.5rem' : '0.75rem 1rem', 
              borderRadius: '16px', 
              backgroundColor: 'rgba(0,0,0,0.03)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '0.75rem',
              margin: sidebarCollapsed ? '0' : '0 0.5rem'
            }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--text-main)', 
                color: 'var(--bg-color)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '0.8rem',
                flexShrink: 0
              }}>
                <User size={16} />
              </div>
              {!sidebarCollapsed && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Meet Bhalodiya</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pro Plan</p>
                </div>
              )}
              {!sidebarCollapsed && (
                <button 
                  title="Log out"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* CENTER: Workspace */}
        <main className="dash-center" style={{ 
          flex: previewEnlarged ? 0 : 1, 
          opacity: previewEnlarged ? 0 : 1, 
          pointerEvents: previewEnlarged ? 'none' : 'auto',
          visibility: previewEnlarged ? 'hidden' : 'visible',
          display: previewEnlarged ? 'none' : 'flex'
        }}>
          <header style={{ 
            height: '64px', 
            borderBottom: '1px solid var(--border-color)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '0 2rem'
          }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Workspace / {step === 'IDLE' ? 'New Scan' : 'Analysis'}</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {!previewVisible && (
                <button 
                  onClick={() => setPreviewVisible(true)}
                  className="button button-outline"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '8px' }}
                >
                  <Monitor size={14} style={{ marginRight: '0.5rem' }} /> Open Preview
                </button>
              )}
              <ThemeToggle />
            </div>
          </header>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '3rem' }}>
            <AnimatePresence mode="wait">
              {step === 'IDLE' ? (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ maxWidth: '600px', margin: 'auto', width: '100%' }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h1 style={{ fontSize: '2.75rem', fontFamily: 'var(--font-instrument-serif)', marginBottom: '1rem', lineHeight: 1.1 }}>
                      What codebase should we <br />explore today?
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                      Enter a public GitHub repository URL to start the automated scan.
                    </p>
                  </div>

                  <div className="card" style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem', borderRadius: '18px', boxShadow: '0 20px 50px rgba(0,0,0,0.06)' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '1rem' }}>
                      <GitBranch size={20} style={{ opacity: 0.4, marginRight: '0.75rem' }} />
                      <input 
                        type="text" 
                        placeholder="https://github.com/user/repo" 
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: '1rem' }}
                        onKeyDown={(e) => e.key === 'Enter' && handleStartGeneration()}
                      />
                    </div>
                    <button 
                      onClick={handleStartGeneration}
                      className="button" 
                      style={{ padding: '0.6rem 2rem', borderRadius: '12px' }}
                    >
                      Generate
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="generation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                    <div className="badge" style={{ margin: 0 }}>Active analysis</div>
                    <span style={{ fontSize: '0.9rem', opacity: 0.6, fontWeight: 500 }}>{repoUrl}</span>
                  </div>

                  <div className="card" style={{ 
                    flex: 1, 
                    backgroundColor: 'rgba(0,0,0,0.015)', 
                    fontFamily: 'var(--font-geist-mono)',
                    padding: '2.5rem',
                    overflowY: 'auto',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    borderRadius: '20px'
                  }}>
                    {logs.map((log, i) => (
                      <div className="terminal-line" key={i}>
                        <span className="terminal-dim" style={{ minWidth: '25px' }}>{i + 1}</span>
                        <span className="terminal-success">❯</span>
                        <span>{log.replace(/\[.*\]\s/, '')}</span>
                      </div>
                    ))}
                    {step !== 'COMPLETED' && (
                      <div className="terminal-line">
                        <span className="terminal-dim" style={{ minWidth: '25px' }}>{logs.length + 1}</span>
                        <span className="terminal-info">◒</span>
                        <span className="animate-pulse">Processing context...</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* RIGHT SIDEBAR: Live Preview */}
        <aside className="dash-right" style={{ 
          width: previewVisible ? (previewEnlarged ? '100%' : '320px') : '0',
          borderLeft: previewVisible ? '1px solid var(--border-color)' : 'none',
          opacity: previewVisible ? 1 : 0
        }}>
          <header style={{ 
            height: '64px', 
            borderBottom: '1px solid var(--border-color)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '0 1.5rem'
          }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Live Preview</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setPreviewEnlarged(!previewEnlarged)}
                title={previewEnlarged ? "Restore" : "Enlarge"}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '4px' }}
              >
                {previewEnlarged ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button 
                onClick={() => { setPreviewVisible(false); setPreviewEnlarged(false); }}
                title="Close"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>
          </header>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {step === 'COMPLETED' ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', maxWidth: previewEnlarged ? '1000px' : 'none', margin: previewEnlarged ? '0 auto' : '0' }}
              >
                <div className="card" style={{ flex: 1, padding: '1.5rem', fontSize: '0.85rem', overflowY: 'auto', backgroundColor: 'var(--bg-color)', marginBottom: '1.5rem', borderRadius: '12px' }}>
                  <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 700 }}># README.md</h1>
                  <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '1rem' }}>Welcome to your new repository. This professional technical documentation was automatically synthesized by Autorepo based on deep codebase traversal.</p>
                  
                  <h2 style={{ fontSize: '1.3rem', margin: '2rem 0 1rem', fontWeight: 600 }}>## Key Highlights</h2>
                  <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', lineHeight: 2 }}>
                    <li><strong style={{ color: 'var(--text-main)' }}>Deep Analysis:</strong> Traversed 128 source files across 12 directories.</li>
                    <li><strong style={{ color: 'var(--text-main)' }}>Logic Mapping:</strong> Corrected identified core entry points and dependencies.</li>
                    <li><strong style={{ color: 'var(--text-main)' }}>Design-First:</strong> Tailored for Premium Technical Minimalist aesthetics.</li>
                  </ul>

                  <h2 style={{ fontSize: '1.3rem', margin: '2rem 0 1rem', fontWeight: 600 }}>## Quick Start</h2>
                  <div className="card" style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-geist-mono)', fontSize: '0.8rem' }}>
                    npm install && npm run dev
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem' }}>
                  <button className="button" style={{ flex: 1, borderRadius: '10px' }}>
                    Copy Markdown
                  </button>
                  <button className="button button-outline" style={{ flex: 1, borderRadius: '10px' }}>
                    Regenerate
                  </button>
                </div>
              </motion.div>
            ) : (
              <div style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center',
                color: 'var(--text-muted)',
                padding: '2rem'
              }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '20px', 
                  backgroundColor: 'rgba(0,0,0,0.02)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <Layout size={32} style={{ opacity: 0.2 }} />
                </div>
                <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>The preview will populate once <br />the codebase scan is complete.</p>
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
