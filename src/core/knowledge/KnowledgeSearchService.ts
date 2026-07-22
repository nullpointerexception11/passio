/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KnowledgeBridgeRepository } from './KnowledgeBridgeRepository';
import { 
  IKnowledgeBridgeItem, 
  IKnowledgeBridgeFilter, 
  IKnowledgeBridgeSearchResult 
} from './KnowledgeBridgeModel';
import { Logger } from '../logger/Logger';

export class KnowledgeSearchService {
  /**
   * Normalizes Turkish character variants for accurate fuzzy string matching
   */
  public static normalizeText(text: string): string {
    if (!text) return '';
    return text
      .replace(/İ/g, 'i')
      .replace(/I/g, 'ı')
      .replace(/Ğ/g, 'g')
      .replace(/Ü/g, 'ü')
      .replace(/Ş/g, 'ş')
      .replace(/Ö/g, 'ö')
      .replace(/Ç/g, 'ç')
      .toLocaleLowerCase('tr-TR')
      .trim();
  }

  /**
   * Searches knowledge items using multi-field query matching
   * Fields evaluated: Etiket, Kitap/Materyal, Yazar, İçerik, Başlık
   */
  public static async search(filter: IKnowledgeBridgeFilter = {}): Promise<IKnowledgeBridgeSearchResult> {
    try {
      Logger.debug('KnowledgeSearchService', 'Executing advanced multi-field search', filter);
      const allItems = await KnowledgeBridgeRepository.getAllKnowledgeItems();

      // Collect available tags
      const tagSet = new Set<string>();
      allItems.forEach(item => {
        item.tags.forEach(t => tagSet.add(t));
      });
      const availableTags = Array.from(tagSet).sort();

      const normalizedQuery = filter.query ? this.normalizeText(filter.query) : '';
      const selectedType = filter.typeFilter || 'all';
      const selectedTag = filter.tag ? this.normalizeText(filter.tag) : '';

      const filteredItems = allItems.filter(item => {
        // Type filter
        if (selectedType === 'highlight' && item.type !== 'highlight') return false;
        if (selectedType === 'note' && item.type !== 'note') return false;

        // Tag filter
        if (selectedTag) {
          const hasTag = item.tags.some(t => this.normalizeText(t).includes(selectedTag));
          if (!hasTag) return false;
        }

        // Material ID filter
        if (filter.materialId && item.materialId !== filter.materialId) return false;

        // Query matching across multi-fields: Etiket, Kitap, Yazar, İçerik, Başlık
        if (normalizedQuery) {
          const contentMatch = this.normalizeText(item.preview).includes(normalizedQuery);
          const titleMatch = item.title ? this.normalizeText(item.title).includes(normalizedQuery) : false;
          const materialMatch = this.normalizeText(item.materialTitle).includes(normalizedQuery);
          const authorMatch = this.normalizeText(item.author).includes(normalizedQuery);
          const tagsMatch = item.tags.some(t => 
            this.normalizeText(t).includes(normalizedQuery) ||
            `#${this.normalizeText(t)}`.includes(normalizedQuery)
          );

          return contentMatch || titleMatch || materialMatch || authorMatch || tagsMatch;
        }

        return true;
      });

      return {
        items: filteredItems,
        totalCount: filteredItems.length,
        highlightCount: filteredItems.filter(i => i.type === 'highlight').length,
        noteCount: filteredItems.filter(i => i.type === 'note').length,
        availableTags,
      };
    } catch (err) {
      Logger.error('KnowledgeSearchService', 'Error performing knowledge search', err);
      return {
        items: [],
        totalCount: 0,
        highlightCount: 0,
        noteCount: 0,
        availableTags: [],
      };
    }
  }
}

export default KnowledgeSearchService;
