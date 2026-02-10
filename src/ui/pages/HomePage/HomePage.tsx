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

import { useRef, useMemo, useState, useEffect } from 'react';
import { HeroBanner } from '../../components/HeroBanner';
import { MapPanel } from '../../components/MapPanel/MapPanel';
import { NearestPanel } from '../../components/NearestPanel';
import { useNearestCentros } from '../../hooks/useNearestCentros';
import { loadCentros } from '../../../infrastructure/data/centrosData';
import type { Centro } from '../../../domain/models/Centro';
import { getSection } from '../../../infrastructure/content';
import { createLogger } from '../../../infrastructure/logging/logger';

const logger = createLogger('HomePage');

// Load content from declarative YAML
const mapSectionContent = getSection('map_section');

/**
 * Calculates quick metrics from centers data.
 */
function useMetrics(centros: Centro[]) {
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
    const [centros, setCentros] = useState<Centro[]>([]);

    // Load real centros data from centros.json (single source of truth)
    useEffect(() => {
        loadCentros()
            .then(setCentros)
            .catch((err) => logger.error('Failed to load centros', { metadata: { error: String(err) } }));
    }, []);

    const metrics = useMetrics(centros);
    const nearest = useNearestCentros(centros);

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
                            {mapSectionContent.title}
                        </h2>
                        <p className="mt-2 text-gray-600">
                            {mapSectionContent.description}
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
