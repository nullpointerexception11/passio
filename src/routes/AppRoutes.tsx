/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { RoomHub } from '../components/organisms/RoomHub';
import { Logger } from '../core/logger/Logger';
import { Security } from '../core/security/SecurityService';

// ============================================================================
// WORKSPACE SCREENS
// ============================================================================

/**
 * Yazıhane - The core distraction-free workspace where writers write
 */
const FocusScreen: React.FC = () => {
  React.useEffect(() => {
    Logger.debug('Navigation', 'Loaded Focus (Yazıhane) workspace view.');
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest font-mono text-accent">Active Workspace</span>
        <h1 className="text-3xl font-serif font-medium tracking-tight">The Blank Canvas</h1>
      </header>
      
      <div className="flex flex-col gap-4">
        <textarea
          placeholder="Start typing your thoughts. Every stroke is automatically saved locally in your offline SQLite database..."
          className="w-full h-80 bg-transparent resize-none focus:outline-none text-base leading-relaxed font-serif border-none outline-none"
          style={{ color: 'var(--color-text-primary)' }}
        />
      </div>
    </div>
  );
};

/**
 * Kütüphane - Organizes books, articles, thoughts, and local files
 */
const LibraryScreen: React.FC = () => {
  React.useEffect(() => {
    Logger.debug('Navigation', 'Loaded Library (Kütüphane) view.');
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest font-mono text-accent">Personal Library</span>
        <h1 className="text-3xl font-serif font-medium tracking-tight">Your Thoughts</h1>
      </header>
      
      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
        A silent collection of your offline writings. Organize books, research papers, and journals with complete mathematical privacy.
      </p>

      {/* Structured placeholder list */}
      <div className="flex flex-col gap-4 border-t pt-6" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className="p-4 border rounded-lg flex items-center justify-between"
             style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border-subtle)' }}
        >
          <div>
            <div className="font-serif font-medium text-sm">Philosophy and Minimalist Design</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Draft • Updated 12 hours ago</div>
          </div>
          <span className="text-xs font-mono" style={{ color: 'var(--color-text-accent)' }}>1,432 words</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Arşiv - Secure vault holding completed offline manuscripts and journals
 */
const ArchiveScreen: React.FC = () => {
  React.useEffect(() => {
    Logger.debug('Navigation', 'Loaded Archive (Arşiv) view.');
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest font-mono text-accent">Safe Vault</span>
        <h1 className="text-3xl font-serif font-medium tracking-tight">The Archive</h1>
      </header>
      
      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
        A physical local archive holding sealed texts, deleted nodes, and historic publications. Completely offline, secure, and encrypted on your local disk.
      </p>

      <div className="flex flex-col gap-4 border-t pt-6" style={{ borderColor: 'var(--color-border-subtle)' }}>
        <div className="p-8 border rounded-lg flex flex-col items-center justify-center text-center animate-pulse"
             style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border-subtle)' }}
        >
          <span className="text-3xl mb-3 opacity-60">🗄️</span>
          <div className="font-serif font-medium text-sm">No Sealed Volumes Yet</div>
          <p className="text-xs mt-1.5 max-w-xs opacity-50 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            When you complete a manuscript in the Yazıhane, you will be able to lock and archive it permanently here.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Ayarlar - Configures local paths, backup exports, and themes
 */
const SettingsScreen: React.FC = () => {
  React.useEffect(() => {
    Logger.debug('Navigation', 'Loaded Settings (Ayarlar) panel.');
  }, []);

  const [diagnosticLogs, setDiagnosticLogs] = React.useState<string>('');

  const loadLogs = () => {
    setDiagnosticLogs(Logger.exportLogs());
  };

  const handleWipeCredentials = async () => {
    if (confirm('Are you absolutely sure you want to clear your local security credentials and reset your vault lock?')) {
      await Security.clearPinSettings();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <header className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest font-mono text-accent">Control Panel</span>
        <h1 className="text-3xl font-serif font-medium tracking-tight">Configuration</h1>
      </header>
      
      <div className="flex flex-col gap-6 border-t pt-6" style={{ borderColor: 'var(--color-border-subtle)' }}>
        {/* Core SQLite Section */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-accent font-mono">SQLite Storage</h2>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Passio stores all document indices, collection bindings, and writing sessions inside a local database file: <code className="px-1.5 py-0.5 rounded text-xs bg-neutral-200 dark:bg-neutral-800 font-mono">passio_core.db</code>.
          </p>
        </section>

        {/* Security / Vault Access Control */}
        <section className="flex flex-col gap-3 border-t pt-6" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <h2 className="text-sm font-semibold tracking-wide uppercase text-accent font-mono">Vault Access Control</h2>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Your workspace is sealed behind a physical cryptographic 4-digit PIN stored completely offline on your device hardware.
          </p>
          <button 
            onClick={handleWipeCredentials}
            className="w-fit px-4 py-2 rounded border border-red-500/30 text-xs font-medium cursor-pointer transition-colors hover:bg-red-500/10 text-red-500 font-mono"
          >
            Clear PIN and Lock Vault
          </button>
        </section>

        {/* Local Logger Debugging */}
        <section className="flex flex-col gap-3 border-t pt-6" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <h2 className="text-sm font-semibold tracking-wide uppercase text-accent font-mono">System Diagnostics</h2>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Review structured memory logs recorded in real-time by the custom logging pipeline.
          </p>
          <button 
            onClick={loadLogs}
            className="w-fit px-4 py-2 rounded border text-xs font-medium cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5 font-mono"
            style={{ borderColor: 'var(--color-border-subtle)', color: 'var(--color-text-primary)' }}
          >
            Load Diagnostic Dump
          </button>

          {diagnosticLogs && (
            <pre className="p-4 rounded-lg font-mono text-xs overflow-auto max-h-64 border bg-neutral-100 dark:bg-neutral-900"
                 style={{ borderColor: 'var(--color-border-subtle)', color: 'var(--color-text-muted)' }}
            >
              {diagnosticLogs}
            </pre>
          )}
        </section>
      </div>
    </div>
  );
};

// ============================================================================
// ROUTING CHASSIS
// ============================================================================

export const AppRoutes: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Room Hub is the central portal of Passio (no persistent sidebar) */}
        <Route path="/" element={<RoomHub />} />
        
        {/* Specialized individual workspaces, styled inside the high-end MainLayout frame */}
        <Route path="/focus" element={<MainLayout><FocusScreen /></MainLayout>} />
        <Route path="/library" element={<MainLayout><LibraryScreen /></MainLayout>} />
        <Route path="/archive" element={<MainLayout><ArchiveScreen /></MainLayout>} />
        <Route path="/settings" element={<MainLayout><SettingsScreen /></MainLayout>} />
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes;
