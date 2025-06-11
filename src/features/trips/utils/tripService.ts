import { eq } from 'drizzle-orm';

import { db } from '~/db/index.js';
import { trips } from '~/db/schema.js';
import { handleDatabaseError } from '~/shared/utils/errorUtils.js';

import { validateTripData } from './tripValidation.js';

import type { Trip, CreateTripData, UpdateTripData } from '~/shared/types/index.js';

export async function getAllTrips(): Promise<Trip[]> {
  try {
    const result = await db.select().from(trips).orderBy(trips.startDate);
    return result;
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

export async function getTripById(id: string): Promise<Trip | null> {
  try {
    const result = await db.select().from(trips).where(eq(trips.id, id)).limit(1);
    return result[0] ?? null;
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

export async function createTrip(tripData: CreateTripData): Promise<Trip> {
  try {
    const validatedData = validateTripData(tripData);
    const result = await db
      .insert(trips)
      .values({
        id: crypto.randomUUID(),
        name: validatedData.name,
        destination: validatedData.destination,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        description: validatedData.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();
    return result[0];
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

export async function updateTrip(id: string, tripData: UpdateTripData): Promise<Trip> {
  try {
    const validatedData = validateTripData(tripData);
    const result = await db
      .update(trips)
      .set({
        name: validatedData.name,
        destination: validatedData.destination,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        description: validatedData.description,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(trips.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error(`Trip with id ${id} not found`);
    }

    return result[0];
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

export async function deleteTrip(id: string): Promise<void> {
  try {
    const result = await db.delete(trips).where(eq(trips.id, id)).returning();

    if (result.length === 0) {
      throw new Error(`Trip with id ${id} not found`);
    }
  } catch (error) {
    throw handleDatabaseError(error);
  }
}
