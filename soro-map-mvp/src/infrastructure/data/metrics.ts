/**
 * @fileoverview Metrics data from EDA analysis.
 *
 * Static data loaded from the EDA analysis results.
 * In production, this would be fetched from an API.
 *
 * @module infrastructure/data/metrics
 */

/**
 * Summary statistics for the antivenom database.
 */
export interface MetricsSummary {
    readonly totalCenters: number;
    readonly totalStates: number;
    readonly totalRegions: number;
    readonly totalMunicipalities: number;
    readonly centersWithCnes: number;
    readonly centersWithPhone: number;
    readonly centersWithCoordinates: number;
}

/**
 * Region statistics.
 */
export interface RegionData {
    readonly region: string;
    readonly totalCenters: number;
    readonly percentage: number;
    readonly states: number;
    readonly municipalities: number;
    readonly statesList: string[];
}

/**
 * State statistics.
 */
export interface StateData {
    readonly uf: string;
    readonly federalUnit: string;
    readonly region: string;
    readonly totalCenters: number;
    readonly percentage: number;
    readonly municipalities: number;
    readonly centersPerMunicipality: number;
}

/**
 * Geographic bounds and center.
 */
export interface GeographicStats {
    readonly totalWithCoordinates: number;
    readonly totalMissingCoordinates: number;
    readonly bounds: {
        readonly minLat: number;
        readonly maxLat: number;
        readonly minLng: number;
        readonly maxLng: number;
    };
    readonly center: {
        readonly lat: number;
        readonly lng: number;
    };
}

/**
 * Summary metrics from EDA analysis.
 */
export const metricsSummary: MetricsSummary = {
    totalCenters: 1895,
    totalStates: 26,
    totalRegions: 5,
    totalMunicipalities: 1678,
    centersWithCnes: 1895,
    centersWithPhone: 1895,
    centersWithCoordinates: 1895,
};

/**
 * Distribution by region from EDA analysis.
 */
export const byRegion: RegionData[] = [
    {
        region: "Southeast",
        totalCenters: 449,
        percentage: 23.69,
        states: 4,
        municipalities: 424,
        statesList: ["ES", "MG", "RJ", "SP"],
    },
    {
        region: "Northeast",
        totalCenters: 414,
        percentage: 21.85,
        states: 8,
        municipalities: 387,
        statesList: ["AL", "BA", "MA", "PB", "PE", "PI", "RN", "SE"],
    },
    {
        region: "South",
        totalCenters: 385,
        percentage: 20.32,
        states: 3,
        municipalities: 325,
        statesList: ["PR", "RS", "SC"],
    },
    {
        region: "North",
        totalCenters: 382,
        percentage: 20.16,
        states: 7,
        municipalities: 307,
        statesList: ["AC", "AM", "AP", "PA", "RO", "RR", "TO"],
    },
    {
        region: "Midwest",
        totalCenters: 265,
        percentage: 13.98,
        states: 4,
        municipalities: 257,
        statesList: ["DF", "GO", "MS", "MT"],
    },
];

/**
 * Distribution by state from EDA analysis.
 */
