import { varchar, timestamp, uuid, pgTable } from 'drizzle-orm/pg-core';

export const ModuleSchema = pgTable('modules', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

export type ModuleInsert = typeof ModuleSchema.$inferInsert;
export type ModuleSelect = typeof ModuleSchema.$inferSelect;