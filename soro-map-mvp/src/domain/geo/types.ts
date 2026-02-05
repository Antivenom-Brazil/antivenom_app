/**
 * @fileoverview Coordinates interface and related geo types.
 * 
 * Provides type-safe geographic coordinate handling for the application.
 * All coordinates use WGS84 (standard GPS) format.
 * 
 * @module domain/geo/types
 */

/**
 * Geographic coordinates in WGS84 format.
 * 
 * @property latitude - Latitude in decimal degrees (-90 to 90)
 * @property longitude - Longitude in decimal degrees (-180 to 180)
 */
export interface Coordinates {
    readonly latitude: number;
    readonly longitude: number;
}

/**
 * Type guard to check if an object is valid Coordinates.
 * 
 * @param obj - Object to validate
 * @returns True if object has valid latitude and longitude
 */
export function isValidCoordinates(obj: unknown): obj is Coordinates {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    const coords = obj as Record<string, unknown>;

    return (
        typeof coords.latitude === 'number' &&
        typeof coords.longitude === 'number' &&
        !isNaN(coords.latitude) &&
        !isNaN(coords.longitude) &&
        coords.latitude >= -90 &&
        coords.latitude <= 90 &&
        coords.longitude >= -180 &&
        coords.longitude <= 180
    );
}

/**
 * Creates a validated Coordinates object.
 * Throws if coordinates are invalid.
 * 
 * @param latitude - Latitude value
 * @param longitude - Longitude value
 * @returns Validated Coordinates object
 * @throws Error if coordinates are out of valid range
 */
export function createCoordinates(latitude: number, longitude: number): Coordinates {
    const coords: Coordinates = { latitude, longitude };

    if (!isValidCoordinates(coords)) {
        throw new Error(
            `Invalid coordinates: lat=${latitude}, lng=${longitude}. ` +
            `Latitude must be -90 to 90, longitude must be -180 to 180.`
        );
    }

    return coords;
}
