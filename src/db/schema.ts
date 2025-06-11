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

