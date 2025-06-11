import { isValidDateString } from '~/shared/utils/dateUtils.js';

import type { CreateTripData, UpdateTripData } from '~/shared/types/index.js';

export interface TripValidationError {
  field: string;
  message: string;
}

export function validateTripData(
  data: CreateTripData | UpdateTripData
): CreateTripData | UpdateTripData {
  const errors: TripValidationError[] = [];

  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Trip name is required' });
  }

  if (!data.destination?.trim()) {
    errors.push({ field: 'destination', message: 'Destination is required' });
  }

  if (!data.startDate) {
    errors.push({ field: 'startDate', message: 'Start date is required' });
  } else if (!isValidDateString(data.startDate)) {
    errors.push({ field: 'startDate', message: 'Start date must be in YYYY-MM-DD format' });
  }

  if (!data.endDate) {
    errors.push({ field: 'endDate', message: 'End date is required' });
  } else if (!isValidDateString(data.endDate)) {
    errors.push({ field: 'endDate', message: 'End date must be in YYYY-MM-DD format' });
  }

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

  if (errors.length > 0) {
    const errorMessage = errors.map(e => `${e.field}: ${e.message}`).join(', ');
    throw new Error(`Validation failed: ${errorMessage}`);
  }

  const validated = {
    name: data.name?.trim() ?? '',
    destination: data.destination?.trim() ?? '',
    startDate: data.startDate ?? '',
    endDate: data.endDate ?? '',
    description: data.description?.trim() ?? null,
  };
  
  return validated as CreateTripData | UpdateTripData;
}

