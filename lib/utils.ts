import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatCurrency(amount: number): string {
  return formatPrice(amount);
}

export function getDiscountPercentage(
  originalPrice: number,
  currentPrice: number
): number {
  if (!originalPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    girlfriend: 'Girlfriend',
    kids: 'Kids',
    friends: 'Friends',
    family: 'Family',
  };
  return labels[category] || category;
}

export function getBestForLabel(label: string): string {
  const labels: Record<string, string> = {
    girlfriend: 'Girlfriend',
    kids: 'Kids',
    sister: 'Sister',
    friend: 'Friend',
  };
  return labels[label] || label;
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function calculateTax(subtotal: number, taxRate: number = 0.12): number {
  return Math.round(subtotal * taxRate);
}

export function calculateShipping(subtotal: number): number {
  if (subtotal > 999) return 0;
  return 50;
}
