/**
 * @fileoverview Panel component for displaying nearest centers.
 * 
 * Shows a button to find nearest centers and displays results.
 * Handles loading and error states gracefully.
 * 
 * @module ui/components/NearestPanel
 */

import type { NearestCentroResult } from '../../../domain/models/NearestResult';
import './NearestPanel.css';

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
 * Single result item in the list.
 */
interface NearestItemProps {
    readonly item: NearestCentroResult;
}

function NearestItem({ item }: NearestItemProps) {
    return (
        <li className="nearest-item">
            <div className="nearest-item-info">
                <strong className="nearest-item-name">{item.centro.nome}</strong>
                <span className="nearest-item-location">
                    {item.centro.municipio} - {item.centro.uf}
                </span>
                {item.centro.tiposSoro.length > 0 && (
                    <span className="nearest-item-soros">
                        {item.centro.tiposSoro.join(', ')}
                    </span>
                )}
            </div>
            <div className="nearest-item-distance">
                {item.distanceFormatted}
            </div>
        </li>
    );
}

/**
 * Panel for finding and displaying nearest distribution centers.
 * 
 * Features:
 * - Button to trigger location-based search
 * - Loading state with disabled button
 * - Error display with friendly messages
 * - Results list with distance
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
        <section className="nearest-panel" aria-labelledby="nearest-title">
            <header className="nearest-header">
                <h3 id="nearest-title" className="nearest-title">
                    Centros Mais Próximos
                </h3>
                <button
                    type="button"
                    onClick={onFindNearest}
                    disabled={isLoading}
                    className="btn-find-nearest"
                    aria-busy={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="btn-spinner" aria-hidden="true" />
                            Localizando...
                        </>
                    ) : (
                        <>
                            <span aria-hidden="true">📍</span> Encontrar Próximos
                        </>
                    )}
                </button>
            </header>

            {hasError && (
                <div className="nearest-error" role="alert">
                    <span aria-hidden="true">⚠️</span> {errorMessage}
                </div>
            )}

            {hasResults && (
                <>
                    <p className="nearest-count">
                        {results.length} {results.length === 1 ? 'centro encontrado' : 'centros encontrados'}
                    </p>
                    <ul className="nearest-list" role="list">
                        {results.map((item) => (
                            <NearestItem key={item.centro.id} item={item} />
                        ))}
                    </ul>
                    <button
                        type="button"
                        onClick={onClear}
                        className="btn-clear"
                    >
                        Limpar resultados
                    </button>
                </>
            )}

            {!hasResults && !hasError && !isLoading && (
                <p className="nearest-empty">
                    Clique em "Encontrar Próximos" para localizar os centros mais perto de você.
                </p>
            )}
        </section>
    );
}
