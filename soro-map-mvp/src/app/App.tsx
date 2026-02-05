import { useState, useMemo } from 'react';
import { Header } from '../ui/components/Header/Header';
import { MapPanel } from '../ui/components/MapPanel/MapPanel';
import { FiltersPanel } from '../ui/components/FiltersPanel/FiltersPanel';
import { ResultsTable } from '../ui/components/ResultsTable/ResultsTable';
import { NearestPanel } from '../ui/components/NearestPanel';
import { centrosMock, ufsDisponiveis, tiposSoroDisponiveis } from '../infrastructure/data/centros.mock';
import { filtrosIniciais, type Filtros } from '../domain/models/Filtros';
import { getFilteredCentros } from '../application/usecases/getFilteredCentros';
import { useNearestCentros } from '../ui/hooks/useNearestCentros';
import '../ui/styles/app.css';

export function App() {
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciais);

  // Centros filtrados (dados mockados para a tabela)
  const centrosFiltrados = useMemo(
    () => getFilteredCentros(centrosMock, filtros),
    [filtros]
  );

  // Hook for nearest centers geospatial feature
  const nearest = useNearestCentros(centrosMock);

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <MapPanel />

        {/* Geospatial Recommendation Panel */}
        <NearestPanel
          results={nearest.results}
          isLoading={nearest.isLoading}
          errorMessage={nearest.errorMessage}
          onFindNearest={() => nearest.fetchNearest({ limit: 5 })}
          onClear={nearest.clearResults}
        />

        <FiltersPanel
          filtros={filtros}
          onFiltrosChange={setFiltros}
          ufs={ufsDisponiveis}
          tiposSoro={tiposSoroDisponiveis}
        />
      </main>

      <ResultsTable centros={centrosFiltrados} />
    </div>
  );
}

