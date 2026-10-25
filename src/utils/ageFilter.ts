import { Product } from '../types';

export const AGE_FILTER_OPTIONS = [
  'All Ages',
  '0-3M',
  '3-6M',
  '1-2Y',
  '3-5Y',
  '5Y+',
] as const;

export type AgeFilterOption = typeof AGE_FILTER_OPTIONS[number];

/**
 * Checks whether a given product matches the selected age-group filter.
 * Inspects product.sizes, product.ageGroup, product.category, and title.
 */
export function matchesAgeGroup(product: Product, ageFilter: string): boolean {
  if (!ageFilter || ageFilter === 'All Ages' || ageFilter === 'All') {
    return true;
  }

  const sizes = (product.sizes || []).map((s) => s.trim().toUpperCase());
  const ageGroupStr = (product.ageGroup || '').toLowerCase();
  const titleStr = (product.title || '').toLowerCase();
  const catStr = (product.category || '').toLowerCase();

  switch (ageFilter) {
    case '0-3M':
      return (
        sizes.some((s) => s === 'NB' || s === 'NEWBORN' || s.includes('0-3') || s === '0-3M') ||
        ageGroupStr.includes('0-3') ||
        ageGroupStr.includes('newborn') ||
        ageGroupStr.includes('0 - 6') ||
        catStr.includes('newborn') ||
        titleStr.includes('newborn') ||
        titleStr.includes('romper')
      );

    case '3-6M':
      return (
        sizes.some((s) => s.includes('3-6') || s === '6M' || s.includes('6-12') || s.includes('6-9')) ||
        ageGroupStr.includes('3-6') ||
        ageGroupStr.includes('0 - 12') ||
        ageGroupStr.includes('0 - 6') ||
        ageGroupStr.includes('months') ||
        catStr.includes('baby')
      );

    case '1-2Y':
      return (
        sizes.some((s) => s.includes('1-2') || s.includes('12-18') || s.includes('18-24') || s.includes('2-3')) ||
        ageGroupStr.includes('1 - 2') ||
        ageGroupStr.includes('1 - 6') ||
        ageGroupStr.includes('1-3') ||
        ageGroupStr.includes('toddler') ||
        titleStr.includes('baba suit')
      );

    case '3-5Y':
      return (
        sizes.some((s) => s.includes('2-3') || s.includes('3-4') || s.includes('4-5') || s.includes('3-5')) ||
        ageGroupStr.includes('2 - 8') ||
        ageGroupStr.includes('3 - 5') ||
        ageGroupStr.includes('1 - 6') ||
        ageGroupStr.includes('4-5')
      );

    case '5Y+':
      return (
        sizes.some((s) =>
          ['5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y', '5Y', '6Y', '7Y', '8Y', '9Y', '10Y'].includes(s) ||
          s.includes('5-6') ||
          s.includes('6-7') ||
          s.includes('7-8')
        ) ||
        ageGroupStr.includes('5 -') ||
        ageGroupStr.includes('6 - 8') ||
        ageGroupStr.includes('2 - 8') ||
        ageGroupStr.includes('8 years') ||
        ageGroupStr.includes('6 years')
      );

    default:
      return true;
  }
}
