import type { Page, Browser } from "puppeteer";
import puppeteer from "puppeteer";

export type PageModelConstructorArguments = {
    timeout?: number;
} | {
    model: PageModel;
    timeout?: number;
}

export abstract class PageModel {
    protected _page: Page | null = null;
    protected _timeout?: number;

    constructor(args: PageModelConstructorArguments = {}) {
        if ('timeout' in args) {
            this._timeout = args.timeout;
        }

        if ('model' in args) {
            this._page = args.model.page;
        }
    }

    get page(): Page {
        if (!this._page) {
            throw new Error("Page not initialized. Call init() first.");
        }
        return this._page;
    }

    public async init(): Promise<void> {
        if (this._page) {
            throw new Error("Page already initialized");
        }

        const newBrowser = await puppeteer.launch({ headless: false });
        const pages = await newBrowser.pages();
        const newPage = pages[0] || (await newBrowser.newPage());
        this._page = newPage;
        
        if (this._timeout) {
            this._page.setDefaultTimeout(this._timeout);
        }
    }

    public async isInPage(): Promise<boolean> {
        if (!this._page) {
            throw new Error("Page not initialized. Call init() first.");
        }
        return true;
    }

    public async validatePage(): Promise<void> {
        const isValid = await this.isInPage();
        if (!isValid) {
            throw new Error("Page is not valid");
        }
    }

    public async close(): Promise<void> {
        if (this._page) {
            await this._page.close();
            this._page = null;
        }
    }
}
