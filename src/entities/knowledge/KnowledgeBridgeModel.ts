/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type KnowledgeBridgeType = 'highlight' | 'note';

export type KnowledgeBridgeTypeFilter = 'all' | 'highlight' | 'note';

/**
 * Unified model for Knowledge Bridge items combining Highlights & Reading Notes
 */
export interface IKnowledgeBridgeItem {
  id: string;
  type: KnowledgeBridgeType;
  materialId: string;
  materialTitle: string;
  author: string;
  pageNumber: number;
  tags: string[];
  title?: string;
  preview: string;
  color?: string;
  createdAt: string;
}

export interface IKnowledgeBridgeFilter {
  query?: string;
  typeFilter?: KnowledgeBridgeTypeFilter;
  tag?: string;
  materialId?: string;
}

export interface IKnowledgeBridgeSearchResult {
  items: IKnowledgeBridgeItem[];
  totalCount: number;
  highlightCount: number;
  noteCount: number;
  availableTags: string[];
}
