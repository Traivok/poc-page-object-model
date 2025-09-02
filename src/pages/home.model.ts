import { Page } from "puppeteer";
import { PageModel, type PageModelConstructorArguments } from "../models";
import { YAHOO_FINANCE_SELECTORS } from "../config/selectors.config";

/**
 * Yahoo Finance Home Page Model
 * @description Handles interactions with the Yahoo Finance home page including navigation and stock symbol searches
 */
export class YahooFinanceHomeModel extends PageModel {
    /**
     * Creates an instance of YahooFinanceHomeModel
     * @param {PageModelConstructorArguments} args - Constructor arguments containing page instance
     */
    constructor(args: PageModelConstructorArguments = {}) {
        super(args);
    }

    /**
     * Validates if the current page is the Yahoo Finance home page
     * @description Checks page title and presence of quote lookup input to confirm home page
     * @returns {Promise<boolean>} True if on Yahoo Finance home page, false otherwise
     * @throws {Error} When page validation fails due to network or DOM issues
     */
    public override async isInPage(): Promise<boolean> {
        console.log('[YahooFinanceHomeModel] Checking if in home page...');
        
        try {
            const title = await this.page.title();
            console.log('[YahooFinanceHomeModel] Page title:', title);
            
            const hasQuoteLookup = await this.page.$(YAHOO_FINANCE_SELECTORS.HOME.QUOTE_LOOKUP_INPUT);
            console.log('[YahooFinanceHomeModel] Quote lookup element found:', !!hasQuoteLookup);
            
            const isHomePage = title.includes('Yahoo Finance') && !!hasQuoteLookup;
            console.log('[YahooFinanceHomeModel] Home page validation successful');
            
            return isHomePage;
        } catch (error) {
            console.error('[YahooFinanceHomeModel] Page validation failed:', error);
            throw new Error(`Failed to validate Yahoo Finance home page: ${error}`);
        }
    }

    /**
     * Navigates to a specific stock quote page
     * @description Searches for a stock symbol and navigates to its quote page
     * @param {string} symbol - Stock symbol to search for (e.g., 'AAPL', 'GOOGL')
     * @returns {Promise<void>}
     * @throws {Error} When navigation fails or stock symbol is not found
     * @example
     * ```typescript
     * const homeModel = new YahooFinanceHomeModel({ page });
     * await homeModel.goToQuote('AAPL');
     * ```
     */
    public async goToQuote(symbol: string): Promise<void> {
        if (!symbol || typeof symbol !== 'string') {
            throw new Error('Stock symbol must be a non-empty string');
        }

        console.log('[YahooFinanceHomeModel] Navigating to quote for symbol:', symbol);
        
        try {
            // Look for the quote lookup input
            console.log('[YahooFinanceHomeModel] Looking for quote lookup input...');
            const quoteInput = await this.page.waitForSelector(YAHOO_FINANCE_SELECTORS.HOME.QUOTE_LOOKUP_INPUT);
            
            if (!quoteInput) {
                throw new Error('Quote lookup input not found');
            }
            
            // Clear existing content and type the symbol
            console.log('[YahooFinanceHomeModel] Typing symbol into input...');
            await quoteInput.click({ clickCount: 3 }); // Select all existing text
            await quoteInput.type(symbol);
            
            // Press Enter to search
            console.log('[YahooFinanceHomeModel] Pressing Enter to search...');
            await Promise.all([
                this.page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {
                    // Navigation might not trigger a full page reload, that's okay
                    console.log('[YahooFinanceHomeModel] No full navigation detected, checking URL change...');
                }),
                this.page.keyboard.press('Enter')
            ]);
            
            // Wait for URL to change to quote page
            console.log('[YahooFinanceHomeModel] Waiting for URL to change...');
            await this.page.waitForFunction(
                (expectedSymbol) => window.location.href.includes(`/quote/${expectedSymbol}`),
                { timeout: 15000 },
                symbol
            );
            
            const finalUrl = this.page.url();
            console.log('[YahooFinanceHomeModel] Navigation completed. Final URL:', finalUrl);
            
            // Validate that we reached the quote page
            if (!finalUrl.includes(`/quote/${symbol}`)) {
                throw new Error(`Failed to navigate to quote page for symbol: ${symbol}`);
            }
        } catch (error) {
            console.error('[YahooFinanceHomeModel] Navigation failed:', error);
            throw new Error(`Failed to navigate to quote for symbol ${symbol}: ${error}`);
        }
    }
}

export default YahooFinanceHomeModel;
