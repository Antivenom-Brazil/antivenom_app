/**
 * @fileoverview About page displaying project information.
 *
 * Features:
 * - Project purpose and importance
 * - Mission, Vision, Values pillars
 * - How it works section
 * - Features overview
 * - Data sources
 * - Emergency disclaimer
 *
 * @module ui/pages/AboutPage
 */

import { Link } from 'react-router-dom';
import {
    Map,
    Navigation,
    BarChart3,
    Smartphone,
    Database,
    AlertTriangle,
    ArrowRight,
    Sparkles,
} from 'lucide-react';
import { getAboutContent, type AboutPageContent } from '../../../infrastructure/content';

// Load content
const content = getAboutContent();

/**
 * Maps icon names from YAML to Lucide components.
 */
const iconMap: Record<string, React.ReactNode> = {
    map: <Map className="w-6 h-6" />,
    navigation: <Navigation className="w-6 h-6" />,
    'bar-chart': <BarChart3 className="w-6 h-6" />,
    smartphone: <Smartphone className="w-6 h-6" />,
};

/**
 * Step card for How It Works section.
 */
interface StepCardProps {
    readonly step: AboutPageContent['how_it_works']['steps'][0];
}

function StepCard({ step }: StepCardProps) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                {step.number}
            </div>
            <div>
                <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
            </div>
        </div>
    );
}

/**
 * Feature card component.
 */
interface FeatureCardProps {
    readonly feature: AboutPageContent['features']['items'][0];
}

function FeatureCard({ feature }: FeatureCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="inline-flex p-2 rounded-lg bg-emerald-50 text-emerald-600 mb-3">
                {iconMap[feature.icon] ?? <Sparkles className="w-5 h-5" />}
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
            <p className="text-sm text-gray-600">{feature.description}</p>
        </div>
    );
}

/**
 * Data source item component.
 */
interface DataSourceItemProps {
    readonly source: AboutPageContent['data_sources']['sources'][0];
}

function DataSourceItem({ source }: DataSourceItemProps) {
    return (
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Database className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
                <h4 className="font-medium text-gray-900">{source.name}</h4>
                <p className="text-sm text-gray-500">{source.description}</p>
            </div>
        </div>
    );
}

/**
 * About page component.
 */
export function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">{content.title}</h1>
                    <p className="text-lg text-white/90 mb-8">{content.description}</p>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
                        <h2 className="text-xl font-semibold mb-3">{content.hero.title}</h2>
                        <p className="text-white/90 leading-relaxed mb-4">
                            {content.hero.content}
                        </p>
                        <p className="text-emerald-200 font-medium italic">
                            "{content.hero.highlight}"
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* How It Works */}
                <section className="mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {content.how_it_works.title}
                        </h2>
                        <p className="text-gray-600">{content.how_it_works.description}</p>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-6">
                        {content.how_it_works.steps.map((step) => (
                            <StepCard key={step.number} step={step} />
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section className="mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {content.features.title}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {content.features.items.map((feature) => (
                            <FeatureCard key={feature.icon} feature={feature} />
                        ))}
                    </div>
                </section>

                {/* Data Sources */}
                <section className="mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {content.data_sources.title}
                        </h2>
                        <p className="text-gray-600">{content.data_sources.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {content.data_sources.sources.map((source) => (
                            <DataSourceItem key={source.name} source={source} />
                        ))}
                    </div>
                </section>

                {/* Disclaimer */}
                <section className="mb-16">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-amber-800 mb-2">
                                    {content.disclaimer.title}
                                </h3>
                                <p className="text-amber-700 text-sm leading-relaxed mb-3">
                                    {content.disclaimer.content}
                                </p>
                                <p className="text-amber-800 font-bold">
                                    {content.disclaimer.emergency}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="text-center bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.cta.title}</h2>
                    <p className="text-gray-600 mb-6">{content.cta.description}</p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                        >
                            <Map className="w-5 h-5" />
                            {content.cta.button_map}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/metricas"
                            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            <BarChart3 className="w-5 h-5" />
                            {content.cta.button_metrics}
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
