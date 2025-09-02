import { PageModel, type PageModelConstructorArguments } from "../models";
import { PrintableMixin, type Printable } from "../mixins";

/**
 * Example: Basic page model without print functionality
 */
class BasicPageModel extends PageModel {
    constructor(args: PageModelConstructorArguments = {}) {
        super(args);
    }

    async getTitle(): Promise<string> {
        return this.page.title();
    }
}

/**
 * Example: Custom page model for demonstration
 */
class CustomPageModel extends PageModel {
    constructor(args: PageModelConstructorArguments = {}) {
        super(args);
    }

    async getContent(): Promise<string> {
        return this.page.content();
    }
}

/**
 * Example: Creating a printable version using the decorator
 */
const PrintablePageModel = PrintableMixin(BasicPageModel);

/**
 * Example: Usage demonstrating type safety
 */
export async function main(): Promise<void> {
    try {
        // Example 1: Basic usage with mixin
        const basicModel = new (PrintableMixin(BasicPageModel))({});
        await basicModel.init();
        await basicModel.page.goto('https://example.com');
        await basicModel.validatePage();
        
        console.log('Generating PDF...');
        const pdfBuffer = await basicModel.printPage();
        console.log(`PDF generated: ${pdfBuffer.length} bytes`);
        
        // Example 2: Custom page model with mixin (sharing same page)
        const customModel = new (PrintableMixin(CustomPageModel))({ model: basicModel });
        await customModel.page.goto('https://httpbin.org/html');
        await customModel.validatePage();
        
        console.log('Generating custom PDF...');
        const customPdfBuffer = await customModel.printPage();
        console.log(`Custom PDF generated: ${customPdfBuffer.length} bytes`);
        
        // Clean up
        await basicModel.close();
        
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Example: Creating a specialized printable page model
 */
class ReportPageModel extends PageModel {
    constructor(args: PageModelConstructorArguments = {}) {
        super(args);
    }

    async generateReport(): Promise<string> {
        // Simulate report generation logic
        return "Report data generated";
    }
}

// Create printable version of ReportPageModel
const PrintableReportPageModel = PrintableMixin(ReportPageModel);

export async function demonstrateSpecializedPrintable() {
    const reportModel = new PrintableReportPageModel({});
    await reportModel.init();
    
    // Navigate to a page for demonstration
    await reportModel.page.goto('https://example.com');
    
    // Has both report functionality and print functionality
    const reportData = await reportModel.generateReport(); // ✅ Original functionality
    const pdfReport = await reportModel.printPage(); // ✅ Mixin functionality
    
    console.log('Report:', reportData);
    console.log('PDF report size:', pdfReport.length, 'bytes');
    
    await reportModel.close();
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
