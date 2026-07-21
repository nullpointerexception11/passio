/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Logger } from '../core/logger/Logger';
import { AppConfig } from '../core/config/AppConfig';

/**
 * Interface representing standard operations for database persistence
 */
export interface IDatabaseService {
  initialize(): Promise<void>;
  execute(query: string, params?: unknown[]): Promise<unknown>;
  select<T>(table: string, filters?: Record<string, unknown>): Promise<T[]>;
  insert<T>(table: string, data: Record<string, unknown>): Promise<T>;
  update(table: string, data: Record<string, unknown>, filters: Record<string, unknown>): Promise<void>;
  delete(table: string, filters: Record<string, unknown>): Promise<void>;
}

/**
 * In-Memory & LocalStorage based SQL adapter for browser/web preview fallback.
 * Allows full data survival, querying, and schema obedience without breaking Tauri's native layer.
 */
class BrowserMockDatabaseService implements IDatabaseService {
  private store: Record<string, Record<string, unknown>> = {};

  async initialize(): Promise<void> {
    Logger.info('Database', 'Initializing Browser fallback Database Engine...');
    
    // Seed initial collections and settings
    this.store['documents'] = JSON.parse(localStorage.getItem('passio_docs') || '{}');
    this.store['collections'] = JSON.parse(localStorage.getItem('passio_collections') || '{}');
    this.store['settings'] = JSON.parse(localStorage.getItem('passio_settings') || '{}');
    
    Logger.info('Database', 'Browser fallback database initialized and state seeded from LocalStorage.');
  }

  private persist(table: string) {
    if (table === 'documents') localStorage.setItem('passio_docs', JSON.stringify(this.store['documents']));
    if (table === 'collections') localStorage.setItem('passio_collections', JSON.stringify(this.store['collections']));
    if (table === 'settings') localStorage.setItem('passio_settings', JSON.stringify(this.store['settings']));
  }

  async execute(query: string, params?: unknown[]): Promise<unknown> {
    Logger.debug('Database', `Executing Raw Query [Fallback Mode]: ${query}`, params);
    return [];
  }

  async select<T>(table: string, filters?: Record<string, unknown>): Promise<T[]> {
    const tableData = this.store[table] || {};
    let items = Object.values(tableData) as T[];

    if (filters) {
      items = items.filter((item: any) => {
        return Object.entries(filters).every(([key, val]) => item[key] === val);
      });
    }
    return items;
  }

  async insert<T>(table: string, data: Record<string, unknown>): Promise<T> {
    if (!this.store[table]) this.store[table] = {};
    const id = (data.id as string) || (data.key as string) || Math.random().toString(36).substring(7);
    const newItem = { ...data, id };
    this.store[table][id] = newItem;
    this.persist(table);
    Logger.debug('Database', `Inserted record into table [${table}]:`, newItem);
    return newItem as T;
  }

  async update(table: string, data: Record<string, unknown>, filters: Record<string, unknown>): Promise<void> {
    const tableData = this.store[table] || {};
    Object.values(tableData).forEach((item: any) => {
      const match = Object.entries(filters).every(([key, val]) => item[key] === val);
      if (match) {
        const id = item.id || item.key;
        this.store[table][id] = { ...item, ...data };
      }
    });
    this.persist(table);
  }

  async delete(table: string, filters: Record<string, unknown>): Promise<void> {
    const tableData = this.store[table] || {};
    Object.entries(tableData).forEach(([id, item]: [string, any]) => {
      const match = Object.entries(filters).every(([key, val]) => item[key] === val);
      if (match) {
        delete this.store[table][id];
      }
    });
    this.persist(table);
  }
}

/**
 * Desktop Tauri SQLite Database Service
 * Implemented to interface directly with Tauri's SQL Bridge plugin in production builds.
 */
class TauriDatabaseService implements IDatabaseService {
  private dbInstance: any = null;

