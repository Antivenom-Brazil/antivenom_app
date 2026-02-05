/**
 * @fileoverview Models for nearest facility search results.
 * 
 * Defines interfaces for representing search results when finding
 * the nearest antivenom distribution centers.
 * 
 * @module domain/models/NearestResult
 */

import type { Centro } from './Centro';

/**
 * Represents a single result from a nearest facility search.
 * Combines facility information with calculated distance.
 */
export interface NearestCentroResult {
    /** The distribution center */
    readonly centro: Centro;
    /** Distance from user in kilometers */
    readonly distanceKm: number;
    /** Human-readable formatted distance */
    readonly distanceFormatted: string;
}

/**
 * Options for configuring nearest facility search.
 * All options are optional with sensible defaults.
 */
export interface NearestSearchOptions {
    /**
     * Maximum number of results to return.
     * @default 5
     */
    readonly limit?: number;

    /**
     * Maximum search radius in kilometers.
     * Results beyond this radius are excluded.
     * @default undefined (no limit)
     */
    readonly maxRadiusKm?: number;

    /**
     * Filter by specific antivenom type.
     * Only centers with this type are included.
     */
    readonly tipoSoro?: string;

    /**
     * Filter by state (UF).
     * Only centers in this state are included.
     */
    readonly uf?: string;
}

/**
 * Default search options.
 * Exported for consistent defaults across the application.
 */
export const DEFAULT_SEARCH_OPTIONS: Required<Pick<NearestSearchOptions, 'limit'>> = {
    limit: 5,
} as const;
