import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format salary for display
export function formatSalary(value: number): string {
  return `$${value.toLocaleString()}`;
}

// Format percentage with + sign for positive values
export function formatPercentage(value: number): string {
  return value > 0 ? `+${value}%` : `${value}%`;
}

// Calculate percentage change between two values
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

// Format date to MM/DD/YYYY
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
}

// Format number with K, M, B suffixes
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Get status class for skill gaps 
export function getSkillGapStatusClass(status: string) {
  switch (status) {
    case 'shortage':
      return {
        text: 'Talent shortage',
        textColor: 'text-red-600',
        badgeColor: 'bg-red-100 text-red-800'
      };
    case 'surplus':
      return {
        text: 'Talent surplus',
        textColor: 'text-green-600',
        badgeColor: 'bg-green-100 text-green-800'
      };
    case 'balanced':
      return {
        text: 'Supply meets demand',
        textColor: 'text-blue-600',
        badgeColor: 'bg-blue-100 text-blue-800'
      };
    default:
      return {
        text: 'Unknown',
        textColor: 'text-gray-600',
        badgeColor: 'bg-gray-100 text-gray-800'
      };
  }
}
