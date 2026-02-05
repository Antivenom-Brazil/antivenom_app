/**
 * @fileoverview Haversine distance calculation for geographic coordinates.
 * 
 * Implements the Haversine formula to calculate the great-circle distance
 * between two points on Earth's surface, accounting for Earth's curvature.
 * 
 * @module domain/geo/haversineDistance
 */

import type { Coordinates } from './types';
import { isValidCoordinates } from './types';

/**
 * Earth's mean radius in kilometers.
 * Used for distance calculations.
 */
const EARTH_RADIUS_KM = 6371;

/**
 * Converts degrees to radians.
 * 
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Calculates the great-circle distance between two geographic points
 * using the Haversine formula.
 * 
 * The Haversine formula is accurate for most practical purposes,
 * with error typically less than 0.3% compared to actual distance.
 * 
 * @param point1 - Origin coordinates
 * @param point2 - Destination coordinates
 * @returns Distance in kilometers
 * @throws Error if either coordinate is invalid
 * 
 * @example
 * ```ts
 * const saoPaulo = { latitude: -23.5505, longitude: -46.6333 };
 * const rio = { latitude: -22.9068, longitude: -43.1729 };
 * const distance = haversineDistance(saoPaulo, rio);
 * console.log(distance); // ~357 km
 * ```
 */
export function haversineDistance(
    point1: Coordinates,
    point2: Coordinates
): number {
    // Validate inputs
    if (!isValidCoordinates(point1)) {
        throw new Error('Invalid origin coordinates');
    }
    if (!isValidCoordinates(point2)) {
        throw new Error('Invalid destination coordinates');
    }

    // Early return for identical points
    if (
        point1.latitude === point2.latitude &&
        point1.longitude === point2.longitude
    ) {
        return 0;
    }

    const dLat = toRadians(point2.latitude - point1.latitude);
    const dLon = toRadians(point2.longitude - point1.longitude);

    const lat1Rad = toRadians(point1.latitude);
    const lat2Rad = toRadians(point2.latitude);

    // Haversine formula
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.asin(Math.sqrt(a));

    return EARTH_RADIUS_KM * c;
}

/**
 * Formats a distance value for user-friendly display.
 * 
 * - Distances < 1km are shown in meters
 * - Distances < 10km have one decimal place
 * - Larger distances are rounded to whole km
 * 
 * @param distanceKm - Distance in kilometers
 * @returns Formatted string with unit
 * 
 * @example
 * ```ts
 * formatDistance(0.5);   // "500 m"
 * formatDistance(5.75);  // "5.8 km"
 * formatDistance(150);   // "150 km"
 * ```
 */
export function formatDistance(distanceKm: number): string {
    if (distanceKm < 0) {
        return '0 m';
    }

    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    }

    if (distanceKm < 10) {
        return `${distanceKm.toFixed(1)} km`;
    }

    return `${Math.round(distanceKm)} km`;
}
