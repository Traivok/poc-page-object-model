/**
 * Yahoo Finance Quote Sub-Page Models
 * @description Page Object Models for Yahoo Finance quote-related pages (news, charts, historical data)
 * @author RPA Team
 */

import { PageModel, type PageModelConstructorArguments } from "../../models";
import { YAHOO_FINANCE_SELECTORS } from "../../config/selectors.config";

/**
 * Abstract base class for Yahoo Finance quote sub-pages
 * @description Provides common functionality for all quote-related sub-pages
 * @abstract
 * @extends PageModel
 */
export abstract class YahooFinanceQuoteSubPageModel extends PageModel {
    /** URL pattern that validates the specific sub-page */
    protected abstract urlPattern: RegExp;

    /**
     * Creates an instance of YahooFinanceQuoteSubPageModel
     * @param {PageModelConstructorArguments} args - Constructor arguments containing page instance
     */
    constructor(args: PageModelConstructorArguments) {
        super(args);
    }

    /**
     * Validates if the current page matches the expected quote sub-page
     * @description Checks for quote lookup element and validates URL pattern
     * @returns {Promise<boolean>} True if on the correct quote sub-page, false otherwise
     * @throws {Error} When page validation fails due to network or DOM issues
     */
    public override async isInPage(): Promise<boolean> {
        console.log('[YahooFinanceQuoteSubPageModel] Checking if in page...');
        
        try {
            // Common requirement for all quote pages - presence of quote lookup
            const hasQuoteLookup = await this.page.$(YAHOO_FINANCE_SELECTORS.QUOTE.QUOTE_LOOKUP_INPUT);
            console.log('[YahooFinanceQuoteSubPageModel] Quote lookup element found:', !!hasQuoteLookup);
            if (!hasQuoteLookup) return false;

            // Validate URL against the pattern defined in the subclass
            const url = this.page.url();
            const isValidUrl = this.urlPattern.test(url);
            console.log('[YahooFinanceQuoteSubPageModel] URL validation:', { url, pattern: this.urlPattern.toString(), isValid: isValidUrl });
            return isValidUrl;
        } catch (error) {
            console.error('[YahooFinanceQuoteSubPageModel] Page validation failed:', error);
            throw new Error(`Failed to validate quote sub-page: ${error}`);
        }
    }

    public async openSummary(): Promise<YahooFinanceQuoteSummaryModel> {
        await this.goToSubPage('summary');
        return new YahooFinanceQuoteSummaryModel({ model: this });
    }

    public async openNews(): Promise<YahooFinanceQuoteNewsModel> {
        await this.goToSubPage('news');
        return new YahooFinanceQuoteNewsModel({ model: this });
    }

    public async openCharts(): Promise<YahooFinanceQuoteChartsModel> {
        await this.goToSubPage('chart');
        return new YahooFinanceQuoteChartsModel({ model: this });
    }

    public async openHistoricalData(): Promise<HistoricalDataModel> {
        await this.goToSubPage('history');
        return new HistoricalDataModel({ model: this });
    }

    private async goToSubPage(category: 'summary' | 'news' | 'chart' | 'history'): Promise<void> {
        console.log(`[YahooFinanceQuoteSubPageModel] Navigating to ${category} page...`);
        
        const currentUrl = this.page.url();
        // Remove trailing slash and any existing subpage paths
        const baseUrl = currentUrl.replace(/\/(news|chart|chart|history)\/?$/, '').replace(/\/$/, '');
        
        let targetUrl: string;
        if (category === 'summary') {
            targetUrl = baseUrl + '/';
        } else if (category === 'chart') {
            targetUrl = `${baseUrl}/chart`;
        } else {
            targetUrl = `${baseUrl}/${category}`;
        }
        
        console.log(`[YahooFinanceQuoteSubPageModel] Navigation details:`, { currentUrl, baseUrl, targetUrl, category });
        
        try {
            await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
            console.log(`[YahooFinanceQuoteSubPageModel] Successfully navigated to ${category} page`);
        } catch (error) {
            console.error(`[YahooFinanceQuoteSubPageModel] Navigation to ${category} failed:`, error);
            throw error;
        }
    }
}


