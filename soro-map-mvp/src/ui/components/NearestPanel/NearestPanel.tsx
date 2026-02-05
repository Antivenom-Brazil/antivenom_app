/**
 * @fileoverview Panel component for displaying nearest centers.
 *
 * Shows a button to find nearest centers and displays results.
 * Handles loading and error states gracefully.
 *
 * @module ui/components/NearestPanel
 */

import { MapPin, Loader2, AlertCircle, X, Navigation } from 'lucide-react';
import type { NearestCentroResult } from '../../../domain/models/NearestResult';

/**
 * Props for the NearestPanel component.
 */
export interface NearestPanelProps {
    /** Search results to display */
    readonly results: NearestCentroResult[];
    /** True while fetching location/calculating */
    readonly isLoading: boolean;
    /** Error message to display, if any */
    readonly errorMessage: string | null;
    /** Called when user clicks find button */
    readonly onFindNearest: () => void;
    /** Called when user clicks clear button */
    readonly onClear: () => void;
}

/**
 * Single result item component.
 */
interface NearestItemProps {
    readonly item: NearestCentroResult;
}

function NearestItem({ item }: NearestItemProps) {
    return (
        <li className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.centro.nome}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                    {item.centro.municipio} - {item.centro.uf}
                </p>
                {item.centro.tiposSoro.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {item.centro.tiposSoro.slice(0, 2).map((tipo) => (
                            <span
                                key={tipo}
                                className="inline-block px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded"
                            >
                                {tipo}
                            </span>
                        ))}
                        {item.centro.tiposSoro.length > 2 && (
                            <span className="text-xs text-gray-500">
                                +{item.centro.tiposSoro.length - 2}
                            </span>
                        )}
                    </div>
                )}
            </div>
            <div className="flex-shrink-0 text-right">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">
                    <Navigation className="w-3 h-3" />
                    {item.distanceFormatted}
                </span>
            </div>
        </li>
    );
}

/**
 * Panel for finding and displaying nearest distribution centers.
 *
 * Features:
 * - Button to trigger location-based search
 * - Loading state with spinner
 * - Error display with friendly messages
 * - Results list with distance badges
 * - Clear button to reset
 */
export function NearestPanel({
    results,
    isLoading,
    errorMessage,
    onFindNearest,
    onClear,
}: NearestPanelProps) {
    const hasResults = results.length > 0;
    const hasError = errorMessage !== null;

    return (
        <section aria-labelledby="nearest-title" className="h-full flex flex-col">
            {/* Header */}
            <header className="flex flex-col gap-3 mb-4">
                <h3 id="nearest-title" className="text-lg font-semibold text-gray-900">
                    Centros Mais Próximos
                </h3>
                <button
                    type="button"
                    onClick={onFindNearest}
                    disabled={isLoading}
                    className="
            flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg
            bg-emerald-600 text-white font-medium
            hover:bg-emerald-700 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
                    aria-busy={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Localizando...
                        </>
                    ) : (
                        <>
                            <MapPin className="w-4 h-4" />
                            Encontrar Próximos
                        </>
                    )}
                </button>
            </header>

            {/* Error State */}
            {hasError && (
                <div
                    className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                    role="alert"
                >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Results */}
            {hasResults && (
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-gray-600">
                            {results.length} {results.length === 1 ? 'centro encontrado' : 'centros encontrados'}
                        </p>
                        <button
                            type="button"
                            onClick={onClear}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-3 h-3" />
                            Limpar
                        </button>
                    </div>

                    <ul className="space-y-2 overflow-y-auto flex-1" role="list">
                        {results.map((item) => (
                            <NearestItem key={item.centro.id} item={item} />
                        ))}
                    </ul>
                </div>
            )}

            {/* Empty State */}
            {!hasResults && !hasError && !isLoading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm max-w-[200px]">
                        Clique no botão acima para localizar os centros mais perto de você.
                    </p>
                </div>
            )}
        </section>
    );
}
