import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, listingType: "SALE" | "RENT" = "SALE"): string {
  const formatted = new Intl.NumberFormat("fr-TN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return listingType === "RENT" ? `${formatted} TND/mois` : `${formatted} TND`;
}

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: "Appartement",
  HOUSE: "Maison",
  VILLA: "Villa",
  LAND: "Terrain",
  COMMERCIAL: "Commercial",
};

export const LISTING_TYPE_LABELS: Record<string, string> = {
  SALE: "À Vendre",
  RENT: "À Louer",
};
