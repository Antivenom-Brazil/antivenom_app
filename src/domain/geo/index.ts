/**
 * @fileoverview Geo module exports.
 * 
 * Re-exports all geo-related functionality for clean imports.
 * 
 * @module domain/geo
 */

export { type Coordinates, isValidCoordinates, createCoordinates } from './types';
export { haversineDistance, formatDistance } from './haversineDistance';
export { rankByDistance } from './rankByDistance';
