/**
 * @fileoverview Main application component with routing.
 *
 * Sets up:
 * - React Router for navigation
 * - Global layout with Header and Footer
 * - Route definitions
 *
 * @module app/App
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '../ui/components/Header/Header';
import { Footer } from '../ui/components/Footer';
import { HomePage } from '../ui/pages/HomePage';
import { MetricsPage } from '../ui/pages/MetricsPage';
import { AboutPage } from '../ui/pages/AboutPage';
import { CentroDetailPage } from '../ui/pages/CentroDetailPage';
import { createLogger } from '../infrastructure/logging/logger';
const logger = createLogger('App');

/**
 * Root application component.
 *
 * Provides:
 * - Browser router context
 * - Consistent layout (Header, main content, Footer)
 * - Route definitions
 */
export function App() {
  logger.debug('App component mounted');

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/metricas" element={<MetricsPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/centro/:id" element={<CentroDetailPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
