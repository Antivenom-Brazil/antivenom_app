import type { Centro } from '../../domain/models/Centro';
import type { FeatureCollection, Point } from 'geojson';

export function buildGeoJson(centros: Centro[]): FeatureCollection<Point> {
  return {
    type: 'FeatureCollection',
    features: centros.map((centro) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [centro.longitude, centro.latitude],
      },
      properties: {
        id: centro.id,
        nome: centro.nome,
        municipio: centro.municipio,
        uf: centro.uf,
        tiposSoro: centro.tiposSoro.join(', '),
        referencia: centro.referencia || '',
      },
    })),
  };
}
