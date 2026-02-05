/**
 * @fileoverview Panel component for displaying nearest centers.
 *
 * Shows a button to find nearest centers and displays results.
 * Handles loading and error states gracefully.
 *
 * @module ui/components/NearestPanel
 */

import { Link } from 'react-router-dom';
import { MapPin, Loader2, AlertCircle, X, Navigation } from 'lucide-react';
import type { NearestCentroResult } from '../../../domain/models/NearestResult';
import { getSection, pluralize } from '../../../infrastructure/content';

// Load content from declarative YAML
const content = getSection('nearest_panel');

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
        <li className="group">
            <Link
                to={`/centro/${item.centro.id}`}
                className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 hover:ring-2 hover:ring-emerald-200 transition-all cursor-pointer"
            >
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate group-hover:text-emerald-700">{item.centro.nome}</p>
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
                <div className="flex-shrink-0 text-right flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">
                        <Navigation className="w-3 h-3" />
                        {item.distanceFormatted}
                    </span>
                    <span className="text-xs text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver detalhes →
                    </span>
                </div>
            </Link>
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

    /**
     * Get pluralized result text.
     */
    const getResultText = (): string => {
        const count = results.length;
        return `${count} ${pluralize(count, content.results.single, content.results.plural)}`;
    };

    return (
        <section aria-labelledby="nearest-title" className="h-full flex flex-col">
            {/* Header */}
            <header className="flex flex-col gap-3 mb-4">
                <h3 id="nearest-title" className="text-lg font-semibold text-gray-900">
                    {content.title}
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
                            {content.button.loading}
                        </>
                    ) : (
                        <>
                            <MapPin className="w-4 h-4" />
                            {content.button.find}
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
                        <p className="text-sm text-gray-600">{getResultText()}</p>
                        <button
                            type="button"
                            onClick={onClear}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-3 h-3" />
                            {content.button.clear}
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
                    <p className="text-gray-500 text-sm max-w-[200px] mb-2">
                        {content.empty_state}
                    </p>
                    <p className="text-gray-400 text-xs max-w-[200px]">
                        {content.click_hint}
                    </p>
                </div>
            )}
        </section>
    );
}
