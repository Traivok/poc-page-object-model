import { closeBrowser, launchPage } from "./utils";
import { YahooFinanceHomeModel } from "./pom/home.model";
import { HistoricalDataModel, YahooFinanceQuoteSubPageModel, YahooFinanceQuoteSummaryModel } from "./pom/quotes/subpage.model";

async function main() {
    const homeModel = new YahooFinanceHomeModel({ page: await launchPage('https://finance.yahoo.com/') });
    await homeModel.validatePage();

    await homeModel.goToQuote('AAPL');
    const quoteModel = new YahooFinanceQuoteSummaryModel({ model: homeModel });
    await quoteModel.validatePage();

    const newsModel = await quoteModel.openNews();
    await newsModel.validatePage();
    const pdfBuffer = await newsModel.printPage();
    
    const historicalDataModel = await quoteModel.openHistoricalData();
    await historicalDataModel.validatePage();
    await historicalDataModel.configurePeriod(new Date('2025-01-01'), new Date('2025-12-31'));
    await historicalDataModel.configureFrequency('Daily');
    const historicalData = await historicalDataModel.extractHistoricalData();
    console.log(historicalData);

    await closeBrowser(historicalDataModel.page);
}

main().catch(console.error);
