/**
 * Browser configuration for RPA automation
 * Defines standard settings for Puppeteer browser instances
 */

import type { LaunchOptions } from 'puppeteer';

/**
 * Default browser configuration for RPA automation
 * @description Standard Puppeteer launch options optimized for web scraping and automation
 */
export const DEFAULT_BROWSER_CONFIG: LaunchOptions = {
    headless: false, // Set to true for production environments
    defaultViewport: {
        width: 1920,
        height: 1080
    },
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
    ]
};

/**
 * Headless browser configuration for production environments
 * @description Optimized for server environments without display
 */
export const HEADLESS_BROWSER_CONFIG: LaunchOptions = {
    ...DEFAULT_BROWSER_CONFIG,
    headless: true
};

/**
 * Debug browser configuration with extended timeouts
 * @description Useful for development and debugging automation scripts
 */
export const DEBUG_BROWSER_CONFIG: LaunchOptions = {
    ...DEFAULT_BROWSER_CONFIG,
    headless: false,
    devtools: true,
    slowMo: 100 // Slow down operations by 100ms for debugging
};
