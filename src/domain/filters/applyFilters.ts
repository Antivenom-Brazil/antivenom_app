import type { Centro } from '../models/Centro';
import type { Filtros } from '../models/Filtros';

export function applyFilters(centros: Centro[], filtros: Filtros): Centro[] {
  return centros.filter((centro) => {
    // Filtro por UF
    if (filtros.uf && centro.uf !== filtros.uf) {
      return false;
    }

    // Filtro por tipo de soro
    if (filtros.tipoSoro && !centro.tiposSoro.includes(filtros.tipoSoro)) {
      return false;
    }

    // Filtro por busca (nome ou município)
    if (filtros.busca) {
      const termo = filtros.busca.toLowerCase();
      const nomeMatch = centro.nome.toLowerCase().includes(termo);
      const municipioMatch = centro.municipio.toLowerCase().includes(termo);
      if (!nomeMatch && !municipioMatch) {
        return false;
      }
    }

    return true;
  });
}
