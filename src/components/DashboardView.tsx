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
  Monitor,
  Star,
  GitFork,
  File,
  Folder,
  Circle,
  AlertCircle,
  Copy,
  RotateCcw,
  Check,
  Loader2,
  Sparkles,
  MousePointer,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Shield,
  Book,
  Keyboard,
  CheckCircle,
  Edit2,
  Trash2
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { fetchRepoData, type RepoData } from '@/app/actions/github';
import { getScans, saveScan, updateScan, deleteScan, type Scan } from '@/app/actions/scans';
import { updateProfile } from '@/app/actions/profile';

type GenerationStep = 'IDLE' | 'SCANNING' | 'ANALYZING' | 'SYNTHESIZING' | 'COMPLETED';
type ReadmeStyle = 'MINIMAL' | 'TECHNICAL' | 'NARRATIVE' | 'CUSTOM';

interface StyleOption {
  id: ReadmeStyle;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface ScanHistory {
  id: string;
  name: string;
  url: string;
  date: string;
}

interface DashboardViewProps {
  user: any;
}

export function DashboardView({ user }: DashboardViewProps) {
  const [step, setStep] = React.useState<GenerationStep>('IDLE');
  const [repoUrl, setRepoUrl] = React.useState('');
  const [repoData, setRepoData] = React.useState<RepoData | null>(null);
  const [isFetching, setIsFetching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [recentScans, setRecentScans] = React.useState<Scan[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState('');
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [isHelpHovered, setIsHelpHovered] = React.useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = React.useState(false);
  const helpTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Profile Form States
  const [profileName, setProfileName] = React.useState(user?.user_metadata?.full_name || '');
  const [profileEmail] = React.useState(user?.email || '');
  const [avatarColor, setAvatarColor] = React.useState('#8b5cf6');
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [accountsConnected, setAccountsConnected] = React.useState({ github: true, google: false });
  const AVATAR_COLORS = ['#3b82f6', '#10b981', '#6366f1', '#8b5cf6', '#f97316', '#ef4444', '#64748b'];

  // Initial Profile state for change detection (Strictly comparison only)
  const [initialProfile, setInitialProfile] = React.useState({ name: user?.user_metadata?.full_name || '', color: '#8b5cf6' });
  const settingsRef = React.useRef<HTMLDivElement>(null);

  // Layout States
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [previewVisible, setPreviewVisible] = React.useState(false); // Off by default
  const [previewEnlarged, setPreviewEnlarged] = React.useState(false);

  // Generation Profile States
  const [selectedStyle, setSelectedStyle] = React.useState<ReadmeStyle>('MINIMAL');
  const [vibePrompt, setVibePrompt] = React.useState('');
  const vibeTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  const styleOptions: StyleOption[] = [
    { id: 'MINIMAL', label: 'Minimalist', description: 'Clean, value-first documentation.', icon: <Layout size={18} /> },
    { id: 'TECHNICAL', label: 'Technical', description: 'Deep architecture and setup focus.', icon: <FileText size={18} /> },
    { id: 'NARRATIVE', label: 'Narrative', description: 'Story-driven project exploration.', icon: <MessageSquare size={18} /> },
    { id: 'CUSTOM', label: 'Custom', description: 'AI-driven custom tone and vibe.', icon: <Zap size={18} /> }
  ];

  const headings = React.useMemo(() => [
    "What codebase should we explore today?",
    "Ready to document something amazing?",
    "Every great repo deserves a better README.",
    "Let's map out your project's logic.",
    "Codebase analysis, synthesized in seconds.",
    "Professional documentation starts here."
  ], []);

  const [currentHeading, setCurrentHeading] = React.useState(headings[0]);

  React.useEffect(() => {
    if (step === 'IDLE') {
      const random = Math.floor(Math.random() * headings.length);
      setCurrentHeading(headings[random]);
    }
  }, [step, headings]);

  // Auto-resize Custom Vibe Textarea
  React.useEffect(() => {
    if (vibeTextareaRef.current) {
      vibeTextareaRef.current.style.height = 'auto';
      vibeTextareaRef.current.style.height = `${vibeTextareaRef.current.scrollHeight}px`;
    }
  }, [vibePrompt]);

  const supabase = createClient();
  const router = useRouter();

  React.useEffect(() => {
    loadScans();
    loadProfile();

    // Load layout preferences from LocalStorage
    const savedSidebar = localStorage.getItem('sidebar-collapsed');

    if (savedSidebar !== null) setSidebarCollapsed(savedSidebar === 'true');
    
    // Default preview to hidden on first visit, but respect localStorage if interacted before
    const savedPreview = localStorage.getItem('preview-visible');
    if (savedPreview !== null) {
      setPreviewVisible(savedPreview === 'true');
    } else {
      setPreviewVisible(false);
    }
  }, []);

  // Save layout preferences when they change
  React.useEffect(() => {
    localStorage.setItem('sidebar-collapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  React.useEffect(() => {
    localStorage.setItem('preview-visible', previewVisible.toString());
  }, [previewVisible]);

  // Reset profile form state when modal closes
  React.useEffect(() => {
    if (!isProfileModalOpen) {
      setProfileName(initialProfile.name);
      setAvatarColor(initialProfile.color);
    }
  }, [isProfileModalOpen, initialProfile]);

  // Click outside listener for settings popover
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

  const loadScans = async () => {
    const data = await getScans();
    setRecentScans(data);
  };

  const handleStartGeneration = async () => {
    if (!repoUrl) return;
    setIsFetching(true);
    setError(null);
    setLogs([]);
    setStep('SCANNING');
    addLog('Initiating repository ingestion...');

    try {
      addLog(`Connecting to GitHub API for ${repoUrl}...`);
      const data = await fetchRepoData(repoUrl);
      setRepoData(data);
      addLog(`[OK] Fetched metadata for ${data.full_name}`);
      addLog(`[OK] Identified ${data.files.length} files in the snapshot.`);

      // Simulate analysis steps based on real data
      setTimeout(() => {
        setStep('ANALYZING');
        addLog('Mapping logical entry points...');
        addLog(`Primary Language identified: ${data.language}`);
      }, 1500);

      setTimeout(() => {
        setStep('SYNTHESIZING');
        addLog('Synthesizing professional README structure...');
        addLog(`Tone set to: ${styleOptions.find(s => s.id === selectedStyle)?.label}${selectedStyle === 'CUSTOM' ? ` (${vibePrompt})` : ''}.`);
      }, 3500);

      setTimeout(async () => {
        setStep('COMPLETED');
        addLog('README Generation Complete.');

        // Save to DB
        try {
          const newScan = await saveScan(data, "Default README content generated by AI.", selectedStyle, vibePrompt);
          setRecentScans(prev => [newScan, ...prev]);
        } catch (saveErr) {
          console.error("Failed to persist scan:", saveErr);
        }
      }, 5500);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      addLog(`[ERROR] ${err.message}`);
      setStep('IDLE');
    } finally {
      setIsFetching(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const resetToNew = () => {
    setStep('IDLE');
    setRepoUrl('');
    setRepoData(null);
    setLogs([]);
    setError(null);
  };

  const selectScan = (scan: Scan) => {
    setRepoData(scan.metadata as RepoData);
    setRepoUrl(scan.repo_url);
    if (scan.metadata?.selectedStyle) {
      setSelectedStyle(scan.metadata.selectedStyle as ReadmeStyle);
      setVibePrompt(scan.metadata.vibePrompt || '');
    }
    setStep('COMPLETED');
    setLogs([`[HISTORICAL] Loaded ${scan.repo_name} from ${new Date(scan.created_at).toLocaleDateString()}`]);
    if (window.innerWidth < 1200) setSidebarCollapsed(true);
  };

  const handleDeleteScan = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await deleteScan(deleteConfirmId);
      setRecentScans(prev => prev.filter(s => s.id !== deleteConfirmId));
      if (repoData?.name === recentScans.find(s => s.id === deleteConfirmId)?.repo_name) {
        resetToNew();
      }
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const startEditing = (e: React.MouseEvent, scan: Scan) => {
    e.stopPropagation();
    setEditingId(scan.id);
    setEditName(scan.repo_name);
  };

  const handleUpdateScan = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await updateScan(id, editName);
      setRecentScans(prev => prev.map(s => s.id === id ? { ...s, repo_name: editName } : s));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const loadProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_bg_color')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setProfileName(data.full_name || '');
        setAvatarColor(data.avatar_bg_color || '#8b5cf6');
        setInitialProfile({
          name: data.full_name || '',
          color: data.avatar_bg_color || '#8b5cf6'
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await updateProfile({
        full_name: profileName,
        avatar_bg_color: avatarColor
      });
      setInitialProfile({
        name: profileName,
        color: avatarColor
      });
      setIsProfileModalOpen(false);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const hasProfileChanges = React.useMemo(() => {
    return (
      profileName !== initialProfile.name ||
      avatarColor !== initialProfile.color
    );
  }, [profileName, avatarColor, initialProfile]);

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sections">

        {/* LEFT SIDEBAR */}
        <aside
          className="dash-sidebar"
          style={{
            width: sidebarCollapsed ? '68px' : '280px',
            overflow: isSettingsOpen ? 'visible' : 'hidden'
          }}
        >
          {/* Sidebar Toggle & Logo - Unified 64px Navbar */}
          <div style={{
            height: '64px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 1.25rem',
            gap: '1rem',
            backgroundColor: 'rgba(var(--bg-rgb), 0.02)',
            backdropFilter: 'blur(8px)',
            flexShrink: 0
          }}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Menu size={20} />
            </button>
            {!sidebarCollapsed && (
              <Link href="/" style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center' }}>
                autorepo
              </Link>
            )}
          </div>

          {/* New Scan Button - Below 64px Navbar */}
          <div style={{ padding: '1.25rem 1rem 0.5rem' }}>
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
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.5rem' }} className="custom-scrollbar">
            {!sidebarCollapsed && (
              <>
                <div style={{ padding: '1rem 0.5rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recent Scans
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {recentScans.map((scan) => (
                    <div
                      key={scan.id}
                      onClick={() => selectScan(scan)}
                      className={`dash-nav-item ${repoData?.name === scan.repo_name ? 'active' : ''}`}
                      style={{
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.8rem',
                        position: 'relative',
                        margin: '1px 0.25rem',
                        group: 'true'
                      } as any}
                    >
                      <Clock size={14} style={{ marginRight: '0.75rem', opacity: 0.5 }} />

                      {editingId === scan.id ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <form onSubmit={(e) => { e.preventDefault(); handleUpdateScan(scan.id); }} style={{ flex: 1 }}>
                            <input
                              autoFocus
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdateScan(scan.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              style={{ width: '100%', background: 'transparent', border: 'none', color: 'inherit', outline: 'none', borderBottom: '1px solid var(--accent-color)', fontSize: '0.8rem' }}
                            />
                          </form>
                          <Check
                            size={14}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleUpdateScan(scan.id)}
                            style={{ cursor: 'pointer', color: 'var(--success-color, #22c55e)' }}
                          />
                          <X
                            size={14}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                            style={{ cursor: 'pointer', color: 'var(--error-color, #ef4444)' }}
                          />
                        </div>
                      ) : (
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {scan.repo_name}
                        </span>
                      )}

                      {editingId !== scan.id && (
                        <div className="history-actions" style={{ display: 'none', gap: '0.4rem', opacity: 0.6 }}>
                          <Edit2 size={12} onClick={(e) => startEditing(e, scan)} style={{ cursor: 'pointer' }} />
                          <Trash2 size={12} onClick={(e) => handleDeleteScan(e, scan.id)} style={{ cursor: 'pointer' }} />
                        </div>
                      )}

                      <style jsx>{`
                        .dash-nav-item:hover .history-actions {
                          display: flex !important;
                        }
                      `}</style>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Bottom Side Actions */}
          <div style={{ padding: '0.5rem 0.5rem 1.5rem', position: 'relative' }} ref={settingsRef}>
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% - 0.5rem)',
                    left: '0.75rem',
                    width: sidebarCollapsed ? '240px' : 'calc(100% - 1.5rem)',
                    backgroundColor: 'var(--card-bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    zIndex: 100,
                    overflow: 'hidden',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <motion.div
                    layout
                    animate={{ x: isHelpHovered ? '-50%' : '0%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    style={{ display: 'flex', width: '200%', alignItems: 'flex-start' }}
                  >
                    {/* Main Menu View */}
                    <div style={{ width: '50%', padding: '0.3rem' }}>
                      <div className="dash-nav-item" style={{ margin: '0', padding: '0.4rem 0.75rem', borderRadius: '12px' }}>
                        <Sparkles size={16} style={{ marginRight: '0.75rem' }} />
                        <span>Upgrade</span>
                      </div>
                      <div
                        className="dash-nav-item"
                        onClick={() => {
                          setIsProfileModalOpen(true);
                          setIsSettingsOpen(false);
                        }}
                        style={{ margin: '0', padding: '0.4rem 0.75rem', borderRadius: '12px' }}
                      >
                        <User size={16} style={{ marginRight: '0.75rem' }} />
                        <span>Profile</span>
                      </div>
                      <div className="dash-nav-item" style={{ margin: '0', padding: '0.4rem 0.75rem', borderRadius: '12px' }}>
                        <MousePointer size={16} style={{ marginRight: '0.75rem' }} />
                        <span>Personalisation</span>
                      </div>

                      <div
                        className="dash-nav-item"
                        onMouseEnter={() => {
                          helpTimeoutRef.current = setTimeout(() => setIsHelpHovered(true), 300);
                        }}
                        onMouseLeave={() => {
                          if (helpTimeoutRef.current) clearTimeout(helpTimeoutRef.current);
                        }}
                        style={{ margin: '0', padding: '0.4rem 0.75rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <HelpCircle size={16} style={{ marginRight: '0.75rem' }} />
                          <span>Help</span>
                        </div>
                        <ChevronRight size={14} style={{ opacity: 0.5 }} />
                      </div>

                      <div style={{ padding: '0.25rem 0.4rem', borderTop: '1px solid var(--border-color)', marginTop: '0.25rem' }}>
                        <div
                          className="dash-nav-item"
                          onClick={handleLogout}
                          onMouseEnter={() => setIsLogoutHovered(true)}
                          onMouseLeave={() => setIsLogoutHovered(false)}
                          style={{
                            margin: '0',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '12px',
                            color: isLogoutHovered ? '#ef4444' : 'rgba(239, 68, 68, 0.8)',
                            backgroundColor: isLogoutHovered ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
                          }}
                        >
                          <LogOut size={16} style={{ marginRight: '0.75rem', opacity: isLogoutHovered ? 1 : 0.6 }} />
                          <span>Log out</span>
                        </div>
                      </div>
                    </div>

                    {/* Help Sub-View */}
                    <div
                      style={{ width: '50%', padding: '0.3rem' }}
                      onMouseLeave={() => setIsHelpHovered(false)}
                    >
                      <div
                        className="dash-nav-item"
                        onClick={() => setIsHelpHovered(false)}
                        style={{ margin: '0', padding: '0.3rem 0.75rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}
                      >
                        <ChevronLeft size={14} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Back</span>
                      </div>

                      <div className="dash-nav-item" style={{ margin: '0', padding: '0.35rem 0.75rem', borderRadius: '10px' }}>
                        <FileText size={14} style={{ marginRight: '0.6rem' }} />
                        <span style={{ fontSize: '0.85rem' }}>Terms and Condition</span>
                      </div>
                      <div className="dash-nav-item" style={{ margin: '0', padding: '0.35rem 0.75rem', borderRadius: '10px' }}>
                        <Shield size={14} style={{ marginRight: '0.6rem' }} />
                        <span style={{ fontSize: '0.85rem' }}>Privacy Policy</span>
                      </div>
                      <div className="dash-nav-item" style={{ margin: '0', padding: '0.35rem 0.75rem', borderRadius: '10px' }}>
                        <Book size={14} style={{ marginRight: '0.6rem' }} />
                        <span style={{ fontSize: '0.85rem' }}>Docs</span>
                      </div>
                      <div className="dash-nav-item" style={{ margin: '0', padding: '0.35rem 0.75rem', borderRadius: '10px' }}>
                        <Keyboard size={14} style={{ marginRight: '0.6rem' }} />
                        <span style={{ fontSize: '0.85rem' }}>Keyboard Shortcuts</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className="dash-nav-item"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              style={{
                marginBottom: '0.5rem',
                padding: '0.65rem 0.75rem',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                margin: sidebarCollapsed ? '0.25rem' : '0.25rem 0.75rem',
                backgroundColor: isSettingsOpen ? 'rgba(var(--bg-rgb), 0.08)' : 'rgba(128, 128, 128, 0.05)'
              }}
            >
              <Settings size={18} style={{ marginRight: sidebarCollapsed ? '0' : '0.75rem' }} />
              {!sidebarCollapsed && <span>Settings</span>}
            </div>

            <div
              style={{
                marginTop: '1rem',
                padding: sidebarCollapsed ? '0.5rem' : '0.75rem 1rem',
                borderRadius: '16px',
                backgroundColor: 'rgba(0,0,0,0.03)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                gap: '0.75rem',
                margin: sidebarCollapsed ? '0' : '0 0.5rem',
                position: 'relative'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: initialProfile.color,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-instrument-serif)',
                fontWeight: 600,
                flexShrink: 0
              }}>
                {(initialProfile.name || profileEmail).charAt(0).toUpperCase()}
              </div>
              {!sidebarCollapsed && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                    {initialProfile.name || profileEmail}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Pro Plan</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* CENTER: Workspace */}
        <main className="dash-center" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <header style={{
            height: '64px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            backgroundColor: 'rgba(var(--bg-rgb), 0.02)',
            backdropFilter: 'blur(8px)',
            zIndex: 5
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Workspace</span>
              <span style={{ opacity: 0.3 }}>/</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                {step === 'SCANNING' ? 'Analysis' : repoData?.name || 'New Scan'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {!previewVisible && (
                <button
                  onClick={() => setPreviewVisible(true)}
                  className="button button-outline"
                  style={{
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.75rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Monitor size={14} /> Open Preview
                </button>
              )}
              <ThemeToggle />
            </div>
          </header>

          <div style={{ flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <AnimatePresence mode="wait">
              {step === 'IDLE' ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    maxWidth: '800px',
                    width: '100%',
                    margin: '0 auto',
                    padding: '2rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                      fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                      lineHeight: 1.1,
                      marginBottom: '1.5rem',
                      fontFamily: 'var(--font-instrument-serif)',
                      letterSpacing: '-0.03em'
                    }}>
                      {currentHeading}
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                      Enter a public GitHub repository URL to start the automated scan.
                    </p>
                  </div>

                  <div
                    className="card"
                    style={{
                      width: '100%',
                      maxWidth: '680px',
                      padding: '0.375rem',
                      borderRadius: '32px',
                      display: 'flex',
                      gap: '0.375rem',
                      backgroundColor: 'rgba(var(--bg-rgb), 0.02)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--border-color)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <GitBranch size={20} style={{ position: 'absolute', left: '1.5rem', opacity: 0.4 }} />
                      <input
                        type="text"
                        placeholder="https://github.com/user/repo"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '1.25rem 1.5rem 1.25rem 3.5rem',
                          fontSize: '1rem',
                          backgroundColor: 'transparent',
                          border: 'none',
                          outline: 'none',
                          color: 'var(--text-main)',
                        }}
                      />
                    </div>
                    <button
                      disabled={isFetching || !repoUrl}
                      onClick={handleStartGeneration}
                      className="button button-pro"
                      style={{ padding: '0 2.5rem', borderRadius: '26px' }}
                    >
                      {isFetching ? <Loader2 size={18} className="animate-spin" /> : 'Generate'}
                    </button>
                  </div>

                  {/* Style Selector Grid */}
                  <div style={{ width: '100%', maxWidth: '800px', marginTop: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', opacity: 0.6, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <Sparkles size={14} />
                      <span>Choose Documentation Soul</span>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(4, 1fr)', 
                      gap: '0.75rem' 
                    }}>
                      {styleOptions.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            padding: '1.25rem',
                            borderRadius: '20px',
                            backgroundColor: selectedStyle === style.id ? 'rgba(var(--text-main-rgb), 0.04)' : 'rgba(var(--bg-rgb), 0.01)',
                            border: `1px solid ${selectedStyle === style.id ? 'var(--text-main)' : 'var(--border-color)'}`,
                            textAlign: 'left',
                            transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <div style={{ 
                            marginBottom: '0.75rem', 
                            color: selectedStyle === style.id ? 'var(--text-main)' : 'var(--text-muted)',
                            transition: 'color 0.2s ease'
                          }}>
                            {style.icon}
                          </div>
                          <p style={{ 
                            fontSize: '0.85rem', 
                            fontWeight: 600, 
                            marginBottom: '0.25rem',
                            color: selectedStyle === style.id ? 'var(--text-main)' : 'var(--text-muted)'
                          }}>
                            {style.label}
                          </p>
                          <p style={{ 
                            fontSize: '0.7rem', 
                            opacity: selectedStyle === style.id ? 0.6 : 0.4,
                            lineHeight: 1.4,
                            color: 'var(--text-main)'
                          }}>
                            {style.description}
                          </p>
                          {selectedStyle === style.id && (
                            <motion.div 
                              layoutId="active-style-glow"
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'radial-gradient(40px circle at 10% 10%, rgba(var(--text-main-rgb), 0.05), transparent)',
                                pointerEvents: 'none'
                              }}
                            />
                          )}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {selectedStyle === 'CUSTOM' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <textarea
                            ref={vibeTextareaRef}
                            placeholder="Describe the vibe... (e.g. 'Playful but professional', 'Minimalist for senior engineers')"
                            value={vibePrompt}
                            onChange={(e) => setVibePrompt(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '1rem 1.25rem',
                              borderRadius: '16px',
                              backgroundColor: 'rgba(var(--bg-rgb), 0.02)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--text-main)',
                              fontSize: '0.85rem',
                              fontFamily: 'inherit',
                              outline: 'none',
                              resize: 'vertical',
                              minHeight: '80px',
                              maxHeight: '300px'
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d93025', justifyContent: 'center', fontSize: '0.9rem' }}
                    >
                      <AlertCircle size={16} />
                      {error}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="generation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
                >
                  {/* Repo Profile Header */}
                  {repoData && (
                    <div className="card" style={{
                      padding: '2rem',
                      borderRadius: '24px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--card-bg)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                        <img
                          src={repoData.owner_avatar}
                          alt={repoData.name}
                          style={{ width: '64px', height: '64px', borderRadius: '16px', border: '1px solid var(--border-color)' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-geist-sans)' }}>{repoData.name}</h3>
                            <div className="badge" style={{ margin: 0, backgroundColor: 'rgba(var(--text-main-rgb), 0.05)', border: '1px solid var(--border-color)' }}>
                              <Star size={12} style={{ marginRight: '4px' }} /> {repoData.stars.toLocaleString()}
                            </div>
                          </div>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: 1.5, maxWidth: '600px' }}>
                            {repoData.description}
                          </p>
                          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-main)', opacity: 0.8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-color, #0070f3)' }} />
                              {repoData.language}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <GitBranch size={14} />
                              {repoData.default_branch}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* File snapshot */}
                      <div style={{
                        marginTop: '2rem',
                        padding: '1.25rem',
                        backgroundColor: 'rgba(var(--bg-rgb), 0.03)',
                        borderRadius: '16px',
                        border: '1px dotted var(--border-color)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', opacity: 0.6 }}>
                          <Monitor size={14} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Repo Snapshot</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                          {repoData.files.slice(0, 8).map((file, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {file.type === 'tree' ? <Folder size={14} style={{ color: 'var(--accent-color)' }} /> : <File size={14} />}
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.path}</span>
                            </div>
                          ))}
                          {repoData.files.length > 8 && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', opacity: 0.5, fontStyle: 'italic' }}>
                              + {repoData.files.length - 8} more files...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terminal Logs Container */}
                  <div className="card card-static" style={{
                    flex: 1,
                    backgroundColor: 'rgba(var(--bg-rgb), 0.02)',
                    fontFamily: 'var(--font-geist-mono)',
                    padding: '2.5rem',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    borderRadius: '24px',
                    pointerEvents: 'auto'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', opacity: 0.5 }}>
                      <Zap size={14} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Analysis Engine v1.0</span>
                    </div>
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

        <AnimatePresence>
          {deleteConfirmId && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(8px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
              }}
              onClick={() => setDeleteConfirmId(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 5 }}
                onClick={(e) => e.stopPropagation()}
                className="card"
                style={{
                  maxWidth: '360px',
                  width: '100%',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                  textAlign: 'left'
                }}
              >
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Delete Repository</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                  Are you sure you want to remove this scan? This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.85rem',
                      borderRadius: '8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)'
                    }}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="button button-pro"
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.85rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      borderColor: 'rgba(239, 68, 68, 0.2)'
                    }}
                    disabled={isDeleting}
                  >
                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Confirm'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* RIGHT SIDEBAR: Live Preview */}
        <aside className="dash-right" style={{
          width: previewVisible
            ? (previewEnlarged ? `calc(100vw - ${sidebarCollapsed ? '68px' : '280px'})` : '320px')
            : '0',
          borderLeft: previewVisible ? '1px solid var(--border-color)' : 'none',
          opacity: previewVisible ? 1 : 0,
          flexShrink: 0
        }}>
          <header style={{
            height: '64px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            backgroundColor: 'rgba(var(--bg-rgb), 0.02)',
            backdropFilter: 'blur(8px)'
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

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: previewEnlarged ? '1.5rem' : '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: previewEnlarged ? '1.5rem' : '0.75rem'
          }}>
            {step === 'COMPLETED' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', maxWidth: previewEnlarged ? '1000px' : 'none', margin: previewEnlarged ? '0 auto' : '0' }}
              >
                <div className="card card-static" style={{
                  flex: 1,
                  padding: previewEnlarged ? '3rem' : '0.75rem',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--bg-color)',
                  marginBottom: previewEnlarged ? '1.5rem' : '0.75rem',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  pointerEvents: 'auto'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: previewEnlarged ? '2rem' : '1rem' }}>
                    <div className="badge" style={{ margin: 0, fontSize: '0.65rem' }}>PREVIEW</div>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Markdown • UTF-8
                    </div>
                  </div>

                  {selectedStyle === 'MINIMAL' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h1 style={{ fontSize: previewEnlarged ? '2.5rem' : '1.75rem', marginBottom: '0.5rem', fontWeight: 800 }}>{repoData?.name}</h1>
                      <p style={{ fontSize: previewEnlarged ? '1.2rem' : '1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>{repoData?.description}</p>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
                        <div className="badge" style={{ backgroundColor: 'rgba(0,112,243,0.1)', color: '#0070f3', border: '1px solid rgba(0,112,243,0.2)' }}>MIT License</div>
                        <div className="badge">v1.2.0</div>
                      </div>

                      <div className="card" style={{ padding: '1.25rem', backgroundColor: 'rgba(var(--bg-rgb), 0.03)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem', opacity: 0.5 }}>QUICK START</p>
                        <code style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontFamily: 'var(--font-geist-mono)' }}>npx create-autorepo my-project</code>
                      </div>
                    </motion.div>
                  )}

                  {selectedStyle === 'TECHNICAL' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700 }}># {repoData?.name} Core Architecture</h1>
                      <div style={{ padding: '1rem', borderLeft: '3px solid var(--accent-color)', backgroundColor: 'rgba(0,112,243,0.03)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                        Technical deep-dive into the synthesis engine and traversal logic.
                      </div>

                      <div style={{ height: '120px', width: '100%', border: '1px dashed var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(var(--bg-rgb), 0.01)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Architecture Diagram: [Traversal] {'->'} [Logic Mapping] {'->'} [Synthesis]
                      </div>

                      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '1.5rem 0 0.75rem' }}>## API Reference</h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Detailed endpoints and logic gates for codebase metadata ingestion.</p>
                    </motion.div>
                  )}

                  {selectedStyle === 'NARRATIVE' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 700, fontFamily: 'var(--font-instrument-serif)' }}>The Story of {repoData?.name}</h1>
                      <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
                        Born out of the frustration of outdated documentation, this project aims to bridge the gap between code and clarity.
                      </p>
                      
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>Why it matters?</h2>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                        Every line of code tells a story. We help you tell it better, faster, and more accurately than any manual process ever could.
                      </p>
                    </motion.div>
                  )}

                  {selectedStyle === 'CUSTOM' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <h1 style={{ fontSize: '1.75rem', marginBottom: '1.25rem', fontWeight: 700 }}>Custom Vibe: {vibePrompt || 'Premium'}</h1>
                      <div className="card" style={{ padding: '2rem', border: '1px solid var(--accent-color)', backgroundColor: 'rgba(0,112,243,0.02)', borderRadius: '16px' }}>
                        <p style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 500 }}>
                          "Synthesizing documentation with a focus on: <strong>{vibePrompt || 'your custom goals'}</strong>"
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: previewEnlarged ? 'row' : 'column',
                  gap: '0.75rem',
                  paddingBottom: '1rem',
                  flexShrink: 0
                }}>
                  <button className="button button-pro" style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
                    <Copy size={16} /> Copy Markdown
                  </button>
                  <button className="button button-secondary" style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
                    <RotateCcw size={16} /> Regenerate
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
      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="modal-overlay" style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)'
          }} onClick={() => setIsProfileModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card"
              style={{
                width: '100%',
                maxWidth: '440px',
                backgroundColor: 'var(--card-bg)',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                padding: '1.75rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => setIsProfileModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  opacity: 0.5,
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)'
                }}
              >
                <X size={18} />
              </button>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  margin: '0 auto 0.75rem',
                  border: '1px solid var(--border-color)',
                  padding: '4px',
                  backgroundColor: 'rgba(var(--bg-rgb), 0.05)',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: avatarColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    fontFamily: 'var(--font-instrument-serif)',
                    color: '#fff'
                  }}>
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      (profileName || profileEmail).charAt(0).toUpperCase()
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                  {AVATAR_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setAvatarColor(color)}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: avatarColor === color ? '1px solid #fff' : 'none',
                        cursor: 'pointer',
                        padding: 0,
                        boxShadow: avatarColor === color ? '0 0 0 1px var(--border-color)' : 'none'
                      }}
                    />
                  ))}
                  <div style={{ position: 'relative', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={10} style={{ position: 'absolute', pointerEvents: 'none', opacity: 0.6 }} />
                    <input
                      type="color"
                      value={avatarColor}
                      onChange={(e) => setAvatarColor(e.target.value)}
                      style={{
                        width: '100%',
                        height: '100%',
                        padding: 0,
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        opacity: 0,
                        position: 'absolute'
                      }}
                    />
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      backgroundColor: !AVATAR_COLORS.includes(avatarColor) ? avatarColor : 'rgba(var(--bg-rgb), 0.1)',
                      border: !AVATAR_COLORS.includes(avatarColor) ? '1px solid #fff' : '1px dashed var(--border-color)',
                      boxShadow: !AVATAR_COLORS.includes(avatarColor) ? '0 0 0 1px var(--border-color)' : 'none'
                    }} />
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Edit Profile</h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.5, marginTop: '0.2rem' }}>Customize your professional persona</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, opacity: 0.5, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(var(--bg-rgb), 0.02)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      outline: 'none',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, opacity: 0.5, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                  <input
                    type="text"
                    value={profileEmail}
                    readOnly
                    placeholder="Ente your email"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(var(--bg-rgb), 0.05)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-muted)',
                      outline: 'none',
                      fontSize: '0.9rem',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '0.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, opacity: 0.5, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Connected Accounts</label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {/* GitHub Connection */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '12px', backgroundColor: 'rgba(var(--bg-rgb), 0.01)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(var(--bg-rgb), 0.05)'
                        }}>
                          <GitBranch size={18} style={{ opacity: 0.8 }} />
                        </div>
                        <div>
                          <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>GitHub</p>
                          <p style={{ fontSize: '0.7rem', opacity: 0.4 }}>{accountsConnected.github ? 'Connected' : 'Not linked'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setAccountsConnected(prev => ({ ...prev, github: !prev.github }))}
                        className={`button ${accountsConnected.github ? '' : 'button-pro'}`}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem', borderRadius: '6px' }}
                      >
                        {accountsConnected.github ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>

                    {/* Google Connection */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '12px', backgroundColor: 'rgba(var(--bg-rgb), 0.01)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(var(--bg-rgb), 0.05)'
                        }}>
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: '1.5px solid var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 900,
                            opacity: 0.8
                          }}>G</div>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Google</p>
                          <p style={{ fontSize: '0.7rem', opacity: 0.4 }}>{accountsConnected.google ? 'Connected' : 'Not linked'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setAccountsConnected(prev => ({ ...prev, google: !prev.google }))}
                        className={`button ${accountsConnected.google ? '' : 'button-pro'}`}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem', borderRadius: '6px' }}
                      >
                        {accountsConnected.google ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <button
                    disabled={!hasProfileChanges || isSavingProfile}
                    onClick={handleSaveProfile}
                    className={`button ${hasProfileChanges ? 'button-pro' : ''}`}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      opacity: hasProfileChanges ? 1 : 0.5,
                      cursor: hasProfileChanges ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {isSavingProfile ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
