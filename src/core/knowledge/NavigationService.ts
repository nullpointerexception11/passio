/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Logger } from '../logger/Logger';

export interface INavigationTarget {
  route: string;
  materialId?: string;
  pageNumber?: number;
}

export class NavigationService {
  /**
   * Constructs navigation payload to open a target material at a specific page in Library Reader
   */
  public static navigateToSource(
    navigateFn: (path: string, options?: { state?: any }) => void,
    materialId: string,
    pageNumber: number = 1
  ): void {
    Logger.info('NavigationService', `Navigating to material [${materialId}] page [${pageNumber}] in Library`);
    
    navigateFn('/library', {
      state: {
        materialId,
        pageNumber,
        timestamp: Date.now(),
      },
    });
  }
}

export default NavigationService;
