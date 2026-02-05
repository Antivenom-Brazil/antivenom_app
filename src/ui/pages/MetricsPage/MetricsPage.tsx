/**
 * @fileoverview Metrics page displaying statistics and charts.
 *
 * Features:
 * - Summary cards with key metrics
 * - Bar chart for regional distribution
 * - Data table with state-level details
 * - Export functionality
 *
 * @module ui/pages/MetricsPage
 */

import { useState, useMemo } from 'react';
import {
    Building2,
    MapPin,
    Globe,
    Map,
    Search,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
} from 'lucide-react';
import { getMetricsContent } from '../../../infrastructure/content';
import {
    metricsSummary,
    byRegion,
    byState,
    translateRegion,
    getRegionColor,
    getValueBasedColor,
    type StateData,
} from '../../../infrastructure/data/metrics';


// Load content
const content = getMetricsContent();

// Items per page for the table
const ITEMS_PER_PAGE = 10;

/**
 * Summary card component.
 */
interface SummaryCardProps {
    readonly icon: React.ReactNode;
    readonly value: number;
    readonly label: string;
    readonly description: string;
    readonly color: string;
}

function SummaryCard({ icon, value, label, description, color }: SummaryCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">
                        {value.toLocaleString('pt-BR')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{description}</p>
                </div>
                <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
            </div>
        </div>
    );
}

/**
 * Simple bar chart component (no external library).
 */
interface BarChartProps {
    readonly data: Array<{ name: string; value: number; color: string }>;
    readonly maxValue: number;
}

function SimpleBarChart({ data, maxValue }: BarChartProps) {
    return (
        <div className="space-y-3">
            {data.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-600 truncate">{item.name}</div>
                    <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                            className="h-full rounded-lg transition-all duration-500"
                            style={{
                                width: `${(item.value / maxValue) * 100}%`,
                                backgroundColor: item.color,
                            }}
                        />
                    </div>
                    <div className="w-16 text-sm font-medium text-gray-900 text-right">
                        {item.value.toLocaleString('pt-BR')}
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Data table component with pagination and search.
 */
interface DataTableProps {
    readonly data: StateData[];
    readonly searchTerm: string;
    readonly onSearchChange: (term: string) => void;
}

function DataTable({ data, searchTerm, onSearchChange }: DataTableProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Filter data based on search
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        const term = searchTerm.toLowerCase();
        return data.filter(
            (item) =>
                item.uf.toLowerCase().includes(term) ||
                item.federalUnit.toLowerCase().includes(term) ||
                translateRegion(item.region).toLowerCase().includes(term)
        );
    }, [data, searchTerm]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);



    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{content.table.title}</h3>
                        <p className="text-sm text-gray-500">{content.table.description}</p>
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={content.table.search.placeholder}
                            value={searchTerm}
                            onChange={(e) => {
                                onSearchChange(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700"
                            aria-label={content.table.search.aria_label}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {content.table.columns.uf}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {content.table.columns.federal_unit}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {content.table.columns.region}
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {content.table.columns.total_centers}
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {content.table.columns.municipalities}
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {content.table.columns.percentage}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedData.map((item) => (
                            <tr key={item.uf} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.uf}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{item.federalUnit}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className="inline-flex px-2 py-1 text-xs font-medium rounded-full"
                                        style={{
                                            backgroundColor: `${getRegionColor(item.region)}20`,
                                            color: getRegionColor(item.region),
                                        }}
                                    >
                                        {translateRegion(item.region)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                                    {item.totalCenters.toLocaleString('pt-BR')}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 text-right">
                                    {item.municipalities.toLocaleString('pt-BR')}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 text-right">
                                    {item.percentage.toFixed(2)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    {content.table.pagination.showing} {startIndex + 1}-
                    {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} {content.table.pagination.of}{' '}
                    {filteredData.length} {content.table.pagination.results}
                </p>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-600">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Metrics page component.
 */
export function MetricsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    // Prepare chart data with value-based colors for continuous data
    const regionChartData = byRegion.map((r) => ({
        name: translateRegion(r.region),
        value: r.totalCenters,
        color: getValueBasedColor(
            r.totalCenters,
            Math.min(...byRegion.map(x => x.totalCenters)),
            Math.max(...byRegion.map(x => x.totalCenters))
        ),
    }));

    const stateChartData = byState.slice(0, 10).map((s) => ({
        name: s.uf,
        value: s.totalCenters,
        color: getValueBasedColor(
            s.totalCenters,
            Math.min(...byState.slice(0, 10).map(x => x.totalCenters)),
            Math.max(...byState.slice(0, 10).map(x => x.totalCenters))
        ),
    }));

    const maxRegionValue = Math.max(...byRegion.map((r) => r.totalCenters));
    const maxStateValue = Math.max(...byState.slice(0, 10).map((s) => s.totalCenters));

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-8 h-8 text-emerald-700" />
                        <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
                    </div>
                    <p className="text-gray-600">{content.description}</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <SummaryCard
                        icon={<Building2 className="w-6 h-6 text-white" />}
                        value={metricsSummary.totalCenters}
                        label={content.summary.cards.total_centers.label}
                        description={content.summary.cards.total_centers.description}
                        color="bg-emerald-700"
                    />
                    <SummaryCard
                        icon={<MapPin className="w-6 h-6 text-white" />}
                        value={metricsSummary.totalStates}
                        label={content.summary.cards.total_states.label}
                        description={content.summary.cards.total_states.description}
                        color="bg-emerald-700"
                    />
                    <SummaryCard
                        icon={<Map className="w-6 h-6 text-white" />}
                        value={metricsSummary.totalMunicipalities}
                        label={content.summary.cards.total_municipalities.label}
                        description={content.summary.cards.total_municipalities.description}
                        color="bg-emerald-700"
                    />
                    <SummaryCard
                        icon={<Globe className="w-6 h-6 text-white" />}
                        value={metricsSummary.totalRegions}
                        label={content.summary.cards.total_regions.label}
                        description={content.summary.cards.total_regions.description}
                        color="bg-emerald-700"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* By Region Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {content.charts.by_region.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">{content.charts.by_region.description}</p>
                        <SimpleBarChart data={regionChartData} maxValue={maxRegionValue} />
                    </div>

                    {/* Top 10 States Chart */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {content.charts.by_state.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">{content.charts.by_state.description}</p>
                        <SimpleBarChart data={stateChartData} maxValue={maxStateValue} />
                    </div>
                </div>

                {/* Data Table */}
                <DataTable data={byState} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            </div>
        </div>
    );
}
