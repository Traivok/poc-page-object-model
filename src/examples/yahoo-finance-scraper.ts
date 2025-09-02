/**
 * Yahoo Finance Historical Data Scraper Example
 * @description Demonstrates the Page Object Model pattern for RPA automation
 * @author RPA Team
 */

import puppeteer from 'puppeteer';
import { YahooFinanceHomeModel } from '../pages/home.model';
import { HistoricalDataModel } from '../pages/quotes/subpage.model';
import { DEFAULT_BROWSER_CONFIG } from '../config/browser.config';

/**
 * Main execution function for Yahoo Finance data scraping
 * @description Orchestrates the complete flow from navigation to data extraction
 * @throws {Error} When browser launch fails or page navigation errors occur
 */
async function main(): Promise<void> {
    const browser = await puppeteer.launch(DEFAULT_BROWSER_CONFIG);
    const page = await browser.newPage();
    
    try {
        // Navigate to Yahoo Finance home page
        await page.goto('https://finance.yahoo.com/', { 
            waitUntil: 'domcontentloaded',
            timeout: 60000 
        });
        const homeModel = new YahooFinanceHomeModel({ page });
        await homeModel.validatePage();

        // Search for AAPL stock
        await homeModel.goToQuote('AAPL');
        
        // Navigate to historical data page
        await page.goto(`https://finance.yahoo.com/quote/AAPL/history`, { 
            waitUntil: 'domcontentloaded',
            timeout: 30000 
        });
        
        // Create historical data model and validate
        const historicalDataModel = new HistoricalDataModel({ page });
        await historicalDataModel.validatePage();
        
        // Configure date range and frequency
        await historicalDataModel.configurePeriod(new Date('2025-01-01'), new Date('2025-12-31'));
        await historicalDataModel.configureFrequency('Daily');
        
        // Extract and display historical data
        const historicalData = await historicalDataModel.extractHistoricalData();
        console.log(historicalData);
        
    } catch (error) {
        console.error('Scraping failed:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Execute main function with error handling
main().catch(console.error);
