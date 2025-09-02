import { Page } from "puppeteer";
import { PageModel, type PageModelConstructorArguments } from "../models";
import { PrintableMixin, type Printable } from "../mixins";

/**
 * Example: Basic page model without print functionality
 */
class BasicPageModel extends PageModel {
    constructor(args: PageModelConstructorArguments) {
        super(args);
    }

    async getTitle(): Promise<string> {
        return this.page.title();
    }
}

/**
 * Example: Creating a printable version using the decorator
 */
const PrintablePageModel = PrintableMixin(BasicPageModel);

/**
 * Example: Usage demonstrating type safety
 */
export async function demonstrateDecoratorUsage(page: Page) {
    // Basic model - no print functionality
    const basicModel = new BasicPageModel({ page });
    const title = await basicModel.getTitle();
    console.log('Page title:', title);
    
    // This would cause a TypeScript error:
    // basicModel.printPage(); // ❌ Property 'printPage' does not exist
    
    // Printable model - has both basic and print functionality
    const printableModel = new PrintablePageModel({ page });
    const printableTitle = await printableModel.getTitle(); // ✅ Basic functionality
    const pdfBuffer = await printableModel.printPage(); // ✅ Print functionality
    
    console.log('Printable page title:', printableTitle);
    console.log('PDF generated, size:', pdfBuffer.length, 'bytes');
    
    // Type safety: printableModel implements both PageModel and Printable
    const isPrintable: Printable = printableModel; // ✅ Type-safe assignment
    
    return { basicModel, printableModel, pdfBuffer };
}

/**
 * Example: Creating a specialized printable page model
 */
class ReportPageModel extends PageModel {
    constructor(args: PageModelConstructorArguments) {
        super(args);
    }

    async generateReport(): Promise<string> {
        // Simulate report generation logic
        return "Report data generated";
    }
}

// Create printable version of ReportPageModel
const PrintableReportPageModel = withPrintable(ReportPageModel);

export async function demonstrateSpecializedPrintable(page: Page) {
    const reportModel = new PrintableReportPageModel({ page });
    
    // Has both report functionality and print functionality
    const reportData = await reportModel.generateReport(); // ✅ Original functionality
    const pdfReport = await reportModel.printPage(); // ✅ Decorated functionality
    
    console.log('Report:', reportData);
    console.log('PDF report size:', pdfReport.length, 'bytes');
    
    return { reportData, pdfReport };
}

/**
 * Example: Function that accepts only printable page models
 */
export async function processPrintablePages(models: Printable[]) {
    const results = [];
    
    for (const model of models) {
        const pdf = await model.printPage(); // ✅ Type-safe - we know it has printPage
        results.push({
            size: pdf.length,
            timestamp: new Date().toISOString()
        });
    }
    
    return results;
}
