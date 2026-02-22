import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};