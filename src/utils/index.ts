import puppeteer, { Page } from "puppeteer";

export async function launchPage(url: string): Promise<Page> {
    const browser = await puppeteer.launch({ headless: false });
    const pages = await browser.pages();
    const page = pages[0] || (await browser.newPage());
    await page.goto(url, { waitUntil: 'networkidle2' });
    return page;
}

export async function closeBrowser(page: Page): Promise<void> {
    await page.browser().close();
}