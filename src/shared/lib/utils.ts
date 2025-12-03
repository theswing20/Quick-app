import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDate(isoDate: string): string{
  const date = new Date(isoDate);
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return formatter.format(date).replace(/\//g, '.');
};

export function formatTime(isoDate: string): string{
  const date = new Date(isoDate);
  const formatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return formatter.format(date);
};

export function formatDateTime(isoDate: string): string{
  return `${formatDate(isoDate)} ${formatTime(isoDate)}`;
};