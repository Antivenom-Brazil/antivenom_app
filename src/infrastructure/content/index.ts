/**
 * @fileoverview YAML content loader with type safety.
 *
 * Loads content from YAML files and provides type-safe access.
 * Uses Vite's raw import to include YAML at build time.
 *
 * @module infrastructure/content
 */

import YAML from 'yaml';
import { createLogger } from '../logging/logger';

// Import YAML files as raw strings (Vite feature)
import uiContentYaml from './ui-content.yaml?raw';
import metricsContentYaml from './metrics-content.yaml?raw';
import aboutContentYaml from './about-content.yaml?raw';
import centroDetailsContentYaml from './centro-details-content.yaml?raw';

const logger = createLogger('ContentLoader');

/**
 * Navigation item structure.
 */
interface NavItem {
    label: string;
    path: string;
}

/**
 * UI Content structure matching ui-content.yaml
 */
export interface UIContent {
    app: {
        name: string;
        title: string;
        description: string;
    };
    header: {
        logo_text: string;
        logo_text_mobile: string;
        nav: {
            home: NavItem;
            metrics: NavItem;
            about: NavItem;
        };
        aria: {
            open_menu: string;
            close_menu: string;
        };
    };
    hero_banner: {
        title: string;
        tagline: string;
        cta: {
            explore_map: string;
            view_stats: string;
        };
        metrics: {
            centers: { label: string };
            states: { label: string };
            regions: { label: string };
        };
    };
    map_section: {
        title: string;
        description: string;
    };
    map_panel: {
        controls: {
            points: string;
            heatmap: string;
            my_location: string;
            locating: string;
            located: string;
        };
        errors: {
            token_missing: string;
            map_error: string;
        };
        aria: {
            show_location: string;
        };
    };
    nearest_panel: {
        title: string;
        button: {
            find: string;
            loading: string;
            clear: string;
        };
        results: {
            single: string;
            plural: string;
        };
        empty_state: string;
        click_hint: string;
    };
    footer: {
        about: {
            title: string;
            description: string;
        };
        links: {
            title: string;
            map: string;
            metrics: string;
            about: string;
        };
        data_sources: {
            title: string;
            items: string[];
        };
        copyright: string;
        made_with: string;
        location: string;
    };
    placeholders: {
        in_development: string;
    };
    errors: {
        generic: string;
        location_denied: string;
        location_unavailable: string;
        location_timeout: string;
        location_unsupported: string;
    };
}

/**
 * Metrics page content structure.
 */
export interface MetricsPageContent {
    title: string;
    description: string;
    summary: {
        title: string;
        cards: {
            total_centers: { label: string; description: string };
            total_states: { label: string; description: string };
            total_municipalities: { label: string; description: string };
            total_regions: { label: string; description: string };
        };
    };
    charts: {
        by_region: { title: string; description: string; x_axis: string; y_axis: string };
        by_state: { title: string; description: string; x_axis: string; y_axis: string };
        region_pie: { title: string; description: string };
    };
    table: {
        title: string;
        description: string;
        columns: Record<string, string>;
        actions: { export_csv: string; export_json: string };
        pagination: { showing: string; of: string; results: string; previous: string; next: string };
        search: { placeholder: string; aria_label: string };
    };
    filters: {
        title: string;
        region: { label: string; all: string };
        reset: string;
    };
    region_names: Record<string, string>;
    region_colors: Record<string, string>;
}

/**
 * About page content structure.
 */
export interface AboutPageContent {
    title: string;
    description: string;
    hero: {
        title: string;
        content: string;
        highlight: string;
    };
    pillars: Array<{
        id: string;
        title: string;
        icon: string;
        content: string;
    }>;
    how_it_works: {
        title: string;
        description: string;
        steps: Array<{
            number: number;
            title: string;
            description: string;
        }>;
    };
    features: {
        title: string;
        items: Array<{
            icon: string;
            title: string;
            description: string;
        }>;
    };
    data_sources: {
        title: string;
        description: string;
        sources: Array<{
            name: string;
            description: string;
        }>;
    };
    disclaimer: {
        title: string;
        content: string;
        emergency: string;
    };
    cta: {
        title: string;
        description: string;
        button_map: string;
        button_metrics: string;
    };
}

/**
 * Centro details page content structure.
 */
export interface CentroDetailsContent {
    back_button: string;
    not_found: {
        title: string;
        description: string;
        button: string;
    };
    sections: {
        location: {
            title: string;
            address: string;
            municipality: string;
            state: string;
            region: string;
            coordinates: string;
        };
        contact: {
            title: string;
            phone: string;
            cnes: string;
            cnes_description: string;
        };
        serums: {
            title: string;
            empty: string;
        };
        attendance: {
            title: string;
            type: string;
            info: string;
        };
    };
    actions: {
        route: string;
        route_description: string;
        call: string;
        share: string;
        copy_address: string;
        copied: string;
    };
    map: {
        title: string;
    };
    aria: {
        back: string;
        call_phone: string;
        open_maps: string;
        share_center: string;
    };
}

// Parse YAML content at module load time (build time with Vite)
const uiContent: UIContent = YAML.parse(uiContentYaml);
const metricsRaw = YAML.parse(metricsContentYaml);
const metricsContent: MetricsPageContent = metricsRaw.metrics_page;
const aboutRaw = YAML.parse(aboutContentYaml);
const aboutContent: AboutPageContent = aboutRaw.about_page;
const centroDetailsRaw = YAML.parse(centroDetailsContentYaml);
const centroDetailsContent: CentroDetailsContent = centroDetailsRaw.centro_details;

logger.debug('Content loaded from YAML files');

/**
 * Gets the full UI content object.
 *
 * @returns Complete UI content structure
 */
export function getUIContent(): UIContent {
    return uiContent;
}

/**
 * Gets a specific section of UI content.
 *
 * @param section - The section key to retrieve
 * @returns The requested content section
 */
export function getSection<K extends keyof UIContent>(section: K): UIContent[K] {
    return uiContent[section];
}

/**
 * Gets the metrics page content.
 *
 * @returns Metrics page content object
 */
export function getMetricsContent(): MetricsPageContent {
    return metricsContent;
}

/**
 * Gets the about page content.
 *
 * @returns About page content object
 */
export function getAboutContent(): AboutPageContent {
    return aboutContent;
}

/**
 * Gets the centro details page content.
 *
 * @returns Centro details page content object
 */
export function getCentroDetailsContent(): CentroDetailsContent {
    return centroDetailsContent;
}

/**
 * Formats a string with variable substitution.
 *
 * @param template - String with {variable} placeholders
 * @param values - Object with values to substitute
 * @returns Formatted string
 *
 * @example
 * formatString("Hello {name}!", { name: "World" })
 * // Returns: "Hello World!"
 */
export function formatString(
    template: string,
    values: Record<string, string | number>
): string {
    return template.replace(
        /\{(\w+)\}/g,
        (_, key) => String(values[key] ?? `{${key}}`)
    );
}

/**
 * Gets pluralized text based on count.
 *
 * @param count - Number for pluralization
 * @param singular - Singular form
 * @param plural - Plural form
 * @returns Appropriate form based on count
 */
export function pluralize(count: number, singular: string, plural: string): string {
    return count === 1 ? singular : plural;
}
