import { Page } from "puppeteer";
import { PageModel, type PageModelConstructorArguments } from "../types";

export class YahooFinanceHomeModel extends PageModel {
    constructor(args: PageModelConstructorArguments) {
        super(args);
    }

    public override async isInPage(): Promise<boolean> {
        console.log('[YahooFinanceHomeModel] Checking if in home page...');
        
        const title = await this.page.title();
        console.log('[YahooFinanceHomeModel] Page title:', title);

        if (!title.includes("Yahoo Finance")) {
            console.log('[YahooFinanceHomeModel] Title validation failed');
            return false;
        }

        const hasQuoteLookup = await this.page.$('input[aria-label="Quote Lookup"]');
        console.log('[YahooFinanceHomeModel] Quote lookup element found:', !!hasQuoteLookup);
        if (!hasQuoteLookup) {
            return false;
        }

        console.log('[YahooFinanceHomeModel] Home page validation successful');
        return true;
    }

    public async goToQuote(symbol: string): Promise<void> {
        console.log('[YahooFinanceHomeModel] Navigating to quote for symbol:', symbol);
        
        try {
            console.log('[YahooFinanceHomeModel] Looking for quote lookup input...');
            const inputEl = await this.page.waitForSelector('input[aria-label="Quote Lookup"]');
            if (!inputEl) {
                throw new Error("Input element not found");
            }
            
            console.log('[YahooFinanceHomeModel] Typing symbol into input...');
            await inputEl.type(symbol);
            
            console.log('[YahooFinanceHomeModel] Pressing Enter to search...');
            await this.page.keyboard.press('Enter');
            
            console.log('[YahooFinanceHomeModel] Waiting for navigation to complete...');
            await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
            
            const finalUrl = this.page.url();
            console.log('[YahooFinanceHomeModel] Navigation completed. Final URL:', finalUrl);
            
        } catch (error) {
            console.error('[YahooFinanceHomeModel] Quote navigation failed:', error);
            throw error;
        }
    }
}

export default YahooFinanceHomeModel;
