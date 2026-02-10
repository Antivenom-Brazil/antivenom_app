import mapboxgl from 'mapbox-gl';
import type { Map } from 'mapbox-gl';
import { pointsLayer, heatmapLayer, SOURCE_ID } from './layers';
import { loadCentros } from '../data/centrosData';
import { buildGeoJson } from '../../application/usecases/buildGeoJson';

export type MapMode = 'points' | 'heatmap';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
// Estilo base do Mapbox (sem depender do tileset para dados)
const MAPBOX_STYLE = import.meta.env.VITE_MAPBOX_STYLE || 'mapbox://styles/mapbox/light-v11';

export function isTokenValid(): boolean {
  return Boolean(MAPBOX_TOKEN && MAPBOX_TOKEN !== 'seu_token_aqui');
}

/**
 * Callback type for when a centro point is clicked on the map.
 */
export type OnCentroClick = (centroId: string) => void;

/**
 * Creates and initializes the Mapbox map.
 *
 * Loads centros from the local JSON database, converts to GeoJSON,
 * and renders as a map source — ensuring consistency with the detail page.
 *
 * @param container - HTML element to render the map into
 * @param onCentroClick - Optional callback when a centro marker is clicked
 */
export function createMap(container: HTMLElement, onCentroClick?: OnCentroClick): Map {
  if (!isTokenValid()) {
    throw new Error('Token do Mapbox não configurado. Configure VITE_MAPBOX_TOKEN no arquivo .env');
  }

  mapboxgl.accessToken = MAPBOX_TOKEN;

  const map = new mapboxgl.Map({
    container,
    style: MAPBOX_STYLE,
    center: [-53.43, -9.81],
    zoom: 3.5,
  });

  map.on('load', async () => {
    // Load centros from the single source of truth (centros.json)
    try {
      const centros = await loadCentros();
      const geojson = buildGeoJson(centros);

      // Add GeoJSON source
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: geojson,
      });

      // Add visualization layers
      map.addLayer(pointsLayer);
      map.addLayer({ ...heatmapLayer, layout: { visibility: 'none' } });

      // Popup on hover
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on('mouseenter', 'points', (e) => {
        map.getCanvas().style.cursor = 'pointer';

        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const coords = feature.geometry.type === 'Point'
            ? feature.geometry.coordinates.slice() as [number, number]
            : [0, 0] as [number, number];
          const props = feature.properties;

          const nome = props?.nome || 'Centro de Atendimento';
          const municipio = props?.municipio || '';
          const uf = props?.uf || '';

          popup
            .setLngLat(coords)
            .setHTML(`
              <strong>${nome}</strong>
              ${municipio ? `<br/>${municipio}` : ''}
              ${uf ? ` - ${uf}` : ''}
            `)
            .addTo(map);
        }
      });

      map.on('mouseleave', 'points', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });

      // Click to navigate to detail page
      if (onCentroClick) {
        map.on('click', 'points', (e) => {
          if (e.features && e.features[0]) {
            const id = e.features[0].properties?.id;
            if (id) {
              onCentroClick(String(id));
            }
          }
        });
      }
    } catch (err) {
      console.error('Failed to load centros for map:', err);
    }
  });

  return map;
}

export function setMapMode(map: Map, mode: MapMode): void {
  if (!map.isStyleLoaded()) return;

  if (mode === 'points') {
    map.setLayoutProperty('points', 'visibility', 'visible');
    map.setLayoutProperty('heatmap', 'visibility', 'none');
  } else {
    map.setLayoutProperty('points', 'visibility', 'none');
    map.setLayoutProperty('heatmap', 'visibility', 'visible');
  }
}
