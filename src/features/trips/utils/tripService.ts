import { eq } from 'drizzle-orm';

import { db } from '~/db/index.js';
import { trips } from '~/db/schema.js';
import { handleDatabaseError } from '~/shared/utils/errorUtils.js';

import { validateCreateTripData, validateUpdateTripData } from './tripValidation.js';

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
    const validatedData = validateCreateTripData(tripData);

    const newTrip = {
      id: crypto.randomUUID(),
      name: validatedData.name,
      destination: validatedData.destination,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      description: validatedData.description ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.insert(trips).values(newTrip).returning();
    return result[0];
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

export async function updateTrip(id: string, tripData: UpdateTripData): Promise<Trip> {
  try {
    const validatedData = validateUpdateTripData(tripData);

    // Build update object with only provided fields
    const updateFields: any = {
      updatedAt: new Date().toISOString(),
    };

    if (validatedData.name !== undefined) updateFields.name = validatedData.name;
    if (validatedData.destination !== undefined)
      updateFields.destination = validatedData.destination;
    if (validatedData.startDate !== undefined) updateFields.startDate = validatedData.startDate;
    if (validatedData.endDate !== undefined) updateFields.endDate = validatedData.endDate;
    if (validatedData.description !== undefined)
      updateFields.description = validatedData.description;

    const result = await db.update(trips).set(updateFields).where(eq(trips.id, id)).returning();

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
