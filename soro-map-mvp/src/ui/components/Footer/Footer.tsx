/**
 * @fileoverview Footer component for the application.
 *
 * Displays:
 * - Copyright information
 * - Quick links
 * - Data source attribution
 *
 * @module ui/components/Footer
 */

import { Link } from 'react-router-dom';
import { Github, Heart } from 'lucide-react';

/**
 * Application footer with copyright and links.
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">
                            Mapa de Soro Antiveneno
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Ferramenta para localização de centros de atendimento com soros
                            antiofídicos disponíveis em todo o Brasil.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    to="/"
                                    className="hover:text-white transition-colors"
                                >
                                    Mapa
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/metricas"
                                    className="hover:text-white transition-colors"
                                >
                                    Métricas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/sobre"
                                    className="hover:text-white transition-colors"
                                >
                                    Sobre o Projeto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Data Sources */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">Fontes de Dados</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>Ministério da Saúde</li>
                            <li>CNES - Cadastro Nacional</li>
                            <li>Secretarias Estaduais</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-400">
                        © {currentYear} Mapa Antiveneno. Dados abertos.
                    </p>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-colors"
                            aria-label="GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <span className="flex items-center gap-1 text-sm text-gray-400">
                            Feito com <Heart className="w-4 h-4 text-red-500" /> no Brasil
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
