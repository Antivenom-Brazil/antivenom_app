import type { CircleLayerSpecification, HeatmapLayerSpecification } from 'mapbox-gl';

// Source ID for the local GeoJSON data
export const SOURCE_ID = 'centros-source';

export const pointsLayer: CircleLayerSpecification = {
  id: 'points',
  type: 'circle',
  source: SOURCE_ID,
  paint: {
    'circle-color': 'rgb(0, 204, 92)',
    'circle-radius': 4,
    'circle-stroke-width': 0.7,
    'circle-stroke-color': 'rgba(0,0,0,0.25)',
    'circle-opacity': 0.95,
  },
};

export const heatmapLayer: HeatmapLayerSpecification = {
  id: 'heatmap',
  type: 'heatmap',
  source: SOURCE_ID,
  paint: {
    'heatmap-radius': 12,
    'heatmap-intensity': 1,
    'heatmap-opacity': 0.75,
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(0, 0, 255, 0)',
      0.1, 'royalblue',
      0.3, 'cyan',
      0.5, 'lime',
      0.7, 'yellow',
      1, 'red',
    ],
  },
};
