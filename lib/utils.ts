import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDerivedBackground = (
  background: string | undefined,
): string => {
  if (!background) return "";

  return /^'?https?:/.test(background) ? `url(${background})` : background;
};

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
