import { isValidDateString } from '~/shared/utils/dateUtils.js';
import { createAppError, ERROR_CODES } from '~/shared/utils/errorUtils.js';

import type { CreateTripData, UpdateTripData, ValidationError } from '~/shared/types/index.js';

export function validateCreateTripData(data: CreateTripData): CreateTripData {
  const errors: ValidationError[] = [];

  // All fields are required for create
  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Trip name is required' });
  } else if (data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Trip name must be at least 2 characters' });
  } else if (data.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Trip name must be less than 100 characters' });
  }

  if (!data.destination?.trim()) {
    errors.push({ field: 'destination', message: 'Destination is required' });
  } else if (data.destination.trim().length < 2) {
    errors.push({ field: 'destination', message: 'Destination must be at least 2 characters' });
  } else if (data.destination.trim().length > 100) {
    errors.push({ field: 'destination', message: 'Destination must be less than 100 characters' });
  }

  if (!data.startDate?.trim()) {
    errors.push({ field: 'startDate', message: 'Start date is required' });
  } else if (!isValidDateString(data.startDate)) {
    errors.push({ field: 'startDate', message: 'Start date must be in YYYY-MM-DD format' });
  }

  if (!data.endDate?.trim()) {
    errors.push({ field: 'endDate', message: 'End date is required' });
  } else if (!isValidDateString(data.endDate)) {
    errors.push({ field: 'endDate', message: 'End date must be in YYYY-MM-DD format' });
  }

  // Validate date range if both dates are valid
  if (
    data.startDate &&
    data.endDate &&
    isValidDateString(data.startDate) &&
    isValidDateString(data.endDate)
  ) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate <= startDate) {
      errors.push({ field: 'endDate', message: 'End date must be after start date' });
    }
  }

  if (data.description && data.description.trim().length > 500) {
    errors.push({ field: 'description', message: 'Description must be less than 500 characters' });
  }

  if (errors.length > 0) {
    throw createAppError('Trip validation failed', ERROR_CODES.VALIDATION_ERROR, { errors });
  }

  return {
    name: data.name.trim(),
    destination: data.destination.trim(),
    startDate: data.startDate,
    endDate: data.endDate,
    description: data.description?.trim() || undefined,
  };
}

export function validateUpdateTripData(data: UpdateTripData): UpdateTripData {
  const errors: ValidationError[] = [];

  // For update operations, we validate what's provided
  if (data.name !== undefined) {
    if (!data.name?.trim()) {
      errors.push({ field: 'name', message: 'Trip name cannot be empty' });
    } else if (data.name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Trip name must be at least 2 characters' });
    } else if (data.name.trim().length > 100) {
      errors.push({ field: 'name', message: 'Trip name must be less than 100 characters' });
    }
  }

  if (data.destination !== undefined) {
    if (!data.destination?.trim()) {
      errors.push({ field: 'destination', message: 'Destination cannot be empty' });
    } else if (data.destination.trim().length < 2) {
      errors.push({ field: 'destination', message: 'Destination must be at least 2 characters' });
    } else if (data.destination.trim().length > 100) {
      errors.push({ field: 'destination', message: 'Destination must be less than 100 characters' });
    }
  }

  if (data.startDate !== undefined) {
    if (!data.startDate?.trim()) {
      errors.push({ field: 'startDate', message: 'Start date cannot be empty' });
    } else if (!isValidDateString(data.startDate)) {
      errors.push({ field: 'startDate', message: 'Start date must be in YYYY-MM-DD format' });
    }
  }

  if (data.endDate !== undefined) {
    if (!data.endDate?.trim()) {
      errors.push({ field: 'endDate', message: 'End date cannot be empty' });
    } else if (!isValidDateString(data.endDate)) {
      errors.push({ field: 'endDate', message: 'End date must be in YYYY-MM-DD format' });
    }
  }

  // Validate date range if both dates are provided and valid
  if (
    data.startDate &&
    data.endDate &&
    isValidDateString(data.startDate) &&
    isValidDateString(data.endDate)
  ) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate <= startDate) {
      errors.push({ field: 'endDate', message: 'End date must be after start date' });
    }
  }

  if (data.description !== undefined && data.description && data.description.trim().length > 500) {
    errors.push({ field: 'description', message: 'Description must be less than 500 characters' });
  }

  if (errors.length > 0) {
    throw createAppError('Trip validation failed', ERROR_CODES.VALIDATION_ERROR, { errors });
  }

  // Return validated data with only provided fields
  const validated: UpdateTripData = {};
  if (data.name !== undefined) validated.name = data.name.trim();
  if (data.destination !== undefined) validated.destination = data.destination.trim();
  if (data.startDate !== undefined) validated.startDate = data.startDate;
  if (data.endDate !== undefined) validated.endDate = data.endDate;
  if (data.description !== undefined) validated.description = data.description?.trim() || undefined;

  return validated;
}

// Legacy function for backward compatibility
export function validateTripData(data: CreateTripData | UpdateTripData): CreateTripData | UpdateTripData {
  // Check if this is CreateTripData (has all required fields) or UpdateTripData
  if ('name' in data && 'destination' in data && 'startDate' in data && 'endDate' in data) {
    return validateCreateTripData(data as CreateTripData);
  } else {
    return validateUpdateTripData(data as UpdateTripData);
  }
}