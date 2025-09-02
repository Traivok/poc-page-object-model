/**
 * Yahoo Finance Historical Data Scraper Example
 * @description Demonstrates the Page Object Model pattern for RPA automation
 * @author RPA Team
 */

import puppeteer from 'puppeteer';
import { YahooFinanceHomeModel } from '../pages/home.model';
import { HistoricalDataModel, YahooFinanceQuoteSummaryModel } from '../pages/quotes/subpage.model';
import { DEFAULT_BROWSER_CONFIG } from '../config/browser.config';

/**
 * Main execution function for Yahoo Finance data scraping
 * @description Orchestrates the complete flow from navigation to data extraction
 * @throws {Error} When browser launch fails or page navigation errors occur
 */
async function main(): Promise<void> {
    try {
        // Initialize home model with new pattern
        const homeModel = new YahooFinanceHomeModel({});
        await homeModel.init();
        
        // Navigate to Yahoo Finance home page
        await homeModel.page.goto('https://finance.yahoo.com/', { 
            waitUntil: 'domcontentloaded',
            timeout: 60000 
        });
        await homeModel.validatePage();

        // Search for AAPL stock
        await homeModel.goToQuote('AAPL');
        
        // Create quote summary model sharing the same page
        const quoteSummaryModel = new YahooFinanceQuoteSummaryModel({ model: homeModel });
        await quoteSummaryModel.validatePage();
        
        // Navigate to historical data page using page model method
        const historicalDataModel = await quoteSummaryModel.openHistoricalData();
        await historicalDataModel.validatePage();
        
        // Configure date range and frequency
        await historicalDataModel.configurePeriod(new Date('2025-01-01'), new Date('2025-12-31'));
        await historicalDataModel.configureFrequency('Daily');
        
        // Extract and display historical data
        const historicalData = await historicalDataModel.extractHistoricalData();
        console.log(historicalData);
        
        // Clean up
        await homeModel.close();
        
    } catch (error) {
        console.error('Scraping failed:', error);
        throw error;
    }
}

// Execute main function with error handling
main().catch(console.error);
