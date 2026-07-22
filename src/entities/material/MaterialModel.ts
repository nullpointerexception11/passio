/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Central Domain Entity: Material
 * Represents any readable content source in Passio (PDF document, book, article, essay, etc.)
 */
export interface IMaterial {
  id: string; // Unique document ID (e.g., 'dostoyevski-notes-from-underground', 'custom-pdf-1683920102')
  title: string;
  author: string;
  description?: string;
  fileType: 'pdf' | 'epub' | 'txt' | 'custom';
  fileSize?: string;
  pageCount: number;
  lastReadPage: number;
  lastReadAt?: string;
  tags?: string[];
  isCustom?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IMaterialActiveSession {
  docId: string;
  title: string;
  buffer: ArrayBuffer;
  targetPage?: number;
}
