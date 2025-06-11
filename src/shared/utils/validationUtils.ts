import {
  isValidDateString,
  isValidTimeString,
  isValidDateRange,
  isDateInRange,
  isPastDate,
} from './dateUtils.js';
import { createValidationError } from './errorUtils.js';

import type {
  CreateTripData,
  UpdateTripData,
  CreateActivityData,
  UpdateActivityData,
  ValidationError,
  DateRange,
  Trip,
  Activity,
} from '../types/index.js';

export function validateRequiredString(
  value: string | undefined,
  fieldName: string
): ValidationError | null {
  if (!value || value.trim().length === 0) {
    return createValidationError(fieldName, `${fieldName} is required`);
  }
  return null;
}

export function validateStringLength(
  value: string | undefined,
  fieldName: string,
  minLength = 0,
  maxLength = 255
): ValidationError | null {
  if (!value) return null;

  if (value.length < minLength) {
    return createValidationError(
      fieldName,
      `${fieldName} must be at least ${minLength} characters long`
    );
  }

  if (value.length > maxLength) {
    return createValidationError(
      fieldName,
      `${fieldName} must be no more than ${maxLength} characters long`
    );
  }

  return null;
}

export function validatePositiveInteger(
  value: number | undefined,
  fieldName: string
): ValidationError | null {
  if (value === undefined) return null;

  if (!Number.isInteger(value) || value <= 0) {
    return createValidationError(fieldName, `${fieldName} must be a positive integer`);
  }

  return null;
}

export function validateCreateTripData(data: CreateTripData): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameError = validateRequiredString(data.name, 'name');
  if (nameError) errors.push(nameError);

  const destinationError = validateRequiredString(data.destination, 'destination');
  if (destinationError) errors.push(destinationError);

  const nameLengthError = validateStringLength(data.name, 'name', 1, 100);
  if (nameLengthError) errors.push(nameLengthError);

  const destinationLengthError = validateStringLength(data.destination, 'destination', 1, 100);
  if (destinationLengthError) errors.push(destinationLengthError);

  const descriptionLengthError = validateStringLength(data.description ?? undefined, 'description', 0, 1000);
  if (descriptionLengthError) errors.push(descriptionLengthError);

  if (!isValidDateString(data.startDate)) {
    errors.push(createValidationError('startDate', 'Start date must be in YYYY-MM-DD format'));
  }

  if (!isValidDateString(data.endDate)) {
    errors.push(createValidationError('endDate', 'End date must be in YYYY-MM-DD format'));
  }

  if (isValidDateString(data.startDate) && isValidDateString(data.endDate)) {
    if (!isValidDateRange(data.startDate, data.endDate)) {
      errors.push(createValidationError('endDate', 'End date must be after start date'));
    }
  }

  return errors;
}

export function validateUpdateTripData(data: UpdateTripData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.name !== undefined) {
    const nameError = validateRequiredString(data.name, 'name');
    if (nameError) errors.push(nameError);

    const nameLengthError = validateStringLength(data.name, 'name', 1, 100);
    if (nameLengthError) errors.push(nameLengthError);
  }

  if (data.destination !== undefined) {
    const destinationError = validateRequiredString(data.destination, 'destination');
    if (destinationError) errors.push(destinationError);

    const destinationLengthError = validateStringLength(data.destination, 'destination', 1, 100);
    if (destinationLengthError) errors.push(destinationLengthError);
  }

  if (data.description !== undefined) {
    const descriptionLengthError = validateStringLength(data.description ?? undefined, 'description', 0, 1000);
    if (descriptionLengthError) errors.push(descriptionLengthError);
  }

  if (data.startDate !== undefined && !isValidDateString(data.startDate)) {
    errors.push(createValidationError('startDate', 'Start date must be in YYYY-MM-DD format'));
  }

  if (data.endDate !== undefined && !isValidDateString(data.endDate)) {
    errors.push(createValidationError('endDate', 'End date must be in YYYY-MM-DD format'));
  }

  if (data.startDate && data.endDate) {
    if (!isValidDateRange(data.startDate, data.endDate)) {
      errors.push(createValidationError('endDate', 'End date must be after start date'));
    }
  }

  return errors;
}

