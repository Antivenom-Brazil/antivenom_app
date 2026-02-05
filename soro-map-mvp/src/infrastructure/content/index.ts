/**
 * @fileoverview UI content loader and accessor.
 *
 * Provides type-safe access to declarative YAML content.
 * Enables centralized text management and future i18n support.
 *
 * @module infrastructure/content
 */

import { createLogger } from '../logging/logger';

const logger = createLogger('UIContent');

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

interface NavItem {
    label: string;
    path: string;
}

/**
 * Static content loaded from YAML.
 * In a production app, this would be loaded dynamically.
 */
const content: UIContent = {
    app: {
        name: "Mapa Antiveneno",
        title: "Mapa de Soro Antiveneno",
        description: "Ferramenta para localização de centros de atendimento com soros antiofídicos disponíveis em todo o Brasil",
    },
    header: {
        logo_text: "Mapa Antiveneno",
        logo_text_mobile: "Antiveneno",
        nav: {
            home: { label: "Home", path: "/" },
            metrics: { label: "Métricas", path: "/metricas" },
            about: { label: "Sobre", path: "/sobre" },
        },
        aria: {
            open_menu: "Open menu",
            close_menu: "Close menu",
        },
    },
    hero_banner: {
        title: "Mapa de Soro Antiveneno",
        tagline: "Localize os centros de atendimento mais próximos com soros antiofídicos disponíveis em todo o Brasil",
        cta: {
            explore_map: "Explorar Mapa",
            view_stats: "Ver Estatísticas",
        },
        metrics: {
            centers: { label: "Centros" },
            states: { label: "Estados" },
            regions: { label: "Regiões" },
        },
    },
    map_section: {
        title: "Mapa Interativo",
        description: "Visualize os centros de distribuição e encontre o mais próximo de você",
    },
    map_panel: {
        controls: {
            points: "Pontos",
            heatmap: "Heatmap",
            my_location: "Minha Localização",
            locating: "Localizando...",
            located: "Localizado",
        },
        errors: {
            token_missing: "Mapbox token not configured. Set VITE_MAPBOX_TOKEN in .env file",
            map_error: "Error creating map",
        },
        aria: {
            show_location: "Show my location",
        },
    },
    nearest_panel: {
        title: "Centros Mais Próximos",
        button: {
            find: "Encontrar Próximos",
            loading: "Localizando...",
            clear: "Limpar",
        },
        results: {
            single: "centro encontrado",
            plural: "centros encontrados",
        },
        empty_state: "Clique no botão acima para localizar os centros mais perto de você.",
    },
    footer: {
        about: {
            title: "Mapa de Soro Antiveneno",
            description: "Ferramenta para localização de centros de atendimento com soros antiofídicos disponíveis em todo o Brasil.",
        },
        links: {
            title: "Links",
            map: "Mapa",
            metrics: "Métricas",
            about: "Sobre o Projeto",
        },
        data_sources: {
            title: "Fontes de Dados",
            items: [
                "Ministério da Saúde",
                "CNES - Cadastro Nacional",
                "Secretarias Estaduais",
            ],
        },
        copyright: "© {year} Mapa Antiveneno. Dados abertos.",
        made_with: "Feito com",
        location: "no Brasil",
    },
    placeholders: {
        in_development: "Em desenvolvimento",
    },
    errors: {
        generic: "Ocorreu um erro. Tente novamente.",
        location_denied: "Permissão de localização negada. Verifique as configurações do navegador.",
        location_unavailable: "Não foi possível determinar sua localização. Tente novamente.",
        location_timeout: "Tempo limite excedido ao obter localização. Tente novamente.",
        location_unsupported: "Seu navegador não suporta geolocalização.",
    },
};

/**
 * Gets the full UI content object.
 *
 * @returns Complete UI content structure
 */
export function getUIContent(): UIContent {
    logger.debug('UI content accessed');
    return content;
}

/**
 * Gets a specific section of UI content.
 *
 * @param section - The section key to retrieve
 * @returns The requested content section
 */
export function getSection<K extends keyof UIContent>(section: K): UIContent[K] {
    return content[section];
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
