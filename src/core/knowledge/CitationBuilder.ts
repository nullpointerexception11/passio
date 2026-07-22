/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IKnowledgeBridgeItem } from './KnowledgeBridgeModel';

export interface ICitationOptions {
  includeAuthor?: boolean;
  pagePrefix?: string;
}

export class CitationBuilder {
  /**
   * Formats a knowledge item into a standard markdown citation text.
   * Specification Format:
   * > Alıntı metni
   * 
   * — Kitap Adı, Sayfa 42
   */
  public static buildCitation(
    item: IKnowledgeBridgeItem, 
    options: ICitationOptions = {}
  ): string {
    const quoteText = item.preview ? item.preview.trim() : '';
    const pageLabel = options.pagePrefix || 'Sayfa';
    
    let sourceLine = `${item.materialTitle}, ${pageLabel} ${item.pageNumber}`;
    if (options.includeAuthor && item.author && item.author !== 'Anonim') {
      sourceLine = `${item.author} — ${sourceLine}`;
    }

    return `> ${quoteText}\n\n— ${sourceLine}`;
  }
}

export default CitationBuilder;
