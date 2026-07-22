/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Reading Note Entity Model
 * Represents a discrete thought, insight, or annotation created during reading.
 */
export interface IReadingNote {
  id: string;
  materialId: string; // PDF Document ID
  title: string;      // Optional note title
  content: string;    // Plain text content
  tags: string[];     // Categorization tags
  createdAt: string;  // ISO string timestamp
  updatedAt: string;  // ISO string timestamp
}

export interface INoteFilter {
  query?: string;
  tag?: string;
}
