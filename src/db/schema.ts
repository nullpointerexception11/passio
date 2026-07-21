/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

/**
 * Documents Table - Core model for notes, drafts, and thoughts
 */
export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull().default(''),
  summary: text('summary'),
  wordCount: integer('word_count').notNull().default(0),
  readingTimeMin: integer('reading_time_min').notNull().default(0),
  isFavorite: integer('is_favorite', { mode: 'boolean' }).notNull().default(false),
  isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

/**
 * Collections Table - For organizing documents logically (Folders/Books)
 */
export const collections = sqliteTable('collections', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color'), // hex or semantic design token color key
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

/**
 * Junction table for Many-to-Many relationship between Documents and Collections
 */
export const documentCollections = sqliteTable('document_collections', {
  documentId: text('document_id')
    .notNull()
    .references(() => documents.id, { onDelete: 'cascade' }),
  collectionId: text('collection_id')
    .notNull()
    .references(() => collections.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.documentId, table.collectionId] }),
}));

/**
 * System Settings Table - Key-value pair configurations persisted locally
 */
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').notNull(),
});
