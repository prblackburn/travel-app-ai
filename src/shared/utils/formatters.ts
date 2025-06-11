/**
 * General formatting utilities for common data types
 * Provides consistent formatting across the application
 */

import { formatDateForDisplay, formatTimeForDisplay, getDaysBetween } from './dateUtils.js';

import type { PackingProgress, Trip, Activity, PackingItem } from '../types/index.js';

/**
 * Formats a trip duration as human-readable text
 */
export function formatTripDuration(startDate: string, endDate: string): string {
  const days = getDaysBetween(startDate, endDate);

  if (days === 0) {
    return 'Same day';
  } else if (days === 1) {
    return '1 day';
  } else {
    return `${days} days`;
  }
}

/**
 * Formats trip dates as a range string
 */
export function formatTripDateRange(startDate: string, endDate: string): string {
  const start = formatDateForDisplay(startDate);
  const end = formatDateForDisplay(endDate);

  if (startDate === endDate) {
    return start;
  }

  return `${start} - ${end}`;
}

/**
 * Formats activity date and time together
 */
export function formatActivityDateTime(date: string, time?: string): string {
  const formattedDate = formatDateForDisplay(date);

  if (time) {
    const formattedTime = formatTimeForDisplay(time);
    return `${formattedDate} at ${formattedTime}`;
  }

  return formattedDate;
}

/**
 * Formats packing progress as percentage text
 */
export function formatPackingProgress(progress: PackingProgress): string {
  if (progress.totalItems === 0) {
    return 'No items';
  }

  return `${progress.packedItems}/${progress.totalItems} (${progress.percentage}%)`;
}

/**
 * Formats quantity with proper singular/plural form
 */
export function formatQuantity(quantity: number, singular: string, plural?: string): string {
  const pluralForm = plural ?? `${singular}s`;

  if (quantity === 1) {
    return `1 ${singular}`;
  }

  return `${quantity} ${pluralForm}`;
}

/**
 * Formats packing item with quantity
 */
export function formatPackingItemName(item: PackingItem): string {
  if (item.quantity === 1) {
    return item.name;
  }

  return `${item.name} (${item.quantity})`;
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formats text for display by capitalizing and trimming
 */
export function formatDisplayText(text: string): string {
  if (!text) return '';
  return text.trim().charAt(0).toUpperCase() + text.trim().slice(1);
}

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Formats a list of items with proper conjunction
 * Example: ["apple", "banana", "cherry"] => "apple, banana, and cherry"
 */
export function formatList(items: string[], conjunction = 'and'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);

  return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
}

/**
 * Formats packing categories for display
 */
export function formatPackingCategories(categories: string[]): string {
  const uniqueCategories = [...new Set(categories)].filter(Boolean);

  if (uniqueCategories.length === 0) return 'No categories';

  return formatList(uniqueCategories.map(capitalize));
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Formats a name for initials (e.g., "John Doe" => "JD")
 */
export function formatInitials(name: string): string {
  if (!name) return '';

  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

/**
 * Formats a trip summary for quick display
 */
export function formatTripSummary(trip: Trip): string {
  const duration = formatTripDuration(trip.startDate, trip.endDate);
  return `${trip.destination} • ${duration}`;
}

/**
 * Formats activity summary for lists
 */
export function formatActivitySummary(activity: Activity): string {
  const parts: string[] = [];

  if (activity.time) {
    parts.push(formatTimeForDisplay(activity.time));
  }

  if (activity.location) {
    parts.push(activity.location);
  }

  if (parts.length === 0) {
    return activity.name;
  }

  return `${activity.name} • ${parts.join(' • ')}`;
}

/**
 * Formats relative time (e.g., "2 days ago", "in 3 days")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays === 1) return 'Yesterday';
    if (absDays < 7) return `${absDays} days ago`;
    if (absDays < 30) return `${Math.floor(absDays / 7)} weeks ago`;
    return formatDateForDisplay(dateString);
  } else if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays < 7) {
    return `In ${diffDays} days`;
  } else if (diffDays < 30) {
    return `In ${Math.floor(diffDays / 7)} weeks`;
  } else {
    return formatDateForDisplay(dateString);
  }
}

/**
 * Formats search query for display (removes extra spaces, capitalizes)
 */
export function formatSearchQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Formats URL slug from text (lowercase, hyphens, alphanumeric only)
 */
export function formatSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Formats currency amount (placeholder for future use)
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats percentage with proper decimal places
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}
