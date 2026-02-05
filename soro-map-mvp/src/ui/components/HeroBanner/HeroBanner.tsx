/**
 * @fileoverview Hero banner component for the homepage.
 *
 * Displays:
 * - Main title and tagline
 * - Call-to-action buttons
 * - Quick metrics (centers, states, regions)
 * - Animated count-up numbers
 *
 * @module ui/components/HeroBanner
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, BarChart3, Building2, Map, Globe } from 'lucide-react';
import { createLogger } from '../../../infrastructure/logging/logger';

const logger = createLogger('HeroBanner');

/**
 * Props for the HeroBanner component.
 */
export interface HeroBannerProps {
    /** Total number of distribution centers */
    readonly totalCentros: number;
    /** Total number of states covered */
    readonly totalEstados: number;
    /** Total number of regions */
    readonly totalRegioes: number;
    /** Callback when user clicks "Explore Map" */
    readonly onExploreMap: () => void;
}

/**
 * Custom hook for animated count-up effect.
 *
 * @param target - Target number to count to
 * @param duration - Animation duration in ms
 * @returns Current animated value
 */
function useCountUp(target: number, duration = 2000): number {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (target === 0) return;

        const startTime = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out quad for smooth deceleration
            const eased = 1 - (1 - progress) * (1 - progress);
            setCount(Math.floor(eased * target));

            if (progress >= 1) {
                clearInterval(timer);
                setCount(target);
            }
        }, 16);

        return () => clearInterval(timer);
    }, [target, duration]);

    return count;
}

/**
 * Metric card component for displaying a single statistic.
 */
interface MetricItemProps {
    readonly value: number;
    readonly label: string;
    readonly icon: React.ReactNode;
}

function MetricItem({ value, label, icon }: MetricItemProps) {
    const animatedValue = useCountUp(value);

    return (
        <div className="flex flex-col items-center gap-1 px-4 py-2">
            <div className="text-white/80">{icon}</div>
            <span className="text-2xl sm:text-3xl font-bold text-white">
                {animatedValue.toLocaleString('pt-BR')}
            </span>
            <span className="text-sm text-white/80">{label}</span>
        </div>
    );
}

/**
 * Hero banner with gradient background, CTAs, and metrics.
 *
 * Features:
 * - Gradient green background
 * - Responsive layout
 * - Animated number count-up
 * - Accessible buttons
 */
export function HeroBanner({
    totalCentros,
    totalEstados,
    totalRegioes,
    onExploreMap,
}: HeroBannerProps) {
    const navigate = useNavigate();

    const handleExploreMap = () => {
        logger.info('User clicked Explore Map');
        onExploreMap();
    };

    const handleViewStats = () => {
        logger.info('User navigating to metrics page');
        navigate('/metricas');
    };

    return (
        <section className="relative bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 overflow-hidden">
            {/* Background pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="text-center">
                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-up">
                        Mapa de Soro Antiveneno
                    </h1>

                    {/* Tagline */}
                    <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-150">
                        Localize os centros de atendimento mais próximos com soros
                        antiofídicos disponíveis em todo o Brasil
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-in-up animation-delay-300">
                        <button
                            type="button"
                            onClick={handleExploreMap}
                            className="
                flex items-center gap-2 px-6 py-3 rounded-lg
                bg-white text-emerald-700 font-semibold
                hover:bg-gray-100 transition-colors duration-200
                shadow-lg hover:shadow-xl
                w-full sm:w-auto justify-center
              "
                        >
                            <Map className="w-5 h-5" />
                            Explorar Mapa
                        </button>

                        <button
                            type="button"
                            onClick={handleViewStats}
                            className="
                flex items-center gap-2 px-6 py-3 rounded-lg
                bg-transparent text-white font-semibold
                border-2 border-white/50 hover:border-white
                hover:bg-white/10 transition-all duration-200
                w-full sm:w-auto justify-center
              "
                        >
                            <BarChart3 className="w-5 h-5" />
                            Ver Estatísticas
                        </button>
                    </div>

                    {/* Metrics */}
                    <div className="animate-fade-in-up animation-delay-450">
                        <div className="inline-flex flex-wrap justify-center gap-4 sm:gap-8 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
                            <MetricItem
                                value={totalCentros}
                                label="Centros"
                                icon={<Building2 className="w-5 h-5" />}
                            />
                            <div className="hidden sm:block w-px bg-white/20" />
                            <MetricItem
                                value={totalEstados}
                                label="Estados"
                                icon={<MapPin className="w-5 h-5" />}
                            />
                            <div className="hidden sm:block w-px bg-white/20" />
                            <MetricItem
                                value={totalRegioes}
                                label="Regiões"
                                icon={<Globe className="w-5 h-5" />}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transition gradient to content */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
        </section>
    );
}