import type { HistoricalData } from "../../types";

export class YahooFinanceQuoteSummaryModel extends YahooFinanceQuoteSubPageModel {
    protected override urlPattern = /^https:\/\/finance\.yahoo\.com\/quote\/\w+\/?$/;
}

export class YahooFinanceQuoteNewsModel extends YahooFinanceQuoteSubPageModel {
    protected override urlPattern = /^https:\/\/finance\.yahoo\.com\/quote\/\w+\/news\/?$/;
}

export class YahooFinanceQuoteChartsModel extends YahooFinanceQuoteSubPageModel {
    protected override urlPattern = /^https:\/\/finance\.yahoo\.com\/quote\/\w+\/chart\/?$/;
}

export class HistoricalDataModel extends YahooFinanceQuoteSubPageModel {
    protected override urlPattern = /^https:\/\/finance\.yahoo\.com\/quote\/\w+\/history\/?$/;

    public override async isInPage(): Promise<boolean> {
        const isValid = await super.isInPage();
        if (!isValid) {
            return false;
        }

        const hasHistoricalData = await this.page.$('table.table.yf-1jecxey');
        if (!hasHistoricalData) {
            return false;
        }

        return true;
    }

    public async configurePeriod(from: Date, to: Date): Promise<void> {
        console.log('[HistoricalDataModel] Configuring period:', { from: from.toISOString(), to: to.toISOString() });
        
        try {
            // Click the date range selector button
            console.log('[HistoricalDataModel] Clicking date range selector...');
            await this.page.click('button[data-ylk*="date-select"]');
            
            // Wait for the date picker section to appear
            console.log('[HistoricalDataModel] Waiting for date picker to appear...');
            await this.page.waitForSelector('section[slot="content"]', { visible: true, timeout: 10000 });
            console.log('[HistoricalDataModel] Date picker appeared');
            
            // Format dates to dd-MM-yyyy format for HTML date inputs
            const fromFormatted = this.formatDate(from);
            const toFormatted = this.formatDate(to);
            console.log('[HistoricalDataModel] Formatted dates:', { fromFormatted, toFormatted });
            
            // Clear and type in the start date
            console.log('[HistoricalDataModel] Setting start date...');
            await this.page.click('input[name="startDate"]', { clickCount: 3 });
            await this.page.type('input[name="startDate"]', fromFormatted);
            
            // Clear and type in the end date
            console.log('[HistoricalDataModel] Setting end date...');
            await this.page.click('input[name="endDate"]', { clickCount: 3 });
            await this.page.type('input[name="endDate"]', toFormatted);
            
            // Click the Done button and handle potential navigation
            console.log('[HistoricalDataModel] Looking for Done button...');
            await this.page.waitForSelector('button.primary-btn', { timeout: 10000 });
            console.log('[HistoricalDataModel] Done button found, clicking...');
            
            // Click the button and wait for either navigation or timeout
            const results = await Promise.allSettled([
                this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }),
                this.page.click('button.primary-btn')
            ]);
            
            console.log('[HistoricalDataModel] Navigation results:', results.map(r => r.status));
            
