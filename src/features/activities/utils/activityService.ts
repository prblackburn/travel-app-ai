import { eq, and, desc, asc } from 'drizzle-orm';

import { db } from '~/db/index.js';
import { activities } from '~/db/schema.js';
import { handleDatabaseError } from '~/shared/utils/errorUtils.js';

import type {
  Activity,
  CreateActivityData,
  UpdateActivityData,
  ActivityFilters,
} from '~/shared/types/index.js';

export async function createActivity(activityData: CreateActivityData): Promise<Activity> {
  try {
    const newActivity = {
      id: crypto.randomUUID(),
      tripId: activityData.tripId,
      name: activityData.name,
      date: activityData.date,
      time: activityData.time ?? null,
      location: activityData.location ?? null,
      notes: activityData.notes ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.insert(activities).values(newActivity).returning();
    return result[0];
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

export async function getActivityById(id: string): Promise<Activity | null> {
  try {
    const result = await db.select().from(activities).where(eq(activities.id, id)).limit(1);
    return result[0] ?? null;
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

export async function getActivitiesByTripId(
  tripId: string,
  filters?: ActivityFilters
): Promise<Activity[]> {
  try {
    // Start with base query
    const baseQuery = db.select().from(activities).where(eq(activities.tripId, tripId));

    // For SQLite with libsql, we need to execute the query directly with ordering
    const sortBy = filters?.sortBy ?? 'date';
    const sortOrder = filters?.sortOrder ?? 'asc';

    if (sortBy === 'date') {
      if (sortOrder === 'asc') {
        return await baseQuery.orderBy(asc(activities.date), asc(activities.time));
      } else {
        return await baseQuery.orderBy(desc(activities.date), desc(activities.time));
      }
    } else if (sortBy === 'time') {
      if (sortOrder === 'asc') {
        return await baseQuery.orderBy(asc(activities.time));
      } else {
        return await baseQuery.orderBy(desc(activities.time));
      }
    } else if (sortBy === 'name') {
      if (sortOrder === 'asc') {
        return await baseQuery.orderBy(asc(activities.name));
      } else {
        return await baseQuery.orderBy(desc(activities.name));
      }
    }

    return await baseQuery.orderBy(asc(activities.date), asc(activities.time));
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

export async function updateActivity(
  id: string,
  updateData: UpdateActivityData
): Promise<Activity> {
  try {
    const updatedData = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    const result = await db
      .update(activities)
      .set(updatedData)
      .where(eq(activities.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error('Activity not found');
    }

    return result[0];
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

export async function deleteActivity(id: string): Promise<void> {
  try {
    await db.delete(activities).where(eq(activities.id, id));
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

export async function getActivitiesCount(tripId: string): Promise<number> {
  try {
    const result = await db.select().from(activities).where(eq(activities.tripId, tripId));
    return result.length;
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

export async function getActivitiesByDateRange(
  tripId: string,
  startDate: string,
  endDate: string
): Promise<Activity[]> {
  try {
    // For SQLite date string comparison, we can use direct comparison
    const result = await db
      .select()
      .from(activities)
      .where(eq(activities.tripId, tripId))
      .orderBy(asc(activities.date), asc(activities.time));

    // Filter in memory for date range since SQLite date comparison with gte/lte is complex
    return result.filter(activity => 
      activity.date >= startDate && activity.date <= endDate
    );
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

export async function checkTimeConflict(
  tripId: string,
  date: string,
  time: string,
  excludeActivityId?: string
): Promise<Activity | null> {
  try {
    const result = await db
      .select()
      .from(activities)
      .where(
        and(eq(activities.tripId, tripId), eq(activities.date, date), eq(activities.time, time))
      )
      .limit(1);

    const activity = result[0] ?? null;
    
    // If we found an activity and we're excluding a specific ID, check if it's the same
    if (activity && excludeActivityId && activity.id === excludeActivityId) {
      return null; // Don't count as conflict if it's the same activity being updated
    }

    return activity;
  } catch (error) {
    throw handleDatabaseError(error);
  }
}
