/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Shield, HardDrive, Terminal } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { Logger } from '../../infrastructure/logger/Logger';
import { Security } from '../../infrastructure/security/SecurityService';
import { Header } from '../../shared/ui/Header';

export const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { themeType, toggleTheme } = useTheme();
  const [logs, setLogs] = useState<string>('');

  const handleWipePin = async () => {
    if (confirm('Güvenlik PIN ayarını sıfırlamak istediğinize emin misiniz?')) {
      await Security.clearPinSettings();
      window.location.reload();
    }
  };

  const handleLoadLogs = () => {
    setLogs(Logger.exportLogs());
  };

  return (
    <div 
      className="min-h-screen w-screen flex flex-col select-none overflow-x-hidden"
      style={{
        backgroundColor: 'var(--color-bg-base)',
        color: 'var(--color-text-primary)',
      }}
    >
      <Header title="AYARLAR" onBack={() => navigate('/')} backLabel="Ana Salon" />

      <main className="flex-1 max-w-3xl w-full mx-auto p-8 flex flex-col gap-8">
        <section className="p-6 rounded-2xl border flex items-center justify-between" style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-bg-surface)' }}>
          <div className="flex items-center gap-3">
            {themeType === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            <div className="flex flex-col">
              <span className="text-sm font-serif font-medium">Görünüm Modu</span>
              <span className="text-xs opacity-50 font-mono">
                {themeType === 'light' ? 'Premium White (Açık Tema)' : 'Premium Black (Karanlık Tema)'}
              </span>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg border text-xs font-mono font-medium cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            Temayı Değiştir
          </button>
        </section>

        <section className="p-6 rounded-2xl border flex flex-col gap-3" style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-bg-surface)' }}>
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-accent" />
            <div className="flex flex-col">
              <span className="text-sm font-serif font-medium">SQLite Veritabanı Depolaması</span>
              <span className="text-xs opacity-50 font-mono">Tüm veriler cihazınızda yerel olarak saklanır (`passio_core.db`)</span>
            </div>
          </div>
        </section>

        <section className="p-6 rounded-2xl border flex items-center justify-between" style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-bg-surface)' }}>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-500" />
            <div className="flex flex-col">
              <span className="text-sm font-serif font-medium">Güvenlik PIN Kilit Ayarı</span>
              <span className="text-xs opacity-50 font-mono">Kilit ekranı PIN kodunu ve oturumu sıfırlayın</span>
            </div>
          </div>
          <button
            onClick={handleWipePin}
            className="px-4 py-2 rounded-lg border border-red-500/30 text-red-500 text-xs font-mono font-medium cursor-pointer hover:bg-red-500/10"
          >
            PIN Sıfırla
          </button>
        </section>

        <section className="p-6 rounded-2xl border flex flex-col gap-4" style={{ borderColor: 'var(--color-border-subtle)', backgroundColor: 'var(--color-bg-surface)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-neutral-400" />
              <span className="text-sm font-serif font-medium">Sistem Günlükleri</span>
            </div>
            <button
              onClick={handleLoadLogs}
              className="px-3 py-1.5 rounded border text-xs font-mono cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
              style={{ borderColor: 'var(--color-border-subtle)' }}
            >
              Günlükleri Göster
            </button>
          </div>

          {logs && (
            <pre className="p-4 rounded-xl border bg-black/5 dark:bg-white/5 font-mono text-[11px] overflow-auto max-h-48" style={{ borderColor: 'var(--color-border-subtle)' }}>
              {logs}
            </pre>
          )}
        </section>
      </main>
    </div>
  );
};

export default SettingsScreen;
