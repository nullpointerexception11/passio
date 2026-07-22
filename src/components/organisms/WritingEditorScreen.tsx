/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Sliders, GitBranch, Check, RefreshCw } from 'lucide-react';
import { INotebook, INotebookSettings } from '../../core/notebooks/NotebookModel';
import { NotebookService } from '../../core/notebooks/NotebookService';
import { NotebookSettingsModal } from '../molecules/NotebookSettingsModal';
import { NotebookRightPanel } from '../molecules/NotebookRightPanel';
import { Logger } from '../../core/logger/Logger';

interface WritingEditorScreenProps {
  notebook: INotebook;
  onBack: () => void;
  onNotebookUpdated: (updated: INotebook) => void;
}

export const WritingEditorScreen: React.FC<WritingEditorScreenProps> = ({
  notebook,
  onBack,
  onNotebookUpdated,
}) => {
  const [content, setContent] = useState<string>(notebook.content.text);
  const [wordCount, setWordCount] = useState<number>(notebook.metadata.wordCount);
  const [settings, setSettings] = useState<INotebookSettings>(notebook.settings);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // UI Panel States
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Auto-save debounce timer ref
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Focus textarea on mount
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  /**
   * Auto-Save handler with 500ms debounce
   */
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setContent(newText);
    setWordCount(NotebookService.countWords(newText));
    setSaveStatus('saving');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const updated = await NotebookService.updateContent(notebook.metadata.id, newText);
        if (updated) {
          onNotebookUpdated(updated);
        }
        setSaveStatus('saved');
      } catch (err) {
        Logger.error('WritingEditorScreen', 'Failed to auto-save content', err);
        setSaveStatus('saved');
      }
    }, 500);
  };

  /**
   * Update Settings handler
   */
  const handleSettingsChange = async (newSettings: Partial<INotebookSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      const updated = await NotebookService.updateSettings(notebook.metadata.id, newSettings);
      if (updated) {
        onNotebookUpdated(updated);
      }
    } catch (err) {
      Logger.error('WritingEditorScreen', 'Failed to update notebook settings', err);
    }
  };

  // Map font family string to CSS font family class or style
  const getFontFamilyStyle = useCallback((fontFamily: INotebookSettings['fontFamily']) => {
    switch (fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'sans':
        return 'font-sans';
      case 'mono':
        return 'font-mono';
      case 'system':
        return 'font-sans';
      default:
        return 'font-serif';
    }
  }, []);

  return (
    <div 
      className="w-screen h-screen flex flex-col select-none overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg-base)',
        color: 'var(--color-text-primary)',
      }}
    >
      {/* Editor Top Bar */}
      <header 
        className="h-14 px-6 border-b flex items-center justify-between shrink-0 select-none z-10"
        style={{
          borderColor: 'var(--color-border-subtle)',
          backgroundColor: 'var(--color-bg-surface)',
        }}
      >
        {/* Left: Back Button & Notebook Metadata */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer opacity-80 hover:opacity-100"
            style={{ borderColor: 'var(--color-border-subtle)' }}
            title="Defter Listesine Dön"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Defterler</span>
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-xs font-serif font-semibold tracking-wide">
              {notebook.metadata.title}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
              {notebook.metadata.type}
            </span>
          </div>
        </div>

        {/* Right: Status Indicator & Header Action Icons */}
        <div className="flex items-center gap-4">
          {/* Save Status & Word Count */}
          <div className="flex items-center gap-2 text-[11px] font-mono opacity-60">
            <span className="flex items-center gap-1">
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span>Otomatik Kaydedildi</span>
                </>
              )}
            </span>
            <span>•</span>
            <span>{wordCount} Kelime</span>
          </div>

          <div className="h-4 w-px bg-current opacity-10" />

          {/* Action Icons: Bilgi Paneli & Ayarlar */}
          <div className="flex items-center gap-1">
            {/* Bilgi Paneli Icon */}
            <button
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isRightPanelOpen 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-600 dark:text-amber-400 font-semibold' 
                  : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70'
              }`}
              style={!isRightPanelOpen ? { borderColor: 'var(--color-border-subtle)' } : {}}
              title="Bilgi Paneli (~%20)"
            >
              <GitBranch className="w-4 h-4" />
            </button>

            {/* Ayarlar Icon */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl border hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100 transition-all cursor-pointer"
              style={{ borderColor: 'var(--color-border-subtle)' }}
              title="Ayarlar"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Editor Workspace Main Area (~80% width) + Collapsible Panel (~20% width) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Writing Canvas (~80% width) */}
        <main className="flex-1 h-full overflow-y-auto p-8 sm:p-12 flex justify-center items-start">
          <div 
            className="w-full flex flex-col h-full"
            style={{
              maxWidth: settings.maxWidth,
            }}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Düşüncelerinizi buraya özgürce aktarın..."
              className={`w-full h-full bg-transparent border-none outline-none resize-none leading-relaxed transition-all placeholder:opacity-20 ${getFontFamilyStyle(
                settings.fontFamily
              )}`}
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
                color: 'var(--color-text-primary)',
              }}
            />
          </div>
        </main>

        {/* Right Side Panel (~20% width) */}
        <NotebookRightPanel
          isOpen={isRightPanelOpen}
          notebookId={notebook.metadata.id}
          onClose={() => setIsRightPanelOpen(false)}
          onInsertText={(insertedText) => {
            if (textareaRef.current) {
              const start = textareaRef.current.selectionStart || content.length;
              const end = textareaRef.current.selectionEnd || content.length;
              const before = content.substring(0, start);
              const after = content.substring(end);
              const newContent = before + insertedText + after;
              setContent(newContent);
              setTimeout(() => {
                if (textareaRef.current) {
                  textareaRef.current.focus();
                  const newCursorPos = start + insertedText.length;
                  textareaRef.current.selectionStart = newCursorPos;
                  textareaRef.current.selectionEnd = newCursorPos;
                }
              }, 50);
            } else {
              setContent((prev) => prev + insertedText);
            }
          }}
        />
      </div>

      {/* Settings Modal */}
      <NotebookSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onChangeSettings={handleSettingsChange}
      />
    </div>
  );
};
