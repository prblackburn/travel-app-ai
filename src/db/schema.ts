import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const trips = sqliteTable('trips', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  destination: text('destination').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  description: text('description'),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const activities = sqliteTable('activities', {
  id: text('id').primaryKey(),
  tripId: text('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  date: text('date').notNull(),
  time: text('time'),
  location: text('location'),
  notes: text('notes'),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const packingLists = sqliteTable('packing_lists', {
  id: text('id').primaryKey(),
  tripId: text('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const packingItems = sqliteTable('packing_items', {
  id: text('id').primaryKey(),
  listId: text('list_id')
    .notNull()
    .references(() => packingLists.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  category: text('category'),
  quantity: integer('quantity').default(1).notNull(),
  isPacked: integer('is_packed', { mode: 'boolean' }).default(false).notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});