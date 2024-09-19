import { integer } from 'drizzle-orm/pg-core';
import { date } from 'drizzle-orm/pg-core';
import { varchar } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';

export const TallyCommonSchema = {
  id: uuid('id').primaryKey().defaultRandom(),
  guid: varchar('guid', { length: 200 }).notNull(),
  companyId: varchar('companyId'),
  masterID: integer('masterID').notNull().unique(),
  alterID: integer('alterID').notNull(),
  sortOrder: integer('sortOrder').notNull(),
  lastSyncDate: date('lastSyncDate').notNull()
};