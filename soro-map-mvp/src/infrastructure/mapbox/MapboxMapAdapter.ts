import mapboxgl from 'mapbox-gl';
import type { Map } from 'mapbox-gl';
import { pointsLayer, heatmapLayer } from './layers';

export type MapMode = 'points' | 'heatmap';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
// Estilo do Mapbox Studio que contém o tileset com os dados reais
const MAPBOX_STYLE = import.meta.env.VITE_MAPBOX_STYLE || 'mapbox://styles/lucasdesiqueirasantos/cmah1zaex00e001s8dihj0ma0';

export function isTokenValid(): boolean {
  return Boolean(MAPBOX_TOKEN && MAPBOX_TOKEN !== 'seu_token_aqui');
}

export function createMap(container: HTMLElement): Map {
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

  map.on('load', () => {
    // Adiciona as layers usando o tileset já existente no estilo
    map.addLayer(pointsLayer);
    map.addLayer({ ...heatmapLayer, layout: { visibility: 'none' } });

    // Adiciona popup no hover dos pontos
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
        
        // Adaptar aos campos do tileset real
        const nome = props?.nome || props?.name || props?.NOME || 'Centro de Atendimento';
        const municipio = props?.municipio || props?.city || props?.MUNICIPIO || '';
        const uf = props?.uf || props?.state || props?.UF || '';
        
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