export function validateCreateActivityData(
  data: CreateActivityData,
  tripDateRange: DateRange
): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameError = validateRequiredString(data.name, 'name');
  if (nameError) errors.push(nameError);

  const nameLengthError = validateStringLength(data.name, 'name', 1, 100);
  if (nameLengthError) errors.push(nameLengthError);

  const locationLengthError = validateStringLength(data.location, 'location', 0, 100);
  if (locationLengthError) errors.push(locationLengthError);

  const notesLengthError = validateStringLength(data.notes, 'notes', 0, 1000);
  if (notesLengthError) errors.push(notesLengthError);

  if (!isValidDateString(data.date)) {
    errors.push(createValidationError('date', 'Date must be in YYYY-MM-DD format'));
  } else if (!isDateInRange(data.date, tripDateRange)) {
    errors.push(createValidationError('date', 'Activity date must be within trip date range'));
  }

  if (data.time && !isValidTimeString(data.time)) {
    errors.push(createValidationError('time', 'Time must be in HH:MM format'));
  }

  return errors;
}

export function validateUpdateActivityData(
  data: UpdateActivityData,
  tripDateRange: DateRange
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.name !== undefined) {
    const nameError = validateRequiredString(data.name, 'name');
    if (nameError) errors.push(nameError);

    const nameLengthError = validateStringLength(data.name, 'name', 1, 100);
    if (nameLengthError) errors.push(nameLengthError);
  }

  if (data.location !== undefined) {
    const locationLengthError = validateStringLength(data.location, 'location', 0, 100);
    if (locationLengthError) errors.push(locationLengthError);
  }

  if (data.notes !== undefined) {
    const notesLengthError = validateStringLength(data.notes, 'notes', 0, 1000);
    if (notesLengthError) errors.push(notesLengthError);
  }

  if (data.date !== undefined) {
    if (!isValidDateString(data.date)) {
      errors.push(createValidationError('date', 'Date must be in YYYY-MM-DD format'));
    } else if (!isDateInRange(data.date, tripDateRange)) {
      errors.push(createValidationError('date', 'Activity date must be within trip date range'));
    }
  }

  if (data.time !== undefined && !isValidTimeString(data.time)) {
    errors.push(createValidationError('time', 'Time must be in HH:MM format'));
  }

  return errors;
}

export function validateActivityTimeConflict(
  newActivity: CreateActivityData | UpdateActivityData,
  existingActivities: Activity[],
  excludeActivityId?: string
): ValidationError | null {
  if (!newActivity.time || !newActivity.date) return null;

  const conflicts = existingActivities.filter(activity => {
    if (excludeActivityId && activity.id === excludeActivityId) return false;
    return activity.date === newActivity.date && activity.time === newActivity.time;
  });

  if (conflicts.length > 0) {
    return createValidationError(
      'time',
      `Time conflicts with existing activity: ${conflicts[0].name}`
    );
  }

  return null;
}

export function validateTripNameUniqueness(
  name: string,
  existingTrips: Trip[],
  excludeTripId?: string
): ValidationError | null {
  const trimmedName = name.trim().toLowerCase();

  const conflicts = existingTrips.filter(trip => {
    if (excludeTripId && trip.id === excludeTripId) return false;
    return trip.name.trim().toLowerCase() === trimmedName;
  });

  if (conflicts.length > 0) {
    return createValidationError('name', 'A trip with this name already exists');
  }

  return null;
}

export function validateFutureTripDates(
  startDate: string,
  allowPastDates = false
): ValidationError | null {
  if (allowPastDates) return null;

  if (isPastDate(startDate)) {
    return createValidationError('startDate', 'Trip start date cannot be in the past');
  }

  return null;
}

export function validateEmail(email: string): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return createValidationError('email', 'Please enter a valid email address');
  }

  return null;
}

export function validateUrl(url: string): ValidationError | null {
  try {
    new URL(url);
    return null;
  } catch {
    return createValidationError('url', 'Please enter a valid URL');
  }
}

export function validateData<T>(
  data: T,
  validators: Array<(data: T) => ValidationError[]>
): ValidationError[] {
  return validators.reduce((errors, validator) => {
    return errors.concat(validator(data));
  }, [] as ValidationError[]);
}

export function hasValidationErrors(errors: ValidationError[]): boolean {
  return errors.length > 0;
}

export function getFieldErrors(errors: ValidationError[], fieldName: string): string[] {
  return errors.filter(error => error.field === fieldName).map(error => error.message);
}

export function formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  errors.forEach(error => {
    if (!formatted[error.field]) {
      formatted[error.field] = [];
    }
    formatted[error.field].push(error.message);
  });

  return formatted;
}

