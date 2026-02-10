/**
 * @fileoverview Interactive map panel component.
 *
 * Displays:
 * - Mapbox map with center markers
 * - Toggle between points and heatmap modes
 * - User location with marker and accuracy circle
 *
 * @module ui/components/MapPanel
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Map } from 'mapbox-gl';
import { MapPin, Activity, Navigation, Loader2, AlertCircle } from 'lucide-react';
import {
  createMap,
  setMapMode,
  isTokenValid,
  type MapMode,
} from '../../../infrastructure/mapbox/MapboxMapAdapter';
import { UserMarkerManager } from '../../../infrastructure/mapbox/UserMarkerManager';
import { useUserLocation } from '../../hooks/useUserLocation';
import { getSection } from '../../../infrastructure/content';
import { createLogger } from '../../../infrastructure/logging/logger';
import '../../styles/user-marker.css';

const logger = createLogger('MapPanel');

// Load content from declarative YAML
const content = getSection('map_panel');

/**
 * Interactive map panel with visualization modes and user location.
 */
export function MapPanel() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerManagerRef = useRef<UserMarkerManager | null>(null);
  const navigate = useNavigate();

  const [mode, setMode] = useState<MapMode>('points');
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const userLocation = useUserLocation();

  // Initialize the map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (!isTokenValid()) {
      setError(content.errors.token_missing);
      return;
    }

    try {
      mapRef.current = createMap(mapContainerRef.current, (centroId) => {
        navigate(`/centro/${centroId}`);
      });

      mapRef.current.on('load', () => {
        setMapReady(true);
        logger.info('Map loaded and ready');
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : content.errors.map_error);
    }

    return () => {
      if (markerManagerRef.current) {
        markerManagerRef.current.remove();
        markerManagerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Initialize marker manager when map is ready
  useEffect(() => {
    if (!mapReady || !mapRef.current || markerManagerRef.current) return;

    markerManagerRef.current = new UserMarkerManager(mapRef.current);
    logger.debug('User marker manager initialized');
  }, [mapReady]);

  // Update user marker when location changes
  useEffect(() => {
    if (!userLocation.hasLocation || !markerManagerRef.current || !userLocation.coordinates) return;

    markerManagerRef.current.setPosition(
      userLocation.coordinates,
      userLocation.accuracy ?? undefined
    );

    markerManagerRef.current.flyTo(userLocation.coordinates);
    logger.info('User location updated on map');
  }, [userLocation.hasLocation, userLocation.coordinates, userLocation.accuracy]);

  const handleModeChange = useCallback((newMode: MapMode) => {
    setMode(newMode);
    if (mapRef.current) {
      setMapMode(mapRef.current, newMode);
    }
    logger.debug('Map mode changed', { function: 'handleModeChange', metadata: { mode: newMode } });
  }, []);

  const handleLocationClick = useCallback(() => {
    userLocation.requestLocation();
  }, [userLocation]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="flex items-center gap-3 text-red-600 px-4 py-3 bg-red-50 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  /**
   * Get location button text based on current state.
   */
  const getLocationText = (): string => {
    if (userLocation.status === 'loading') return content.controls.locating;
    if (userLocation.hasLocation) return content.controls.located;
    return content.controls.my_location;
  };

  return (
    <div className="flex flex-col h-full min-h-[400px] lg:min-h-[500px]">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
        {/* Mode Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-gray-300">
          <button
            type="button"
            onClick={() => handleModeChange('points')}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
              transition-colors duration-150
              ${mode === 'points'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">{content.controls.points}</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('heatmap')}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
              transition-colors duration-150 border-l border-gray-300
              ${mode === 'heatmap'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">{content.controls.heatmap}</span>
          </button>
        </div>

        {/* Location Button */}
        <button
          type="button"
          onClick={handleLocationClick}
          disabled={userLocation.status === 'loading' || !mapReady}
          title={userLocation.hasError ? userLocation.errorMessage ?? '' : content.aria.show_location}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
            transition-all duration-150 border
            ${userLocation.hasError
              ? 'bg-red-50 text-red-700 border-red-200'
              : userLocation.hasLocation
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {userLocation.status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">{getLocationText()}</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              <span className="hidden sm:inline">{getLocationText()}</span>
            </>
          )}
        </button>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="flex-1 min-h-0" />
    </div>
  );
}