            // Wait a bit for any potential page updates
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('[HistoricalDataModel] Period configuration completed');
            
        } catch (error) {
            console.warn('[HistoricalDataModel] Date configuration failed:', error);
            // Continue execution even if date configuration fails
        }
    }

    public async configureFrequency(frequency: 'Daily' | 'Weekly' | 'Monthly'): Promise<void> {
        console.log('[HistoricalDataModel] Configuring frequency:', frequency);
        
        try {
            // Click the frequency selector button
            console.log('[HistoricalDataModel] Clicking frequency selector...');
            await this.page.waitForSelector('button[data-ylk*="interval-select"]');
            await this.page.click('button[data-ylk*="interval-select"]');
            
            // Wait for the dropdown to appear
            console.log('[HistoricalDataModel] Waiting for frequency dropdown...');
            await this.page.waitForSelector('div[role="listbox"]', { visible: true });
            console.log('[HistoricalDataModel] Frequency dropdown appeared');
            
            // Map frequency to data-value
            const frequencyMap = {
                'Daily': '1d',
                'Weekly': '1wk', 
                'Monthly': '1mo'
            };
            
            const dataValue = frequencyMap[frequency];
            console.log('[HistoricalDataModel] Frequency mapping:', { frequency, dataValue });

            if (!dataValue) {
                throw new Error(`Invalid frequency: ${frequency}`);
            }
            
            // Click the option with the corresponding data-value
            console.log('[HistoricalDataModel] Clicking frequency option:', dataValue);
            await this.page.click(`div[data-value="${dataValue}"]`);
            console.log('[HistoricalDataModel] Frequency configuration completed');
            
        } catch (error) {
            console.error('[HistoricalDataModel] Frequency configuration failed:', error);
            throw error;
        }
    }

    public async extractHistoricalData(): Promise<HistoricalData[]> {
        console.log('[HistoricalDataModel] Starting data extraction...');
        
        // Wait for the historical data table to load
        console.log('[HistoricalDataModel] Waiting for historical data table...');
        await this.page.waitForSelector('table.table.yf-1jecxey');
        console.log('[HistoricalDataModel] Historical data table found');
        
        // Extract data from table rows using element handles
        console.log('[HistoricalDataModel] Extracting data from table rows...');
        const rows = await this.page.$$('table.table.yf-1jecxey tbody tr');
        console.log(`[HistoricalDataModel] Found ${rows.length} table rows`);
        
        const historicalData: HistoricalData[] = [];
        
        for (const row of rows) {
            const cells = await row.$$('td');
            
            if (cells.length !== 7) {
                continue; // Skip rows that don't have 7 columns (like dividend rows)
            }
            
            try {
                // Extract text content from each cell
                const dateText = await cells[0]?.evaluate(el => el.textContent?.trim() || '') || '';
                const openText = await cells[1]?.evaluate(el => el.textContent?.trim() || '') || '';
                const highText = await cells[2]?.evaluate(el => el.textContent?.trim() || '') || '';
                const lowText = await cells[3]?.evaluate(el => el.textContent?.trim() || '') || '';
                const closeText = await cells[4]?.evaluate(el => el.textContent?.trim() || '') || '';
                const volumeText = await cells[6]?.evaluate(el => el.textContent?.trim() || '') || ''; // Skip Adj Close (index 5)
                
                // Parse date (format: "Sep 1, 2025" -> "2025-09-01")
                let formattedDate = '';
                if (dateText) {
                    const date = new Date(dateText);
                    formattedDate = date.toISOString().split('T')[0] || '';
                }
                
                // Helper function to parse numeric values (remove commas)
                const parseNumber = (text: string): number => {
                    if (!text) return 0;
                    return parseFloat(text.replace(/,/g, '')) || 0;
                };
                
                const dataPoint: HistoricalData = {
                    date: formattedDate,
                    open: parseNumber(openText),
                    high: parseNumber(highText),
                    low: parseNumber(lowText),
                    close: parseNumber(closeText),
                    volume: parseNumber(volumeText)
                };
                
                historicalData.push(dataPoint);
                
            } catch (error) {
                console.warn('[HistoricalDataModel] Error parsing row:', error);
                continue;
            }
        }
    
        console.log('[HistoricalDataModel] Extracted', historicalData.length, 'rows of historical data');
        return historicalData;
    }


    private formatDate(date: Date): string {
        const dayString = date.getDate().toString().padStart(2, '0');
        const monthString = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${dayString}-${monthString}-${date.getFullYear()}`;
    }
}