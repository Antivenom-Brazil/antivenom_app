import type { Centro } from '../../domain/models/Centro';
import type { Filtros } from '../../domain/models/Filtros';
import { applyFilters } from '../../domain/filters/applyFilters';

export function getFilteredCentros(centros: Centro[], filtros: Filtros): Centro[] {
  return applyFilters(centros, filtros);
}
