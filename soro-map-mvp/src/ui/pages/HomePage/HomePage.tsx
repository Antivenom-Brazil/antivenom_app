/**
 * @fileoverview Homepage component for the MVP.
 *
 * Layout:
 * - Hero banner with metrics and CTAs
 * - Map section with interactive map
 * - Nearest centers panel
 *
 * @module ui/pages/HomePage
 */

import { useRef, useMemo } from 'react';
import { HeroBanner } from '../../components/HeroBanner';
import { MapPanel } from '../../components/MapPanel/MapPanel';
import { NearestPanel } from '../../components/NearestPanel';
import { useNearestCentros } from '../../hooks/useNearestCentros';
import { centrosMock } from '../../../infrastructure/data/centros.mock';
import { createLogger } from '../../../infrastructure/logging/logger';

const logger = createLogger('HomePage');

/**
 * Calculates quick metrics from centers data.
 */
function useMetrics(centros: typeof centrosMock) {
    return useMemo(() => {
        const uniqueStates = new Set(centros.map((c) => c.uf)).size;
        const uniqueRegions = 5; // Brazil has 5 regions

        return {
            totalCentros: centros.length,
            totalEstados: uniqueStates,
            totalRegioes: uniqueRegions,
        };
    }, [centros]);
}

/**
 * Homepage displaying hero, map, and nearest centers.
 */
export function HomePage() {
    const mapSectionRef = useRef<HTMLElement>(null);
    const metrics = useMetrics(centrosMock);
    const nearest = useNearestCentros(centrosMock);

    const scrollToMap = () => {
        logger.info('Scrolling to map section');
        mapSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <HeroBanner
                totalCentros={metrics.totalCentros}
                totalEstados={metrics.totalEstados}
                totalRegioes={metrics.totalRegioes}
                onExploreMap={scrollToMap}
            />

            {/* Map Section */}
            <section
                ref={mapSectionRef}
                id="map-section"
                className="py-8 sm:py-12"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Mapa Interativo
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Visualize os centros de distribuição e encontre o mais próximo de você
                        </p>
                    </div>

                    {/* Grid: Map + Nearest Panel */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                        {/* Map */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <MapPanel />
                        </div>

                        {/* Nearest Centers Panel */}
                        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                            <NearestPanel
                                results={nearest.results}
                                isLoading={nearest.isLoading}
                                errorMessage={nearest.errorMessage}
                                onFindNearest={() => nearest.fetchNearest({ limit: 5 })}
                                onClear={nearest.clearResults}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
