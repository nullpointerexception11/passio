/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IMaterial } from './MaterialModel';
import { IStorageAdapter } from '../../infrastructure/storage/StorageAdapter';
import { LocalStorageAdapter } from '../../infrastructure/storage/LocalStorageAdapter';

export class MaterialRepository {
  private adapter: IStorageAdapter<IMaterial>;

  constructor(adapter?: IStorageAdapter<IMaterial>) {
    this.adapter = adapter || new LocalStorageAdapter<IMaterial>('passio_materials_');
  }

  async getById(id: string): Promise<IMaterial | null> {
    return this.adapter.get(id);
  }

  async save(material: IMaterial): Promise<void> {
    await this.adapter.set(material.id, material);
  }

  async getAll(): Promise<IMaterial[]> {
    return this.adapter.getAll();
  }

  async updateLastReadPage(id: string, pageNumber: number): Promise<void> {
    const existing = await this.getById(id);
    if (existing) {
      existing.lastReadPage = pageNumber;
      existing.lastReadAt = new Date().toISOString();
      await this.save(existing);
    }
  }

  async delete(id: string): Promise<void> {
    await this.adapter.remove(id);
  }
}

export const materialRepository = new MaterialRepository();
