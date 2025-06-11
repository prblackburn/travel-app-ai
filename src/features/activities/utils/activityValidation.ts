import { isValidDate, isValidTime, formatDate } from '~/shared/utils/dateUtils.js';
import { createAppError } from '~/shared/utils/errorUtils.js';

import type {
  CreateActivityData,
  UpdateActivityData,
  ValidationError,
  DateRange,
} from '~/shared/types/index.js';

export function validateActivityData(
  data: CreateActivityData,
  tripDateRange: DateRange
): CreateActivityData {
  const errors: ValidationError[] = [];

  // Required field validation
  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Activity name is required' });
  } else if (data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Activity name must be at least 2 characters' });
  } else if (data.name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Activity name must be less than 100 characters' });
  }

  if (!data.tripId?.trim()) {
    errors.push({ field: 'tripId', message: 'Trip ID is required' });
  }

  if (!data.date?.trim()) {
    errors.push({ field: 'date', message: 'Date is required' });
  } else if (!isValidDate(data.date)) {
    errors.push({ field: 'date', message: 'Date must be in YYYY-MM-DD format' });
  } else {
    // Check if date is within trip date range
    if (data.date < tripDateRange.start) {
      errors.push({
        field: 'date',
        message: `Activity date cannot be before trip start date (${formatDate(tripDateRange.start)})`,
      });
    }

    if (data.date > tripDateRange.end) {
      errors.push({
        field: 'date',
        message: `Activity date cannot be after trip end date (${formatDate(tripDateRange.end)})`,
      });
    }
  }

  // Optional field validation
  if (data.time && !isValidTime(data.time)) {
    errors.push({ field: 'time', message: 'Time must be in HH:MM format' });
  }

  if (data.location && data.location.trim().length > 100) {
    errors.push({ field: 'location', message: 'Location must be less than 100 characters' });
  }

  if (data.notes && data.notes.trim().length > 500) {
    errors.push({ field: 'notes', message: 'Notes must be less than 500 characters' });
  }

  if (errors.length > 0) {
    throw createAppError('Activity validation failed', 'VALIDATION_ERROR', { errors });
  }

  return {
    tripId: data.tripId.trim(),
    name: data.name.trim(),
    date: data.date.trim(),
    time: data.time?.trim() || undefined,
    location: data.location?.trim() || undefined,
    notes: data.notes?.trim() || undefined,
  };
}

export function validateUpdateActivityData(
  data: UpdateActivityData,
  tripDateRange?: DateRange
): UpdateActivityData {
  const errors: ValidationError[] = [];

  // Only validate provided fields for updates
  if (data.name !== undefined) {
    if (!data.name?.trim()) {
      errors.push({ field: 'name', message: 'Activity name cannot be empty' });
    } else if (data.name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Activity name must be at least 2 characters' });
    } else if (data.name.trim().length > 100) {
      errors.push({ field: 'name', message: 'Activity name must be less than 100 characters' });
    }
  }

  if (data.date !== undefined) {
    if (!data.date?.trim()) {
      errors.push({ field: 'date', message: 'Date cannot be empty' });
    } else if (!isValidDate(data.date)) {
      errors.push({ field: 'date', message: 'Date must be in YYYY-MM-DD format' });
    } else if (tripDateRange) {
      // Check if date is within trip date range
      if (data.date < tripDateRange.start) {
        errors.push({
          field: 'date',
          message: `Activity date cannot be before trip start date (${formatDate(tripDateRange.start)})`,
        });
      }

      if (data.date > tripDateRange.end) {
        errors.push({
          field: 'date',
          message: `Activity date cannot be after trip end date (${formatDate(tripDateRange.end)})`,
        });
      }
    }
  }

  if (data.time !== undefined && data.time && !isValidTime(data.time)) {
    errors.push({ field: 'time', message: 'Time must be in HH:MM format' });
  }

  if (data.location !== undefined && data.location && data.location.trim().length > 100) {
    errors.push({ field: 'location', message: 'Location must be less than 100 characters' });
  }

  if (data.notes !== undefined && data.notes && data.notes.trim().length > 500) {
    errors.push({ field: 'notes', message: 'Notes must be less than 500 characters' });
  }

  if (errors.length > 0) {
    throw createAppError('Activity validation failed', 'VALIDATION_ERROR', { errors });
  }

  const cleanedData: UpdateActivityData = {};

  if (data.name !== undefined) {
    cleanedData.name = data.name.trim();
  }
  if (data.date !== undefined) {
    cleanedData.date = data.date.trim();
  }
  if (data.time !== undefined) {
    cleanedData.time = data.time?.trim() || undefined;
  }
  if (data.location !== undefined) {
    cleanedData.location = data.location?.trim() || undefined;
  }
  if (data.notes !== undefined) {
    cleanedData.notes = data.notes?.trim() || undefined;
  }

  return cleanedData;
}

export function validateTimeConflict(
  activities: { id?: string; date: string; time: string | null }[],
  newDate: string,
  newTime: string,
  excludeId?: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  const conflictingActivity = activities.find(
    activity =>
      activity.date === newDate &&
      activity.time === newTime &&
      // Don't check conflict with the activity being updated
      activity.id !== excludeId
  );

  if (conflictingActivity) {
    errors.push({
      field: 'time',
      message: `Time conflict: Another activity is scheduled at ${newTime} on ${formatDate(newDate)}`,
    });
  }

  return errors;
}
