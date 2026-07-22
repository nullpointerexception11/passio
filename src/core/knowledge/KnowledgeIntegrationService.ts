/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KnowledgeSearchService } from './KnowledgeSearchService';
import { CitationBuilder } from './CitationBuilder';
import { ReferenceManager } from './ReferenceManager';
import { PreviewService } from './PreviewService';
import { NavigationService } from './NavigationService';
import { 
  IKnowledgeBridgeItem, 
  IKnowledgeBridgeFilter, 
  IKnowledgeBridgeSearchResult 
} from './KnowledgeBridgeModel';
import { Logger } from '../logger/Logger';

class KnowledgeIntegrationDomainService {
  /**
   * Search knowledge items across highlights and reading notes
   */
  async searchKnowledge(filter: IKnowledgeBridgeFilter = {}): Promise<IKnowledgeBridgeSearchResult> {
    return await KnowledgeSearchService.search(filter);
  }

  /**
   * Formats a knowledge item into a standard markdown citation text
   */
  buildCitation(item: IKnowledgeBridgeItem): string {
    return CitationBuilder.buildCitation(item);
  }

  /**
   * Generates preview data structure for a knowledge item
   */
  getPreview(item: IKnowledgeBridgeItem) {
    return PreviewService.generatePreview(item);
  }

  /**
   * Records citation reference for a notebook
   */
  registerReference(notebookId: string, item: IKnowledgeBridgeItem) {
    return ReferenceManager.addReference(notebookId, item.id, item.materialTitle, item.pageNumber);
  }

  /**
   * Navigates to source PDF in Library Reader
   */
  navigateToSource(
    navigateFn: (path: string, options?: { state?: any }) => void,
    materialId: string,
    pageNumber: number
  ) {
    NavigationService.navigateToSource(navigateFn, materialId, pageNumber);
  }
}

export const KnowledgeIntegrationService = new KnowledgeIntegrationDomainService();
export default KnowledgeIntegrationService;
