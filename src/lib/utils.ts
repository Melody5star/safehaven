
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Coordinates } from "@/services/geolocation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculates the distance between two geographical coordinates using the Haversine formula.
 * @param coords1 The first set of coordinates.
 * @param coords2 The second set of coordinates.
 * @returns The distance in kilometers.
 */
export function calculateDistance(coords1: Coordinates, coords2: Coordinates): number {
  const R = 6371; // Radius of the Earth in kilometers

  const lat1 = coords1.latitude;
  const lon1 = coords1.longitude;
  const lat2 = coords2.latitude;
  const lon2 = coords2.longitude;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
}
