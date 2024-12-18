import {
  varchar, uuid, pgTable, pgEnum, text
} from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { TableSchema } from './tables';

export const ColumnType = pgEnum('column_type', [
  'id',
  'string',
  'number',
  'date',
  'foreignKey'
]);

export const ColumnSchema = pgTable('columns', {
  id: uuid('id').primaryKey().defaultRandom(),
  alias: varchar('alias',{ length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  type: ColumnType('type').default('string').notNull(),
  tableId: uuid('tableId')
    .references(() => TableSchema.id, {
      onDelete: 'restrict',
      onUpdate: 'restrict'
    })
    .notNull(),
  referenceTable: text('referenceTable'),
  referenceColumn: text('referenceColumn')
});

export type ColumnInsert = typeof ColumnSchema.$inferInsert;
export const ColumnInsertSchema = createInsertSchema(ColumnSchema);
export type ColumnSelect = typeof ColumnSchema.$inferSelect;
export const ColumnSelectSchema = createSelectSchema(ColumnSchema);
