/**
 * @fileoverview Centralized logging infrastructure for the application.
 * 
 * Uses loglevel for lightweight, configurable logging.
 * Provides structured logging with context for debugging and monitoring.
 * 
 * @module infrastructure/logging/logger
 */

import log from 'loglevel';

/**
 * Log levels available in the application.
 * Maps to loglevel's internal levels.
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

/**
 * Context object for structured logging.
 * Allows adding metadata to log entries.
 */
export interface LogContext {
    /** Module or component name */
    module?: string;
    /** Function or method name */
    function?: string;
    /** Additional metadata (no sensitive data!) */
    metadata?: Record<string, unknown>;
}

/**
 * Determines log level based on environment.
 * - Development: debug level for more verbose output
 * - Production: warn level to reduce noise
 */
function getEnvironmentLogLevel(): LogLevel {
    const isDev = import.meta.env.DEV;
    return isDev ? 'debug' : 'warn';
}

// Configure log level on initialization
log.setLevel(getEnvironmentLogLevel());

/**
 * Formats log message with context for structured output.
 * 
 * @param message - The log message
 * @param context - Optional context object
 * @returns Formatted message string
 */
function formatMessage(message: string, context?: LogContext): string {
    if (!context) return message;

    const parts: string[] = [];

    if (context.module) {
        parts.push(`[${context.module}]`);
    }

    if (context.function) {
        parts.push(`(${context.function})`);
    }

    parts.push(message);

    return parts.join(' ');
}

/**
 * Creates a namespaced logger for a specific module.
 * Useful for component-specific logging with automatic context.
 * 
 * @param moduleName - Name of the module/component
 * @returns Logger instance with module context
 * 
 * @example
 * ```ts
 * const logger = createLogger('GeolocationAdapter');
 * logger.info('Requesting user position');
 * logger.error('Permission denied', { metadata: { code: 1 } });
 * ```
 */
export function createLogger(moduleName: string) {
    return {
        trace: (message: string, context?: Omit<LogContext, 'module'>) => {
            log.trace(formatMessage(message, { ...context, module: moduleName }));
        },
        debug: (message: string, context?: Omit<LogContext, 'module'>) => {
            log.debug(formatMessage(message, { ...context, module: moduleName }));
        },
        info: (message: string, context?: Omit<LogContext, 'module'>) => {
            log.info(formatMessage(message, { ...context, module: moduleName }));
        },
        warn: (message: string, context?: Omit<LogContext, 'module'>) => {
            log.warn(formatMessage(message, { ...context, module: moduleName }));
        },
        error: (message: string, context?: Omit<LogContext, 'module'>) => {
            log.error(formatMessage(message, { ...context, module: moduleName }));
        },
    };
}

/**
 * Global logger instance for general use.
 * Prefer createLogger() for component-specific logging.
 */
export const logger = {
    trace: (message: string, context?: LogContext) => {
        log.trace(formatMessage(message, context));
    },
    debug: (message: string, context?: LogContext) => {
        log.debug(formatMessage(message, context));
    },
    info: (message: string, context?: LogContext) => {
        log.info(formatMessage(message, context));
    },
    warn: (message: string, context?: LogContext) => {
        log.warn(formatMessage(message, context));
    },
    error: (message: string, context?: LogContext) => {
        log.error(formatMessage(message, context));
    },
    /**
     * Sets the log level at runtime.
     * Useful for debugging in production.
     */
    setLevel: (level: LogLevel) => {
        log.setLevel(level);
    },
};

export default logger;
