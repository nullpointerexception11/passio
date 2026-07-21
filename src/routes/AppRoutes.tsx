/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { Logger } from '../core/logger/Logger';

// ============================================================================
// STAGE PLACEHOLDERS (Ready for Sprint 2 features)
// ============================================================================

/**
 * Focus Screen - The core distraction-free workspace where writers write
 */
const FocusScreen: React.FC = () => {
  React.useEffect(() => {
    Logger.debug('Navigation', 'Loaded Focus workspace view.');
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
          className="w-full h-80 bg-transparent resize-none focus:outline-none text-base leading-relaxed font-serif"
          style={{ color: 'var(--color-text-primary)' }}
        />
      </div>
    </div>
  );
};

/**
 * Library Screen - Organizes books, articles, thoughts, and local files
 */
const LibraryScreen: React.FC = () => {
  React.useEffect(() => {
    Logger.debug('Navigation', 'Loaded Library view.');
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
 * Settings Screen - Configures local paths, backup exports, and themes
 */
const SettingsScreen: React.FC = () => {
  React.useEffect(() => {
    Logger.debug('Navigation', 'Loaded Settings panel.');
  }, []);

  const [diagnosticLogs, setDiagnosticLogs] = React.useState<string>('');

  const loadLogs = () => {
    setDiagnosticLogs(Logger.exportLogs());
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

        {/* Local Logger Debugging */}
        <section className="flex flex-col gap-3 border-t pt-6" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <h2 className="text-sm font-semibold tracking-wide uppercase text-accent font-mono">System Diagnostics</h2>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Review structured memory logs recorded in real-time by the custom logging pipeline.
          </p>
          <button 
            onClick={loadLogs}
            className="w-fit px-4 py-2 rounded border text-xs font-medium cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
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
      <MainLayout>
        <Routes>
          <Route path="/" element={<FocusScreen />} />
          <Route path="/library" element={<LibraryScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
};

export default AppRoutes;
