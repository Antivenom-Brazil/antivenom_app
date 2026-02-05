/**
 * @fileoverview Manager class for user location marker on Mapbox map.
 * 
 * Handles:
 * - User location marker with pulsing animation
 * - Accuracy circle visualization
 * - Fly-to animation to user position
 * - Cleanup on removal
 * 
 * @module infrastructure/mapbox/UserMarkerManager
 */

import mapboxgl from 'mapbox-gl';
import type { Map, Marker } from 'mapbox-gl';
import type { Coordinates } from '../../domain/geo/types';
import { createLogger } from '../logging/logger';

const logger = createLogger('UserMarkerManager');

/**
 * Source ID for the accuracy circle layer.
 */
const ACCURACY_SOURCE_ID = 'user-accuracy-circle';

/**
 * Layer ID for the accuracy circle fill.
 */
const ACCURACY_LAYER_ID = 'user-accuracy-fill';

/**
 * Options for creating the user marker manager.
 */
export interface UserMarkerOptions {
    /** Custom marker element CSS class */
    readonly markerClass?: string;
    /** Show accuracy circle (default: true) */
    readonly showAccuracy?: boolean;
    /** Accuracy circle color (default: #4285F4) */
    readonly accuracyColor?: string;
}

/**
 * Default marker options.
 */
const DEFAULT_OPTIONS: Required<UserMarkerOptions> = {
    markerClass: 'user-location-marker',
    showAccuracy: true,
    accuracyColor: '#4285F4',
};

/**
 * Manager for user location visualization on Mapbox map.
 * 
 * Features:
 * - Pulsing marker at user's position
 * - Semi-transparent accuracy circle
 * - Fly-to animation
 * - Proper cleanup on removal
 * 
 * @example
 * ```ts
 * const manager = new UserMarkerManager(map);
 * 
 * // When user location is obtained
 * manager.setPosition(coordinates, accuracy);
 * manager.flyTo(coordinates);
 * 
 * // Cleanup
 * manager.remove();
 * ```
 */
export class UserMarkerManager {
    private readonly map: Map;
    private readonly options: Required<UserMarkerOptions>;
    private marker: Marker | null = null;
    private markerElement: HTMLDivElement | null = null;

    constructor(map: Map, options: UserMarkerOptions = {}) {
        this.map = map;
        this.options = { ...DEFAULT_OPTIONS, ...options };

        logger.debug('UserMarkerManager initialized');
    }

    /**
     * Sets or updates the user's position on the map.
     * Creates marker on first call, updates position on subsequent calls.
     * 
     * @param coordinates - User's location
     * @param accuracyMeters - Position accuracy in meters (optional)
     */
    setPosition(coordinates: Coordinates, accuracyMeters?: number): void {
        const lngLat: [number, number] = [coordinates.longitude, coordinates.latitude];

        // Create marker if it doesn't exist
        if (!this.marker) {
            this.createMarker(lngLat);
        } else {
            this.marker.setLngLat(lngLat);
        }

        // Update or create accuracy circle
        if (this.options.showAccuracy && accuracyMeters !== undefined) {
            this.updateAccuracyCircle(coordinates, accuracyMeters);
        }

        logger.debug('User position updated', {
            function: 'setPosition',
            metadata: { hasAccuracy: accuracyMeters !== undefined },
        });
    }

    /**
     * Animates the map to center on the given coordinates.
     * 
     * @param coordinates - Target coordinates
     * @param zoom - Target zoom level (default: 14)
     */
    flyTo(coordinates: Coordinates, zoom = 14): void {
        this.map.flyTo({
            center: [coordinates.longitude, coordinates.latitude],
            zoom,
            duration: 1500,
            essential: true, // Animation is essential for accessibility
        });

        logger.debug('Flying to user position', {
            function: 'flyTo',
            metadata: { zoom },
        });
    }

    /**
     * Removes the marker and accuracy circle from the map.
     * Safe to call even if no marker exists.
     */
    remove(): void {
        // Remove marker
        if (this.marker) {
            this.marker.remove();
            this.marker = null;
        }

        // Remove marker element
        if (this.markerElement) {
            this.markerElement.remove();
            this.markerElement = null;
        }

        // Remove accuracy circle layer and source
        this.removeAccuracyCircle();

        logger.debug('User marker removed');
    }

    /**
     * Creates the pulsing marker element and adds it to the map.
     */
    private createMarker(lngLat: [number, number]): void {
        // Create custom marker element
        this.markerElement = document.createElement('div');
        this.markerElement.className = this.options.markerClass;

        // Add inner pulse element
        const pulseRing = document.createElement('div');
        pulseRing.className = 'user-location-marker-pulse';
        this.markerElement.appendChild(pulseRing);

        // Create and add marker to map
        this.marker = new mapboxgl.Marker({
            element: this.markerElement,
            anchor: 'center',
        })
            .setLngLat(lngLat)
            .addTo(this.map);

        logger.debug('User marker created');
    }

    /**
     * Creates or updates the accuracy circle around user's position.
     */
    private updateAccuracyCircle(center: Coordinates, radiusMeters: number): void {
        const circleGeoJSON = this.createCircleGeoJSON(center, radiusMeters);

        // Check if source already exists
        if (this.map.getSource(ACCURACY_SOURCE_ID)) {
            // Update existing source
            (this.map.getSource(ACCURACY_SOURCE_ID) as mapboxgl.GeoJSONSource).setData(circleGeoJSON);
        } else {
            // Create new source and layer
            this.map.addSource(ACCURACY_SOURCE_ID, {
                type: 'geojson',
                data: circleGeoJSON,
            });

            this.map.addLayer({
                id: ACCURACY_LAYER_ID,
                type: 'fill',
                source: ACCURACY_SOURCE_ID,
                paint: {
                    'fill-color': this.options.accuracyColor,
                    'fill-opacity': 0.15,
                },
            });
        }
    }

    /**
     * Removes accuracy circle layer and source from map.
     */
    private removeAccuracyCircle(): void {
        if (this.map.getLayer(ACCURACY_LAYER_ID)) {
            this.map.removeLayer(ACCURACY_LAYER_ID);
        }
        if (this.map.getSource(ACCURACY_SOURCE_ID)) {
            this.map.removeSource(ACCURACY_SOURCE_ID);
        }
    }

    /**
     * Creates a GeoJSON circle polygon from center and radius.
     * Uses approximation for performance (64-point polygon).
     */
    private createCircleGeoJSON(
        center: Coordinates,
        radiusMeters: number
    ): GeoJSON.Feature<GeoJSON.Polygon> {
        const points = 64;
        const coords: [number, number][] = [];
        const radiusKm = radiusMeters / 1000;

        for (let i = 0; i < points; i++) {
            const angle = (i / points) * 2 * Math.PI;
            const dx = radiusKm * Math.cos(angle);
            const dy = radiusKm * Math.sin(angle);

            // Convert km offset to degrees (approximate)
            const lat = center.latitude + (dy / 111.32);
            const lng = center.longitude + (dx / (111.32 * Math.cos(center.latitude * Math.PI / 180)));

            coords.push([lng, lat]);
        }

        // Close the polygon
        coords.push(coords[0]);

        return {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Polygon',
                coordinates: [coords],
            },
        };
    }
}