  async initialize(): Promise<void> {
    Logger.info('Database', `Initializing Native SQLite Database: ${AppConfig.database.fileName}`);
    try {
      // Dynamic import to prevent bundler errors in browser sandbox context
      const pluginName = '@tauri-apps/plugin-sql';
      const { default: Database } = await import(/* @vite-ignore */ pluginName);
      this.dbInstance = await Database.load(`sqlite:${AppConfig.database.fileName}`);
      Logger.info('Database', 'Native SQLite Database connection established successfully via Tauri bridge.');
      
      // Execute table creation scripts (mimicking drizzle-kit migrations on launch)
      await this.runMigrations();
    } catch (err) {
      Logger.error('Database', 'Failed to initialize native SQLite. Swapping to Browser Fallback...', err);
      throw err;
    }
  }

  private async runMigrations() {
    Logger.info('Database', 'Running native Drizzle schema alignments...');
    
    await this.dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        summary TEXT,
        word_count INTEGER NOT NULL DEFAULT 0,
        reading_time_min INTEGER NOT NULL DEFAULT 0,
        is_favorite INTEGER NOT NULL DEFAULT 0,
        is_archived INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    await this.dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        color TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    await this.dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS document_collections (
        document_id TEXT NOT NULL,
        collection_id TEXT NOT NULL,
        PRIMARY KEY (document_id, collection_id),
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE,
        FOREIGN KEY (collection_id) REFERENCES collections (id) ON DELETE CASCADE
      );
    `);

    await this.dbInstance.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    Logger.info('Database', 'Native Drizzle schema alignments complete.');
  }

  async execute(query: string, params?: unknown[]): Promise<unknown> {
    return this.dbInstance.execute(query, params);
  }

  async select<T>(table: string, filters?: Record<string, unknown>): Promise<T[]> {
    if (!filters || Object.keys(filters).length === 0) {
      return this.dbInstance.select(`SELECT * FROM ${table}`);
    }
    const keys = Object.keys(filters).map(k => `${k} = ?`).join(' AND ');
    const vals = Object.values(filters);
    return this.dbInstance.select(`SELECT * FROM ${table} WHERE ${keys}`, vals);
  }

  async insert<T>(table: string, data: Record<string, unknown>): Promise<T> {
    const keys = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const vals = Object.values(data);
    
    await this.dbInstance.execute(`INSERT INTO ${table} (${keys}) VALUES (${placeholders})`, vals);
    return data as T;
  }

  async update(table: string, data: Record<string, unknown>, filters: Record<string, unknown>): Promise<void> {
    const updateKeys = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const filterKeys = Object.keys(filters).map(k => `${k} = ?`).join(' AND ');
    
    const vals = [...Object.values(data), ...Object.values(filters)];
    await this.dbInstance.execute(`UPDATE ${table} SET ${updateKeys} WHERE ${filterKeys}`, vals);
  }

  async delete(table: string, filters: Record<string, unknown>): Promise<void> {
    const filterKeys = Object.keys(filters).map(k => `${k} = ?`).join(' AND ');
    const vals = Object.values(filters);
    await this.dbInstance.execute(`DELETE FROM ${table} WHERE ${filterKeys}`, vals);
  }
}

// Instantiate proper runtime database provider based on container environment
const isTauri = typeof window !== 'undefined' && ('__TAURI_IPC__' in window || (window as any).__TAURI__);

export const db: IDatabaseService = isTauri ? new TauriDatabaseService() : new BrowserMockDatabaseService();

export async function initDb(): Promise<void> {
  try {
    await db.initialize();
  } catch (err) {
    Logger.warn('Database', 'Native SQLite failed. Reverting to memory storage layer...', err);
    // If native fails (such as in browser preview), initialize memory DB to prevent app crash
    if (isTauri) {
      const fallback = new BrowserMockDatabaseService();
      await fallback.initialize();
      Object.assign(db, fallback);
    }
  }
}
export default db;
