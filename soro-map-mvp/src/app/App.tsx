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
import { getSection } from '../infrastructure/content';
import { createLogger } from '../infrastructure/logging/logger';

const logger = createLogger('App');

// Load content from declarative YAML
const placeholders = getSection('placeholders');

/**
 * Placeholder page for routes not yet implemented.
 */
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{placeholders.in_development}</p>
      </div>
    </div>
  );
}

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
            <Route path="/metricas" element={<PlaceholderPage title="Métricas" />} />
            <Route path="/sobre" element={<PlaceholderPage title="Sobre" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
