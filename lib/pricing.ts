import { Product } from './types';

const hash = (value: string) =>
  value.split('').reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);

export function getDynamicDiscountPercent(product: Product): number {
  const seed = Math.abs(hash(product.id || product._id || product.name));
  return 10 + (seed % 31);
}

export function getDynamicOriginalPrice(product: Product): number {
  const discount = getDynamicDiscountPercent(product);
  const rawOriginal = product.price / (1 - discount / 100);
  return Math.ceil(rawOriginal / 10) * 10;
}

export function getDiscountBadge(product: Product): string {
  return `🔥 ${getDynamicDiscountPercent(product)}% OFF`;
}
