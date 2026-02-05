/**
 * @fileoverview Adapter for browser Geolocation API.
 * 
 * Provides a clean interface to the browser's geolocation capabilities
 * with proper error handling and result types.
 * 
 * PRIVACY NOTE: User location is never persisted or sent to external services.
 * It is only used locally for distance calculations.
 * 
 * @module infrastructure/geolocation/GeolocationAdapter
 */

import type { Coordinates } from '../../domain/geo/types';
import { createLogger } from '../logging/logger';

const logger = createLogger('GeolocationAdapter');

/**
 * Error codes for geolocation failures.
 * Maps to standard Geolocation API codes with additions.
 */
export type GeolocationErrorCode =
    | 'PERMISSION_DENIED'
    | 'POSITION_UNAVAILABLE'
    | 'TIMEOUT'
    | 'NOT_SUPPORTED';

/**
 * Structured error for geolocation failures.
 */
export interface GeolocationError {
    /** Error classification code */
    readonly code: GeolocationErrorCode;
    /** Human-readable error message */
    readonly message: string;
}

/**
 * Result type for geolocation operations.
 * Uses discriminated union for type-safe error handling.
 */
export type GeolocationResult =
    | { readonly success: true; readonly coordinates: Coordinates }
    | { readonly success: false; readonly error: GeolocationError };

/**
 * Configuration for geolocation requests.
 */
interface GeolocationConfig {
    /** Request high accuracy (uses GPS, slower, more battery) */
    readonly enableHighAccuracy: boolean;
    /** Maximum time to wait for position in ms */
    readonly timeout: number;
    /** Max age of cached position in ms */
    readonly maximumAge: number;
}

/**
 * Default geolocation configuration.
 * Optimized for quick response and battery efficiency.
 */
const DEFAULT_CONFIG: GeolocationConfig = {
    enableHighAccuracy: false, // WiFi/Cell is sufficient for city-level
    timeout: 10000, // 10 seconds
    maximumAge: 60000, // 1 minute cache
};

/**
 * Adapter for browser Geolocation API.
 * 
 * Provides:
 * - Support checking
 * - Async position retrieval
 * - Structured error handling
 * - Logging for debugging
 * 
 * @example
 * ```ts
 * if (GeolocationAdapter.isSupported()) {
 *   const result = await GeolocationAdapter.getCurrentPosition();
 *   if (result.success) {
 *     console.log(result.coordinates);
 *   } else {
 *     console.error(result.error.message);
 *   }
 * }
 * ```
 */
export class GeolocationAdapter {
    /**
     * Checks if Geolocation API is available in the browser.
     * @returns True if geolocation is supported
     */
    static isSupported(): boolean {
        return 'geolocation' in navigator;
    }

    /**
     * Gets the user's current position.
     * 
     * @param config - Optional configuration overrides
     * @returns Promise with coordinates or error
     */
    static async getCurrentPosition(
        config: Partial<GeolocationConfig> = {}
    ): Promise<GeolocationResult> {
        if (!this.isSupported()) {
            logger.warn('Geolocation not supported in this browser');
            return {
                success: false,
                error: {
                    code: 'NOT_SUPPORTED',
                    message: 'Geolocalização não é suportada neste navegador.',
                },
            };
        }

        const mergedConfig: GeolocationConfig = { ...DEFAULT_CONFIG, ...config };

        logger.debug('Requesting user position', {
            function: 'getCurrentPosition',
        });

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                // Success callback
                (position) => {
                    const coordinates: Coordinates = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    logger.info('Position obtained successfully', {
                        function: 'getCurrentPosition',
                        metadata: {
                            accuracy: position.coords.accuracy,
                        },
                    });

                    resolve({
                        success: true,
                        coordinates,
                    });
                },
                // Error callback
                (error) => {
                    const geolocationError = this.mapGeolocationError(error);

                    logger.warn('Failed to get position', {
                        function: 'getCurrentPosition',
                        metadata: {
                            errorCode: geolocationError.code,
                        },
                    });

                    resolve({
                        success: false,
                        error: geolocationError,
                    });
                },
                // Options
                {
                    enableHighAccuracy: mergedConfig.enableHighAccuracy,
                    timeout: mergedConfig.timeout,
                    maximumAge: mergedConfig.maximumAge,
                }
            );
        });
    }

    /**
     * Maps browser GeolocationPositionError to our error type.
     */
    private static mapGeolocationError(
        error: GeolocationPositionError
    ): GeolocationError {
        const errorMap: Record<number, GeolocationError> = {
            [GeolocationPositionError.PERMISSION_DENIED]: {
                code: 'PERMISSION_DENIED',
                message: 'Permissão de localização negada. Verifique as configurações do navegador.',
            },
            [GeolocationPositionError.POSITION_UNAVAILABLE]: {
                code: 'POSITION_UNAVAILABLE',
                message: 'Não foi possível determinar sua localização. Tente novamente.',
            },
            [GeolocationPositionError.TIMEOUT]: {
                code: 'TIMEOUT',
                message: 'Tempo limite excedido ao obter localização. Tente novamente.',
            },
        };

        return (
            errorMap[error.code] ?? {
                code: 'POSITION_UNAVAILABLE',
                message: error.message || 'Erro desconhecido ao obter localização.',
            }
        );
    }
}
