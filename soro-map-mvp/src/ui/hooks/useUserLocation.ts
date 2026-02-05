/**
 * @fileoverview React hook for managing user location state.
 * 
 * Provides a clean interface for tracking user location with
 * status updates, error handling, and watch capability.
 * 
 * PRIVACY: Location data is only stored in React state (memory)
 * and never persisted or transmitted to external services.
 * 
 * @module ui/hooks/useUserLocation
 */

import { useState, useCallback, useEffect } from 'react';
import type { Coordinates } from '../../domain/geo/types';
import { createLogger } from '../../infrastructure/logging/logger';

const logger = createLogger('useUserLocation');

/**
 * Possible states for the location request.
 */
export type LocationStatus =
    | 'idle'         // Initial state, no request made
    | 'loading'      // Requesting location
    | 'success'      // Location obtained
    | 'denied'       // User denied permission
    | 'unavailable'  // Position unavailable
    | 'timeout'      // Request timed out
    | 'unsupported'; // Browser doesn't support geolocation

/**
 * Return type for the useUserLocation hook.
 */
export interface UseUserLocationReturn {
    /** Current user coordinates, null if not available */
    readonly coordinates: Coordinates | null;
    /** Current location status */
    readonly status: LocationStatus;
    /** Position accuracy in meters, null if not available */
    readonly accuracy: number | null;
    /** True if location was successfully obtained */
    readonly hasLocation: boolean;
    /** True if there is an error */
    readonly hasError: boolean;
    /** Human-readable error message, or null */
    readonly errorMessage: string | null;
    /** Request the user's current position */
    readonly requestLocation: () => void;
    /** Clear location data and reset to idle */
    readonly clearLocation: () => void;
}

/**
 * Error messages for each status.
 */
const STATUS_MESSAGES: Record<LocationStatus, string | null> = {
    idle: null,
    loading: null,
    success: null,
    denied: 'Permissão de localização negada. Verifique as configurações do navegador.',
    unavailable: 'Não foi possível determinar sua localização. Tente novamente.',
    timeout: 'Tempo limite excedido ao obter localização. Tente novamente.',
    unsupported: 'Seu navegador não suporta geolocalização.',
};

/**
 * Geolocation options optimized for city-level accuracy.
 */
const GEO_OPTIONS: PositionOptions = {
    enableHighAccuracy: false, // WiFi/Cell is sufficient
    timeout: 10000,            // 10 seconds
    maximumAge: 60000,         // Cache for 1 minute
};

/**
 * Hook for managing user location.
 * 
 * Features:
 * - Browser geolocation support detection
 * - Status tracking with typed states
 * - Accuracy information
 * - Error handling with user-friendly messages
 * 
 * @example
 * ```tsx
 * function LocationComponent() {
 *   const location = useUserLocation();
 *   
 *   return (
 *     <div>
 *       <button 
 *         onClick={location.requestLocation}
 *         disabled={location.status === 'loading'}
 *       >
 *         {location.status === 'loading' ? 'Localizando...' : 'Obter Localização'}
 *       </button>
 *       
 *       {location.hasError && <p>{location.errorMessage}</p>}
 *       
 *       {location.hasLocation && (
 *         <p>Lat: {location.coordinates.latitude}</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useUserLocation(): UseUserLocationReturn {
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [status, setStatus] = useState<LocationStatus>('idle');
    const [accuracy, setAccuracy] = useState<number | null>(null);

    // Check browser support on mount
    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setStatus('unsupported');
            logger.warn('Geolocation not supported in this browser');
        }
    }, []);

    const requestLocation = useCallback(() => {
        if (!('geolocation' in navigator)) {
            setStatus('unsupported');
            return;
        }

        logger.debug('Requesting user location', { function: 'requestLocation' });
        setStatus('loading');

        navigator.geolocation.getCurrentPosition(
            // Success callback
            (position) => {
                const coords: Coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                setCoordinates(coords);
                setAccuracy(position.coords.accuracy);
                setStatus('success');

                logger.info('Location obtained', {
                    function: 'requestLocation',
                    metadata: { accuracy: position.coords.accuracy },
                });
            },
            // Error callback
            (error) => {
                const statusMap: Record<number, LocationStatus> = {
                    [GeolocationPositionError.PERMISSION_DENIED]: 'denied',
                    [GeolocationPositionError.POSITION_UNAVAILABLE]: 'unavailable',
                    [GeolocationPositionError.TIMEOUT]: 'timeout',
                };

                const newStatus = statusMap[error.code] || 'unavailable';
                setStatus(newStatus);
                setCoordinates(null);
                setAccuracy(null);

                logger.warn('Failed to get location', {
                    function: 'requestLocation',
                    metadata: { errorCode: error.code, status: newStatus },
                });
            },
            GEO_OPTIONS
        );
    }, []);

    const clearLocation = useCallback(() => {
        setCoordinates(null);
        setAccuracy(null);
        setStatus('idle');
        logger.debug('Location cleared', { function: 'clearLocation' });
    }, []);

    // Computed values
    const hasLocation = status === 'success' && coordinates !== null;
    const hasError = ['denied', 'unavailable', 'timeout', 'unsupported'].includes(status);
    const errorMessage = STATUS_MESSAGES[status];

    return {
        coordinates,
        status,
        accuracy,
        hasLocation,
        hasError,
        errorMessage,
        requestLocation,
        clearLocation,
    };
}
