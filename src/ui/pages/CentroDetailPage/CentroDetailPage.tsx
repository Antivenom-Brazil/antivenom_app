/**
 * @fileoverview Centro details page displaying individual center information.
 *
 * Features:
 * - Center information (name, address, municipality, state)
 * - Contact details (phone, CNES)
 * - Available serum types
 * - Mini map with location
 * - Action buttons (route, call, share)
 *
 * @module ui/pages/CentroDetailPage
 */

import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    MapPin,
    Phone,
    Building2,
    Navigation,
    Share2,
    AlertCircle,
    Syringe,
    Map,
    ExternalLink,
    Loader2,
} from 'lucide-react';
import { getCentroDetailsContent } from '../../../infrastructure/content';
import { loadCentros, findCentroById } from '../../../infrastructure/data/centrosData';
import type { Centro } from '../../../domain/models/Centro';

// Load content
const content = getCentroDetailsContent();

/**
 * Gets a region name from UF code.
 */
function getRegionFromUF(uf: string): string {
    const regions: Record<string, string> = {
        AC: 'Norte', AM: 'Norte', AP: 'Norte', PA: 'Norte', RO: 'Norte', RR: 'Norte', TO: 'Norte',
        AL: 'Nordeste', BA: 'Nordeste', CE: 'Nordeste', MA: 'Nordeste', PB: 'Nordeste',
        PE: 'Nordeste', PI: 'Nordeste', RN: 'Nordeste', SE: 'Nordeste',
        DF: 'Centro-Oeste', GO: 'Centro-Oeste', MS: 'Centro-Oeste', MT: 'Centro-Oeste',
        ES: 'Sudeste', MG: 'Sudeste', RJ: 'Sudeste', SP: 'Sudeste',
        PR: 'Sul', RS: 'Sul', SC: 'Sul',
    };
    return regions[uf] ?? 'Desconhecida';
}

/**
 * Serum badge colors.
 */
const serumColors: Record<string, string> = {
    Antibotrópico: 'bg-emerald-100 text-emerald-800',
    Anticrotálico: 'bg-amber-100 text-amber-800',
    Antilaquético: 'bg-purple-100 text-purple-800',
    Antielapídico: 'bg-blue-100 text-blue-800',
};

/**
 * Serum badge component.
 */
function SerumBadge({ serum }: { readonly serum: string }) {
    const colorClass = serumColors[serum] ?? 'bg-gray-100 text-gray-800';
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${colorClass}`}>
            <Syringe className="w-4 h-4" />
            {serum}
        </span>
    );
}

/**
 * Info row component.
 */
interface InfoRowProps {
    readonly icon: React.ReactNode;
    readonly label: string;
    readonly value: string | undefined;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className="text-gray-400 mt-0.5">{icon}</div>
            <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
                <p className="text-gray-900 font-medium">{value}</p>
            </div>
        </div>
    );
}

/**
 * Loading component.
 */
function LoadingState() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Carregando...</p>
            </div>
        </div>
    );
}

/**
 * Not found component.
 */
function CentroNotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{content.not_found.title}</h1>
                <p className="text-gray-600 mb-6">{content.not_found.description}</p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                    <Map className="w-5 h-5" />
                    {content.not_found.button}
                </Link>
            </div>
        </div>
    );
}

/**
 * Centro details page component.
 */
export function CentroDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [centro, setCentro] = useState<Centro | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Load centro data
    useEffect(() => {
        async function load() {
            setIsLoading(true);
            try {
                await loadCentros();
                const found = findCentroById(id ?? '');
                if (found) {
                    setCentro(found);
                } else {
                    setNotFound(true);
                }
            } catch {
                setNotFound(true);
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, [id]);

    // Generate Google Maps URL
    const mapsUrl = centro
        ? `https://www.google.com/maps/dir/?api=1&destination=${centro.latitude},${centro.longitude}`
        : '';

    // Handle share
    const handleShare = async () => {
        if (!centro) return;
        const shareData = {
            title: centro.nome,
            text: `${centro.nome} - ${centro.municipio}, ${centro.uf}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch {
                // User cancelled
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    if (isLoading) {
        return <LoadingState />;
    }

    if (notFound || !centro) {
        return <CentroNotFound />;
    }

    const region = centro.regiao ?? getRegionFromUF(centro.uf);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
                        aria-label={content.aria.back}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {content.back_button}
                    </button>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/10 rounded-lg">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">{centro.nome}</h1>
                            <p className="text-white/80 mt-1">
                                {centro.municipio}, {centro.uf} • {region}
                                {centro.cnes && <span> • CNES: {centro.cnes}</span>}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Location Section */}
                        <section className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-emerald-600" />
                                {content.sections.location.title}
                            </h2>

                            <InfoRow
                                label={content.sections.location.address}
                                value={centro.endereco}
                            />
                        </section>

                        {/* Serums Section */}
                        <section className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Syringe className="w-5 h-5 text-emerald-600" />
                                {content.sections.serums.title}
                            </h2>

                            {centro.tiposSoro.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {centro.tiposSoro.map((serum) => (
                                        <SerumBadge key={serum} serum={serum} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">{content.sections.serums.empty}</p>
                            )}
                        </section>

                        {/* Contact Section */}
                        {centro.telefone && (
                            <section className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-emerald-600" />
                                    {content.sections.contact.title}
                                </h2>

                                <InfoRow
                                    icon={<Phone className="w-5 h-5" />}
                                    label={content.sections.contact.phone}
                                    value={centro.telefone}
                                />
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Share Action */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <button
                                type="button"
                                onClick={handleShare}
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                aria-label={content.aria.share_center}
                            >
                                <Share2 className="w-5 h-5" />
                                {content.actions.share}
                            </button>
                        </div>

                        {/* Map Location Card */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-emerald-600" />
                                    {content.map.title}
                                </h3>
                            </div>



                            {/* Map Visual Placeholder */}
                            <div className="aspect-[4/3] bg-gradient-to-br from-emerald-100 via-emerald-50 to-blue-50 flex items-center justify-center relative">
                                {/* Decorative map grid */}
                                <div className="absolute inset-0 opacity-20">
                                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#059669" strokeWidth="0.5" />
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" fill="url(#grid)" />
                                    </svg>
                                </div>

                                {/* Center pin */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg animate-pulse">
                                        <MapPin className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="w-4 h-4 bg-emerald-500 rotate-45 -mt-2 shadow-lg" />
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="p-4">
                                <a
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                                    aria-label={content.aria.open_maps}
                                >
                                    <Navigation className="w-5 h-5" />
                                    {content.actions.route_description}
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
