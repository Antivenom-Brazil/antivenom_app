/**
 * @fileoverview Ranking algorithm for finding nearest facilities.
 * 
 * Provides functionality to rank distribution centers by distance
 * from a user's location, with support for filtering.
 * 
 * @module domain/geo/rankByDistance
 */

import type { Centro } from '../models/Centro';
import type { NearestCentroResult, NearestSearchOptions } from '../models/NearestResult';
import { DEFAULT_SEARCH_OPTIONS } from '../models/NearestResult';
import type { Coordinates } from './types';
import { haversineDistance, formatDistance } from './haversineDistance';
import { createLogger } from '../../infrastructure/logging/logger';

const logger = createLogger('rankByDistance');

/**
 * Calculates distance for a single centro.
 * Pure function for testability.
 */
function calculateCentroDistance(
    centro: Centro,
    userLocation: Coordinates
): NearestCentroResult {
    const centroLocation: Coordinates = {
        latitude: centro.latitude,
        longitude: centro.longitude,
    };

    const distanceKm = haversineDistance(userLocation, centroLocation);

    return {
        centro,
        distanceKm,
        distanceFormatted: formatDistance(distanceKm),
    };
}

/**
 * Applies UF filter to results.
 */
function filterByUf(
    results: NearestCentroResult[],
    uf?: string
): NearestCentroResult[] {
    if (!uf) return results;
    return results.filter((r) => r.centro.uf === uf);
}

/**
 * Applies tipo de soro filter to results.
 */
function filterByTipoSoro(
    results: NearestCentroResult[],
    tipoSoro?: string
): NearestCentroResult[] {
    if (!tipoSoro) return results;
    return results.filter((r) => r.centro.tiposSoro.includes(tipoSoro));
}

/**
 * Applies maximum radius filter to results.
 */
function filterByRadius(
    results: NearestCentroResult[],
    maxRadiusKm?: number
): NearestCentroResult[] {
    if (maxRadiusKm === undefined) return results;
    return results.filter((r) => r.distanceKm <= maxRadiusKm);
}

/**
 * Sorts results by distance (ascending).
 * Creates a new array, does not mutate input.
 */
function sortByDistance(results: NearestCentroResult[]): NearestCentroResult[] {
    return [...results].sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Ranks distribution centers by distance from user location.
 * 
 * This function:
 * 1. Calculates distance from user to each centro
 * 2. Applies optional filters (UF, tipo de soro)
 * 3. Filters by maximum radius if specified
 * 4. Sorts by distance (nearest first)
 * 5. Limits to top N results
 * 
 * @param centros - List of available distribution centers
 * @param userLocation - User's current location
 * @param options - Optional search configuration
 * @returns Ranked list of nearest centers with distances
 * 
 * @example
 * ```ts
 * const results = rankByDistance(centros, userLocation, {
 *   limit: 5,
 *   maxRadiusKm: 100,
 *   tipoSoro: 'Antibotrópico',
 * });
 * ```
 */
export function rankByDistance(
    centros: Centro[],
    userLocation: Coordinates,
    options: NearestSearchOptions = {}
): NearestCentroResult[] {
    const {
        limit = DEFAULT_SEARCH_OPTIONS.limit,
        maxRadiusKm,
        tipoSoro,
        uf,
    } = options;

    logger.debug('Starting distance ranking', {
        function: 'rankByDistance',
        metadata: {
            totalCentros: centros.length,
            limit,
            hasMaxRadius: maxRadiusKm !== undefined,
            hasFilters: !!(tipoSoro || uf),
        },
    });

    // Step 1: Calculate distances for all centros
    let results = centros.map((centro) =>
        calculateCentroDistance(centro, userLocation)
    );

    // Step 2: Apply filters (order doesn't matter for correctness)
    results = filterByUf(results, uf);
    results = filterByTipoSoro(results, tipoSoro);
    results = filterByRadius(results, maxRadiusKm);

    // Step 3: Sort by distance
    results = sortByDistance(results);

    // Step 4: Apply limit
    const finalResults = results.slice(0, limit);

    logger.debug('Distance ranking complete', {
        function: 'rankByDistance',
        metadata: {
            totalResults: finalResults.length,
            nearestDistance: finalResults[0]?.distanceKm.toFixed(1) ?? 'N/A',
        },
    });

    return finalResults;
}
