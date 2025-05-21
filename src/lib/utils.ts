
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, precision: number = 2): string {
  return Number(value).toFixed(precision);
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function getRandomColor(seed?: string): string {
  if (seed) {
    // Generate a consistent color based on the seed
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  }
  
  // Generate a random color
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
}
