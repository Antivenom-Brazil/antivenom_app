/**
 * @fileoverview React hook for finding nearest distribution centers.
 * 
 * Provides a clean interface for components to access the
 * geospatial recommendation feature.
 * 
 * @module ui/hooks/useNearestCentros
 */

import { useState, useCallback } from 'react';
import type { Centro } from '../../domain/models/Centro';
import type { NearestCentroResult, NearestSearchOptions } from '../../domain/models/NearestResult';
import type { GeolocationError } from '../../infrastructure/geolocation/GeolocationAdapter';
import { GeolocationAdapter } from '../../infrastructure/geolocation/GeolocationAdapter';
import { getNearestCentros } from '../../application/usecases/getNearestCentros';
import { createLogger } from '../../infrastructure/logging/logger';

const logger = createLogger('useNearestCentros');

/**
 * State for the nearest centros hook.
 */
interface UseNearestCentrosState {
    /** Search results, empty if no search performed */
    readonly results: NearestCentroResult[];
    /** True while fetching location or calculating */
    readonly isLoading: boolean;
    /** Geolocation error if location failed */
    readonly geoError: GeolocationError | null;
    /** Application error message */
    readonly appError: string | null;
}

/**
 * Return type for the useNearestCentros hook.
 */
export interface UseNearestCentrosReturn extends UseNearestCentrosState {
    /** 
     * Fetches nearest centers based on current location.
     * Call this when user clicks "Find Nearest" button.
     */
    readonly fetchNearest: (options?: NearestSearchOptions) => Promise<void>;
    /** Clears current results and errors */
    readonly clearResults: () => void;
    /** True if there are any results to display */
    readonly hasResults: boolean;
    /** True if there is any error (geo or app) */
    readonly hasError: boolean;
    /** Combined error message for display */
    readonly errorMessage: string | null;
}

/**
 * Initial state for the hook.
 */
const initialState: UseNearestCentrosState = {
    results: [],
    isLoading: false,
    geoError: null,
    appError: null,
};

/**
 * Hook for finding nearest distribution centers.
 * 
 * Manages the complete flow:
 * 1. Request user's location
 * 2. Calculate distances to all centers
 * 3. Return ranked results
 * 
 * @param centros - Available distribution centers
 * @returns State and actions for nearest center search
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const nearest = useNearestCentros(centros);
 *   
 *   return (
 *     <div>
 *       <button 
 *         onClick={() => nearest.fetchNearest({ limit: 5 })}
 *         disabled={nearest.isLoading}
 *       >
 *         {nearest.isLoading ? 'Localizando...' : 'Encontrar Próximos'}
 *       </button>
 *       
 *       {nearest.hasError && <p>{nearest.errorMessage}</p>}
 *       
 *       {nearest.hasResults && (
 *         <ul>
 *           {nearest.results.map(r => (
 *             <li key={r.centro.id}>
 *               {r.centro.nome} - {r.distanceFormatted}
 *             </li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useNearestCentros(centros: Centro[]): UseNearestCentrosReturn {
    const [state, setState] = useState<UseNearestCentrosState>(initialState);

    const fetchNearest = useCallback(
        async (options?: NearestSearchOptions) => {
            logger.info('Fetching nearest centers', {
                function: 'fetchNearest',
            });

            // Start loading
            setState((prev) => ({
                ...prev,
                isLoading: true,
                geoError: null,
                appError: null,
            }));

            // Step 1: Get user location
            const geoResult = await GeolocationAdapter.getCurrentPosition();

            if (!geoResult.success) {
                logger.warn('Geolocation failed', {
                    function: 'fetchNearest',
                    metadata: { errorCode: geoResult.error.code },
                });

                setState({
                    results: [],
                    isLoading: false,
                    geoError: geoResult.error,
                    appError: null,
                });
                return;
            }

            // Step 2: Find nearest centers
            const searchResult = getNearestCentros(
                centros,
                geoResult.coordinates,
                options
            );

            if (!searchResult.success) {
                setState({
                    results: [],
                    isLoading: false,
                    geoError: null,
                    appError: searchResult.error,
                });
                return;
            }

            // Step 3: Success!
            logger.info('Nearest centers found', {
                function: 'fetchNearest',
                metadata: { count: searchResult.results.length },
            });

            setState({
                results: searchResult.results,
                isLoading: false,
                geoError: null,
                appError: null,
            });
        },
        [centros]
    );

    const clearResults = useCallback(() => {
        setState(initialState);
    }, []);

    // Computed values
    const hasResults = state.results.length > 0;
    const hasError = state.geoError !== null || state.appError !== null;
    const errorMessage = state.geoError?.message ?? state.appError ?? null;

    return {
        ...state,
        fetchNearest,
        clearResults,
        hasResults,
        hasError,
        errorMessage,
    };
}
