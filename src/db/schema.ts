import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const trips = sqliteTable(
  'trips',
  {
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
  },
  table => ({
    nameIdx: index('trips_name_idx').on(table.name),
    startDateIdx: index('trips_start_date_idx').on(table.startDate),
  })
);

export const activities = sqliteTable(
  'activities',
  {
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
  },
  table => ({
    tripIdIdx: index('activities_trip_id_idx').on(table.tripId),
    dateIdx: index('activities_date_idx').on(table.date),
  })
);

export const packingLists = sqliteTable(
  'packing_lists',
  {
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
  },
  table => ({
    tripIdIdx: index('packing_lists_trip_id_idx').on(table.tripId),
  })
);

export const packingItems = sqliteTable(
  'packing_items',
  {
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
  },
  table => ({
    listIdIdx: index('packing_items_list_id_idx').on(table.listId),
    categoryIdx: index('packing_items_category_idx').on(table.category),
    packedIdx: index('packing_items_packed_idx').on(table.isPacked),
  })
);
