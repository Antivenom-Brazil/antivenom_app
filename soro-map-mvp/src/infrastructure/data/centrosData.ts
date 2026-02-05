/**
 * @fileoverview Data service for loading centros from JSON database.
 *
 * Loads real data from the converted Excel database.
 *
 * @module infrastructure/data/centrosData
 */

import type { Centro } from '../../domain/models/Centro';
import { createLogger } from '../logging/logger';

const logger = createLogger('CentrosData');

/** Cached centros data */
let centrosCache: Centro[] | null = null;

/**
 * Load centros from JSON database.
 * Results are cached after first load.
 */
export async function loadCentros(): Promise<Centro[]> {
    if (centrosCache) {
        return centrosCache;
    }

    try {
        const response = await fetch('/data/centros.json');
        if (!response.ok) {
            throw new Error(`Failed to load centros: ${response.status}`);
        }

        const data = await response.json();
        centrosCache = data as Centro[];
        logger.info(`Loaded ${centrosCache.length} centros from database`);
        return centrosCache;
    } catch (error) {
        logger.error(`Failed to load centros: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
}

/**
 * Get centros synchronously (must call loadCentros first).
 */
export function getCentros(): Centro[] {
    if (!centrosCache) {
        logger.warn('getCentros called before loadCentros');
        return [];
    }
    return centrosCache;
}

/**
 * Find a centro by ID.
 */
export function findCentroById(id: string): Centro | undefined {
    return getCentros().find(c => c.id === id);
}

/**
 * Get unique UFs from the data.
 */
export function getUFs(): string[] {
    const ufs = new Set(getCentros().map(c => c.uf));
    return [...ufs].sort();
}

/**
 * Get unique serum types from the data.
 */
export function getTiposSoro(): string[] {
    const tipos = new Set(getCentros().flatMap(c => c.tiposSoro));
    return [...tipos].sort();
}
