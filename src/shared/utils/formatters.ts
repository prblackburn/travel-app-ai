import { formatDateForDisplay, formatTimeForDisplay, getDaysBetween } from './dateUtils.js';

import type { Trip, Activity } from '../types/index.js';

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

export function formatTripDateRange(startDate: string, endDate: string): string {
  const start = formatDateForDisplay(startDate);
  const end = formatDateForDisplay(endDate);

  if (startDate === endDate) {
    return start;
  }

  return `${start} - ${end}`;
}

export function formatDateRange(startDate: string, endDate: string): string {
  return formatTripDateRange(startDate, endDate);
}

export function formatActivityDateTime(date: string, time?: string): string {
  const formattedDate = formatDateForDisplay(date);

  if (time) {
    const formattedTime = formatTimeForDisplay(time);
    return `${formattedDate} at ${formattedTime}`;
  }

  return formattedDate;
}

export function formatQuantity(quantity: number, singular: string, plural?: string): string {
  const pluralForm = plural ?? `${singular}s`;

  if (quantity === 1) {
    return `1 ${singular}`;
  }

  return `${quantity} ${pluralForm}`;
}

export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatDisplayText(text: string): string {
  if (!text) return '';
  return text.trim().charAt(0).toUpperCase() + text.trim().slice(1);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

export function formatList(items: string[], conjunction = 'and'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);

  return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatInitials(name: string): string {
  if (!name) return '';

  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

export function formatTripSummary(trip: Trip): string {
  const duration = formatTripDuration(trip.startDate, trip.endDate);
  return `${trip.destination} • ${duration}`;
}

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

export function formatSearchQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function formatSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}
