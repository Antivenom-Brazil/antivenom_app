import { useEffect, useRef, useState, useCallback } from 'react';
import type { Map } from 'mapbox-gl';
import {
  createMap,
  setMapMode,
  isTokenValid,
  type MapMode,
} from '../../../infrastructure/mapbox/MapboxMapAdapter';
import { UserMarkerManager } from '../../../infrastructure/mapbox/UserMarkerManager';
import { useUserLocation } from '../../hooks/useUserLocation';
import { createLogger } from '../../../infrastructure/logging/logger';
import '../../styles/user-marker.css';

const logger = createLogger('MapPanel');

export function MapPanel() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markerManagerRef = useRef<UserMarkerManager | null>(null);

  const [mode, setMode] = useState<MapMode>('points');
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // User location hook
  const userLocation = useUserLocation();

  // Initialize the map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (!isTokenValid()) {
      setError('Token do Mapbox não configurado. Configure VITE_MAPBOX_TOKEN no arquivo .env');
      return;
    }

    try {
      mapRef.current = createMap(mapContainerRef.current);

      // Wait for map to load before enabling location features
      mapRef.current.on('load', () => {
        setMapReady(true);
        logger.info('Map loaded and ready');
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar o mapa');
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

    // Fly to user location
    markerManagerRef.current.flyTo(userLocation.coordinates);

    logger.info('User location updated on map');
  }, [userLocation.hasLocation, userLocation.coordinates, userLocation.accuracy]);

  // Handle mode change
  const handleModeChange = useCallback((newMode: MapMode) => {
    setMode(newMode);
    if (mapRef.current) {
      setMapMode(mapRef.current, newMode);
    }
  }, []);

  // Handle location button click
  const handleLocationClick = useCallback(() => {
    userLocation.requestLocation();
  }, [userLocation]);

  // Determine location button state
  const getLocationButtonClass = () => {
    if (userLocation.hasError) return 'btn-my-location error';
    if (userLocation.hasLocation) return 'btn-my-location located';
    return 'btn-my-location';
  };

  if (error) {
    return (
      <div className="map-panel">
        <div className="alert-banner error">
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="map-panel">
      <div className="map-controls">
        <div className="map-toggle">
          <button
            className={mode === 'points' ? 'active' : ''}
            onClick={() => handleModeChange('points')}
          >
            📍 Pontos
          </button>
          <button
            className={mode === 'heatmap' ? 'active' : ''}
            onClick={() => handleModeChange('heatmap')}
          >
            🔥 Heatmap
          </button>
        </div>

        <button
          type="button"
          className={getLocationButtonClass()}
          onClick={handleLocationClick}
          disabled={userLocation.status === 'loading' || !mapReady}
          title={userLocation.hasError ? userLocation.errorMessage ?? '' : 'Mostrar minha localização'}
        >
          {userLocation.status === 'loading' ? (
            <>
              <span className="location-spinner" aria-hidden="true" />
              <span>Localizando...</span>
            </>
          ) : userLocation.hasLocation ? (
            <>
              <span aria-hidden="true">📍</span>
              <span>Localizado</span>
            </>
          ) : (
            <>
              <span aria-hidden="true">📍</span>
              <span>Minha Localização</span>
            </>
          )}
        </button>
      </div>

      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
}