export const byState: StateData[] = [
    { uf: "PR", federalUnit: "Paraná", region: "South", totalCenters: 185, percentage: 9.76, municipalities: 137, centersPerMunicipality: 1.35 },
    { uf: "BA", federalUnit: "Bahia", region: "Northeast", totalCenters: 181, percentage: 9.55, municipalities: 169, centersPerMunicipality: 1.07 },
    { uf: "MG", federalUnit: "Minas Gerais", region: "Southeast", totalCenters: 180, percentage: 9.5, municipalities: 170, centersPerMunicipality: 1.06 },
    { uf: "SP", federalUnit: "São Paulo", region: "Southeast", totalCenters: 180, percentage: 9.5, municipalities: 170, centersPerMunicipality: 1.06 },
    { uf: "PA", federalUnit: "Pará", region: "North", totalCenters: 167, percentage: 8.81, municipalities: 133, centersPerMunicipality: 1.26 },
    { uf: "MA", federalUnit: "Maranhão", region: "Northeast", totalCenters: 155, percentage: 8.18, municipalities: 148, centersPerMunicipality: 1.05 },
    { uf: "SC", federalUnit: "Santa Catarina", region: "South", totalCenters: 141, percentage: 7.44, municipalities: 132, centersPerMunicipality: 1.07 },
    { uf: "MT", federalUnit: "Mato Grosso", region: "Midwest", totalCenters: 100, percentage: 5.28, municipalities: 95, centersPerMunicipality: 1.05 },
    { uf: "AM", federalUnit: "Amazonas", region: "North", totalCenters: 93, percentage: 4.91, municipalities: 62, centersPerMunicipality: 1.5 },
    { uf: "GO", federalUnit: "Goiás", region: "Midwest", totalCenters: 90, percentage: 4.75, municipalities: 89, centersPerMunicipality: 1.01 },
    { uf: "MS", federalUnit: "Mato Grosso do Sul", region: "Midwest", totalCenters: 66, percentage: 3.48, municipalities: 66, centersPerMunicipality: 1.0 },
    { uf: "ES", federalUnit: "Espírito Santo", region: "Southeast", totalCenters: 61, percentage: 3.22, municipalities: 59, centersPerMunicipality: 1.03 },
    { uf: "RS", federalUnit: "Rio Grande do Sul", region: "South", totalCenters: 59, percentage: 3.11, municipalities: 57, centersPerMunicipality: 1.04 },
    { uf: "RO", federalUnit: "Rondônia", region: "North", totalCenters: 37, percentage: 1.95, municipalities: 34, centersPerMunicipality: 1.09 },
    { uf: "TO", federalUnit: "Tocantins", region: "North", totalCenters: 37, percentage: 1.95, municipalities: 33, centersPerMunicipality: 1.12 },
    { uf: "RJ", federalUnit: "Rio de Janeiro", region: "Southeast", totalCenters: 28, percentage: 1.48, municipalities: 25, centersPerMunicipality: 1.12 },
    { uf: "AL", federalUnit: "Alagoas", region: "Northeast", totalCenters: 19, percentage: 1.0, municipalities: 17, centersPerMunicipality: 1.12 },
    { uf: "AC", federalUnit: "Acre", region: "North", totalCenters: 17, percentage: 0.9, municipalities: 17, centersPerMunicipality: 1.0 },
    { uf: "PI", federalUnit: "Piauí", region: "Northeast", totalCenters: 17, percentage: 0.9, municipalities: 17, centersPerMunicipality: 1.0 },
    { uf: "SE", federalUnit: "Sergipe", region: "Northeast", totalCenters: 17, percentage: 0.9, municipalities: 15, centersPerMunicipality: 1.13 },
    { uf: "AP", federalUnit: "Amapá", region: "North", totalCenters: 16, percentage: 0.84, municipalities: 15, centersPerMunicipality: 1.07 },
    { uf: "RR", federalUnit: "Roraima", region: "North", totalCenters: 15, percentage: 0.79, municipalities: 14, centersPerMunicipality: 1.07 },
    { uf: "PB", federalUnit: "Paraíba", region: "Northeast", totalCenters: 10, percentage: 0.53, municipalities: 10, centersPerMunicipality: 1.0 },
    { uf: "PE", federalUnit: "Pernambuco", region: "Northeast", totalCenters: 10, percentage: 0.53, municipalities: 9, centersPerMunicipality: 1.11 },
    { uf: "DF", federalUnit: "Distrito Federal", region: "Midwest", totalCenters: 9, percentage: 0.47, municipalities: 9, centersPerMunicipality: 1.0 },
    { uf: "RN", federalUnit: "Rio Grande do Norte", region: "Northeast", totalCenters: 5, percentage: 0.26, municipalities: 4, centersPerMunicipality: 1.25 },
];

/**
 * Geographic statistics from EDA analysis.
 */
export const geographicStats: GeographicStats = {
    totalWithCoordinates: 1895,
    totalMissingCoordinates: 0,
    bounds: {
        minLat: -33.5256,
        maxLat: 18.72761,
        minLng: -72.9085,
        maxLng: 64.791467,
    },
    center: {
        lat: -15.513585,
        lng: -48.825545,
    },
};

/**
 * Region name translations (English to Portuguese).
 */
export const regionNames: Record<string, string> = {
    Southeast: "Sudeste",
    Northeast: "Nordeste",
    South: "Sul",
    North: "Norte",
    Midwest: "Centro-Oeste",
};

/**
 * Color scheme for regions - categorical colors (for badges).
 * Using distinct emerald/teal/cyan shades for visual differentiation.
 */
export const regionColors: Record<string, string> = {
    Southeast: "#059669", // emerald-600
    Northeast: "#0D9488", // teal-600
    South: "#10B981",     // emerald-500
    North: "#14B8A6",     // teal-500
    Midwest: "#06B6D4",   // cyan-500
};

/**
 * Translates region name to Portuguese.
 *
 * @param region - Region name in English
 * @returns Region name in Portuguese
 */
export function translateRegion(region: string): string {
    return regionNames[region] ?? region;
}

/**
 * Gets color for a region (categorical).
 *
 * @param region - Region name
 * @returns Hex color code
 */
export function getRegionColor(region: string): string {
    return regionColors[region] ?? "#6B7280";
}

/**
 * Gets color based on value intensity for continuous data visualization.
 * Creates a gradient from dark emerald (high values) to light emerald (low values).
 *
 * @param value - The data value
 * @param minValue - Minimum value in the dataset
 * @param maxValue - Maximum value in the dataset
 * @returns Hex color code proportional to value
 */
export function getValueBasedColor(value: number, minValue: number, maxValue: number): string {
    const emeraldScale = [
        "#064E3B", // emerald-900 (darkest)
        "#065F46", // emerald-800
        "#047857", // emerald-700
        "#059669", // emerald-600
        "#10B981", // emerald-500
        "#34D399", // emerald-400
        "#6EE7B7", // emerald-300
        "#A7F3D0", // emerald-200 (lightest)
    ];

    // Normalize value to 0-1 range
    const normalizedValue = (value - minValue) / (maxValue - minValue);

    // Map to color scale (reverse so higher values = darker)
    const index = Math.floor((1 - normalizedValue) * (emeraldScale.length - 1));

    return emeraldScale[index];
}
