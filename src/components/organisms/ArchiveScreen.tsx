/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Archive, Lock } from 'lucide-react';
import { useTheme } from '../../core/theme/ThemeContext';

export const ArchiveScreen: React.FC = () => {
  const navigate = useNavigate();
  const { themeType, toggleTheme } = useTheme();

  return (
    <div 
      className="min-h-screen w-screen flex flex-col select-none overflow-x-hidden"
      style={{
        backgroundColor: 'var(--color-bg-base)',
        color: 'var(--color-text-primary)',
      }}
    >
      {/* Header */}
      <header 
        className="h-14 px-6 flex items-center justify-between border-b shrink-0"
        style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-bg-surface)' }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ana Salon</span>
          </button>
          <span className="text-xs font-serif font-medium tracking-widest uppercase opacity-60">
            ARŞİV
          </span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded border cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
          style={{ borderColor: 'var(--color-border-subtle)' }}
        >
          {themeType === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-8 flex flex-col items-center justify-center text-center gap-6">
        <div className="p-4 rounded-2xl border" style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-bg-surface)' }}>
          <Archive className="w-8 h-8 text-accent" />
        </div>

        <div className="flex flex-col gap-2 max-w-md">
          <h1 className="text-xl font-serif font-medium">Güvenli Yerel Arşiv</h1>
          <p className="text-xs leading-relaxed opacity-60" style={{ color: 'var(--color-text-secondary)' }}>
            Mühürlenen yazılar, tamamlanmış metinler ve saklanan tüm dökümanlar yerel diskte şifreli olarak saklanır.
          </p>
        </div>

        <div className="p-6 rounded-2xl border w-full max-w-md flex items-center justify-center gap-3 text-xs font-mono opacity-50" style={{ borderColor: 'var(--color-border-subtle)' }}>
          <Lock className="w-4 h-4" />
          <span>Henüz mühürlenmiş döküman bulunmuyor</span>
        </div>
      </main>
    </div>
  );
};

export default ArchiveScreen;
