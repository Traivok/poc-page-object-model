import type { Page } from "puppeteer";

export type PageModelConstructorArguments = {
    page: Page;
    timeout?: number;
} | {
    model: PageModel;
    timeout?: number;
}

export abstract class PageModel {
    _page: Page;

    constructor(args: PageModelConstructorArguments) {
        if ('page' in args) {
            this._page = args.page;
        } else if ('model' in args) {
            this._page = args.model.page;
        } else {
            throw new Error("PageModel constructor arguments are not valid");
        }

        if (args.timeout) {
            this._page.setDefaultTimeout(args.timeout);
        }
    }

    get page(): Page {
        return this._page;
    }

    public async isInPage(): Promise<boolean> {
        return true;
    }

    public async validatePage(): Promise<void> {
        const isValid = await this.isInPage();
        if (!isValid) {
            throw new Error("Page is not valid");
        }
    }

    public async printPage(): Promise<Uint8Array> {
        return this.page.pdf();
    }
}

export interface HistoricalData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}