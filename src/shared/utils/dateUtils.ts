/**
 * Date utility functions for travel app
 * Handles date formatting, validation, and comparison operations
 */

import type { DateRange } from '../types/index.js';

/**
 * Formats a date to YYYY-MM-DD format (database format)
 */
export function formatDateForDatabase(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Formats a date to human-readable format (e.g., "March 15, 2024")
 */
export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a date to short format (e.g., "Mar 15")
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats time from HH:MM to 12-hour format (e.g., "2:30 PM")
 */
export function formatTimeForDisplay(timeString: string): string {
  if (!timeString) return '';

  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Validates if a date string is in YYYY-MM-DD format and is a valid date
 */
export function isValidDateString(dateString: string): boolean {
  if (!dateString) return false;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === formatDateForDatabase(date);
}

/**
 * Validates if a time string is in HH:MM format (24-hour)
 */
export function isValidTimeString(timeString: string): boolean {
  if (!timeString) return true; // Time is optional

  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
}

/**
 * Validates that end date is after start date
 */
export function isValidDateRange(startDate: string, endDate: string): boolean {
  if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
    return false;
  }

  return new Date(startDate) <= new Date(endDate);
}

/**
 * Checks if a date falls within a given date range (inclusive)
 */
export function isDateInRange(date: string, range: DateRange): boolean {
  if (
    !isValidDateString(date) ||
    !isValidDateString(range.start) ||
    !isValidDateString(range.end)
  ) {
    return false;
  }

  const checkDate = new Date(date);
  const startDate = new Date(range.start);
  const endDate = new Date(range.end);

  return checkDate >= startDate && checkDate <= endDate;
}

/**
 * Compares two dates and returns -1, 0, or 1
 */
export function compareDates(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

/**
 * Compares two times and returns -1, 0, or 1
 */
export function compareTimes(time1: string, time2: string): number {
  if (!time1 && !time2) return 0;
  if (!time1) return -1;
  if (!time2) return 1;

  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);

  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;

  if (minutes1 < minutes2) return -1;
  if (minutes1 > minutes2) return 1;
  return 0;
}

/**
 * Gets the current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return formatDateForDatabase(new Date());
}

/**
 * Gets the current time in HH:MM format
 */
export function getCurrentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * Calculates the number of days between two dates
 */
export function getDaysBetween(startDate: string, endDate: string): number {
  if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
    return 0;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Gets all dates in a range as an array of YYYY-MM-DD strings
 */
export function getDatesInRange(startDate: string, endDate: string): string[] {
  if (!isValidDateRange(startDate, endDate)) {
    return [];
  }

  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(formatDateForDatabase(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Checks if a date is today
 */
export function isToday(dateString: string): boolean {
  return dateString === getCurrentDate();
}

/**
 * Checks if a date is in the past
 */
export function isPastDate(dateString: string): boolean {
  if (!isValidDateString(dateString)) return false;
  return compareDates(dateString, getCurrentDate()) < 0;
}

/**
 * Checks if a date is in the future
 */
export function isFutureDate(dateString: string): boolean {
  if (!isValidDateString(dateString)) return false;
  return compareDates(dateString, getCurrentDate()) > 0;
}

// Aliases for commonly used functions
export const isValidDate = isValidDateString;
export const isValidTime = isValidTimeString;
export const formatDate = formatDateForDisplay;
export const formatTime = formatTimeForDisplay;
