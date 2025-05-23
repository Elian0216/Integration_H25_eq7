import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Fonction de l'outil Shadcn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
