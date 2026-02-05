/**
 * @fileoverview Application header component with navigation.
 *
 * Provides:
 * - Logo and title
 * - Main navigation links
 * - Mobile-responsive hamburger menu
 *
 * @module ui/components/Header
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, BarChart3, Info } from 'lucide-react';
import { getSection } from '../../../infrastructure/content';
import { createLogger } from '../../../infrastructure/logging/logger';

const logger = createLogger('Header');

// Load content from declarative YAML
const content = getSection('header');

/**
 * Navigation item configuration.
 */
interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly icon: React.ReactNode;
}

/**
 * Available navigation items with icons.
 */
const NAV_ITEMS: NavItem[] = [
  { label: content.nav.home.label, path: content.nav.home.path, icon: <MapPin className="w-4 h-4" /> },
  { label: content.nav.metrics.label, path: content.nav.metrics.path, icon: <BarChart3 className="w-4 h-4" /> },
  { label: content.nav.about.label, path: content.nav.about.path, icon: <Info className="w-4 h-4" /> },
];

/**
 * Application header with responsive navigation.
 *
 * Features:
 * - Logo linked to home
 * - Desktop horizontal navigation
 * - Mobile hamburger menu with slide-in drawer
 * - Active state highlighting
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    logger.debug('Mobile menu toggled', { function: 'toggleMobileMenu' });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors"
            onClick={closeMobileMenu}
          >
            <MapPin className="w-6 h-6" />
            <span className="font-bold text-lg hidden sm:inline">
              {content.logo_text}
            </span>
            <span className="font-bold text-lg sm:hidden">
              {content.logo_text_mobile}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" role="navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${isActive(item.path)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? content.aria.close_menu : content.aria.open_menu}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-3 space-y-1" role="navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium
                  transition-colors duration-200
                  ${isActive(item.path)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                onClick={closeMobileMenu}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
