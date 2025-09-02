/**
 * Centralized selector configuration for Yahoo Finance automation
 * @description Maintains all CSS selectors in one place for easier maintenance
 */

/**
 * Yahoo Finance selector mappings
 * @description Contains all selectors used across Yahoo Finance page objects
 */
export const YAHOO_FINANCE_SELECTORS = {
    /** Home page selectors */
    HOME: {
        QUOTE_LOOKUP_INPUT: 'input[aria-label="Quote Lookup"]',
        SEARCH_BUTTON: 'button[data-module="SearchForm"]'
    },
    
    /** Quote page selectors */
    QUOTE: {
        QUOTE_LOOKUP_INPUT: 'input[aria-label="Quote Lookup"]',
        NEWS_TAB: 'a[href*="/news"]',
        HISTORY_TAB: 'a[href*="/history"]'
    },
    
    /** Historical data selectors */
    HISTORICAL: {
        DATE_RANGE_SELECTOR: 'div[data-test="date-picker-full-range"]',
        DATE_PICKER_MODAL: 'div[data-test="date-picker"]',
        START_DATE_INPUT: 'input[data-test="start-date"]',
        END_DATE_INPUT: 'input[data-test="end-date"]',
        DONE_BUTTON: 'button[data-test="date-picker-done"]',
        FREQUENCY_SELECTOR: 'div[data-ylk="interval-select"]',
        FREQUENCY_DROPDOWN: 'div[data-test="select-container"]',
        DATA_TABLE: 'table.table.yf-1jecxey',
        TABLE_ROWS: 'table.table.yf-1jecxey tbody tr'
    }
} as const;

/**
 * Common selector patterns for reusability
 * @description Generic selectors that can be used across different pages
 */
export const COMMON_SELECTORS = {
    LOADING_SPINNER: '[data-test="loading"]',
    ERROR_MESSAGE: '[data-test="error"]',
    MODAL_OVERLAY: '[data-test="modal"]',
    CLOSE_BUTTON: '[data-test="close"]'
} as const;
