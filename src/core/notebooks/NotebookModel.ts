/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NotebookType = 
  | 'roman' 
  | 'hikaye' 
  | 'deneme' 
  | 'gunluk' 
  | 'elestiri' 
  | 'dusunce' 
  | 'ani' 
  | 'otobiyografi' 
  | 'arastirma' 
  | 'serbest';

export interface INotebookSettings {
  fontFamily: 'serif' | 'sans' | 'mono' | 'system';
  fontSize: number; // 14, 16, 18, 20, 24
  lineHeight: number; // 1.4, 1.6, 1.8, 2.0
  maxWidth: string; // '65ch' | '75ch' | '85ch' | '100%'
}

export interface INotebookMetadata {
  id: string;
  title: string;
  type: NotebookType;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface INotebookContent {
  text: string;
}

export interface INotebook {
  metadata: INotebookMetadata;
  content: INotebookContent;
  settings: INotebookSettings;
}

export const NOTEBOOK_TYPE_LABELS: Record<NotebookType, string> = {
  roman: 'Roman',
  hikaye: 'Hikâye',
  deneme: 'Deneme',
  gunluk: 'Günlük',
  elestiri: 'Eleştiri',
  dusunce: 'Düşünce',
  ani: 'Anı',
  otobiyografi: 'Otobiyografi',
  arastirma: 'Araştırma',
  serbest: 'Serbest',
};

export const DEFAULT_NOTEBOOK_SETTINGS: INotebookSettings = {
  fontFamily: 'serif',
  fontSize: 18,
  lineHeight: 1.8,
  maxWidth: '75ch',
};

export interface DBNotebookRow {
  id: string;
  title: string;
  type: string;
  content: string;
  word_count: number;
  wordCount?: number;
  settings_json: string;
  settingsJson?: string;
  created_at: string;
  createdAt?: string;
  updated_at: string;
  updatedAt?: string;
}
