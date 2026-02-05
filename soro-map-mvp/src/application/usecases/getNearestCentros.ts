/**
 * @fileoverview Use case for finding nearest distribution centers.
 * 
 * Combines user location with center data to find nearest facilities.
 * This is the main entry point for the geospatial recommendation feature.
 * 
 * @module application/usecases/getNearestCentros
 */

import type { Centro } from '../../domain/models/Centro';
import type { NearestCentroResult, NearestSearchOptions } from '../../domain/models/NearestResult';
import type { Coordinates } from '../../domain/geo/types';
import { isValidCoordinates } from '../../domain/geo/types';
import { rankByDistance } from '../../domain/geo/rankByDistance';
import { createLogger } from '../../infrastructure/logging/logger';

const logger = createLogger('getNearestCentros');

/**
 * Result of the getNearestCentros use case.
 * Uses discriminated union for type-safe error handling.
 */
export type GetNearestCentrosResult =
    | { readonly success: true; readonly results: NearestCentroResult[] }
    | { readonly success: false; readonly error: string };

/**
 * Finds the nearest distribution centers to a user's location.
 * 
 * This use case:
 * 1. Validates user location
 * 2. Validates center data
 * 3. Delegates to rankByDistance for calculations
 * 4. Returns structured result
 * 
 * @param centros - Available distribution centers
 * @param userLocation - User's current coordinates
 * @param options - Optional search configuration
 * @returns Success with ranked results, or failure with error message
 * 
 * @example
 * ```ts
 * const result = getNearestCentros(centros, userLocation, {
 *   limit: 5,
 *   tipoSoro: 'Antibotrópico',
 * });
 * 
 * if (result.success) {
 *   result.results.forEach(r => {
 *     console.log(`${r.centro.nome}: ${r.distanceFormatted}`);
 *   });
 * }
 * ```
 */
export function getNearestCentros(
    centros: Centro[],
    userLocation: Coordinates,
    options?: NearestSearchOptions
): GetNearestCentrosResult {
    logger.info('Finding nearest centers', {
        function: 'getNearestCentros',
        metadata: {
            centrosCount: centros.length,
            hasOptions: options !== undefined,
        },
    });

    // Validate user location
    if (!isValidCoordinates(userLocation)) {
        logger.error('Invalid user location provided', {
            function: 'getNearestCentros',
        });
        return {
            success: false,
            error: 'Localização inválida. Não foi possível determinar sua posição.',
        };
    }

    // Validate centros data
    if (!centros || centros.length === 0) {
        logger.warn('No centers available for search', {
            function: 'getNearestCentros',
        });
        return {
            success: false,
            error: 'Nenhum centro de distribuição disponível.',
        };
    }

    try {
        const results = rankByDistance(centros, userLocation, options);

        logger.info('Search completed successfully', {
            function: 'getNearestCentros',
            metadata: {
                resultsCount: results.length,
            },
        });

        return {
            success: true,
            results,
        };
    } catch (error) {
        logger.error('Error during distance calculation', {
            function: 'getNearestCentros',
            metadata: {
                error: error instanceof Error ? error.message : 'Unknown error',
            },
        });

        return {
            success: false,
            error: 'Erro ao calcular distâncias. Tente novamente.',
        };
    }
}
