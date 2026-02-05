import type { Filtros } from '../../../domain/models/Filtros';

interface FiltersPanelProps {
  filtros: Filtros;
  onFiltrosChange: (filtros: Filtros) => void;
  ufs: string[];
  tiposSoro: string[];
}

export function FiltersPanel({ filtros, onFiltrosChange, ufs, tiposSoro }: FiltersPanelProps) {
  const handleChange = (campo: keyof Filtros, valor: string) => {
    onFiltrosChange({ ...filtros, [campo]: valor });
  };

  return (
    <aside className="filters-panel">
      <h2>🔎 Filtros</h2>

      <div className="filter-group">
        <label htmlFor="busca">Buscar (nome ou município)</label>
        <input
          type="text"
          id="busca"
          placeholder="Digite para buscar..."
          value={filtros.busca}
          onChange={(e) => handleChange('busca', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="uf">Estado (UF)</label>
        <select
          id="uf"
          value={filtros.uf}
          onChange={(e) => handleChange('uf', e.target.value)}
        >
          <option value="">Todos os estados</option>
          {ufs.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="tipoSoro">Tipo de Soro</label>
        <select
          id="tipoSoro"
          value={filtros.tipoSoro}
          onChange={(e) => handleChange('tipoSoro', e.target.value)}
        >
          <option value="">Todos os tipos</option>
          {tiposSoro.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
