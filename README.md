# Page Object Model POC for RPA Standards

This project demonstrates a standardized approach to implementing the Page Object Model (POM) pattern for Robotic Process Automation (RPA) using TypeScript and Puppeteer.

## 🎯 Purpose

This POC establishes coding standards and architectural patterns for RPA projects, focusing on:

- **Maintainable Code**: Clear separation of concerns using Page Object Model
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Error Handling**: Robust error handling with detailed logging and meaningful error messages
- **Configuration Management**: Centralized configuration for selectors and browser settings
- **Documentation**: Comprehensive JSDoc documentation for all public APIs

## 📁 Project Structure

```
src/
├── config/                 # Configuration files
│   ├── browser.config.ts   # Puppeteer browser configurations
│   └── selectors.config.ts # Centralized CSS selectors
├── models/                 # Base model classes
│   ├── base.model.ts       # Abstract PageModel base class
│   └── index.ts           # Model exports
├── mixins/                 # Reusable functionality mixins
│   ├── printable.mixin.ts  # PDF generation capabilities
│   └── index.ts           # Mixin exports
├── pages/                  # Page Object Models
│   ├── home.model.ts       # Yahoo Finance home page
│   └── quotes/             # Quote-related pages
│       └── subpage.model.ts # Quote sub-pages (news, history, etc.)
├── types/                  # TypeScript type definitions
│   └── index.ts           # Domain-specific types and re-exports
├── utils/                  # Utility functions
│   └── index.ts           # Common utilities
└── examples/              # Usage examples
    ├── yahoo-finance-scraper.ts # Complete scraping example
    └── printable-example.ts     # Mixin usage examples
```

## 🏗️ Architecture Patterns

### Page Object Model (POM)

Each page is represented by a class that encapsulates:
- **Page validation** (`isInPage()` method)
- **User interactions** (clicks, form fills, navigation)
- **Data extraction** (scraping structured data)
- **Error handling** with meaningful exceptions

```typescript
import { PageModel, type PageModelConstructorArguments } from "../models";

/**
 * Example Page Object Model implementation
 */
export class YahooFinanceHomeModel extends PageModel {
    constructor(args: PageModelConstructorArguments) {
        super(args);
    }

    /**
     * Validates if current page is the home page
     * @throws {Error} When page validation fails
     */
    public async isInPage(): Promise<boolean> {
        // Implementation with error handling
    }

    /**
     * Navigates to stock quote page
     * @param {string} symbol - Stock symbol (e.g., 'AAPL')
     * @throws {Error} When navigation fails
     */
    public async goToQuote(symbol: string): Promise<void> {
        // Implementation with validation
    }
}
```

### Mixin Pattern for Optional Functionality

The project uses mixins to add optional capabilities without violating SOLID principles:

```typescript
import { PageModel, type PageModelConstructorArguments } from "../models";
import { PrintableMixin, type Printable } from "../mixins";

// Basic page model
class ReportPageModel extends PageModel {
    constructor(args: PageModelConstructorArguments) {
        super(args);
    }

    async generateReport(): Promise<string> {
        return "Report data";
    }
}

// Add printable functionality using mixin
const PrintableReportModel = PrintableMixin(ReportPageModel);

// Usage
const reportModel = new PrintableReportModel({ page });
await reportModel.generateReport(); // Original functionality
const pdf = await reportModel.printPage(); // Mixin functionality
```

### Configuration Management

Centralized configuration prevents selector duplication and makes maintenance easier:

```typescript
// selectors.config.ts
export const YAHOO_FINANCE_SELECTORS = {
    HOME: {
        QUOTE_LOOKUP_INPUT: 'input[data-module="SearchForm"]'
    },
    HISTORICAL: {
        DATA_TABLE: 'table.table.yf-1jecxey'
    }
} as const;
```

### Error Handling Standards

All public methods include:
- **Input validation** with meaningful error messages
- **Try-catch blocks** around DOM operations
- **Detailed logging** for debugging
- **Typed exceptions** with context information

```typescript
public async goToQuote(symbol: string): Promise<void> {
    if (!symbol || typeof symbol !== 'string') {
        throw new Error('Stock symbol must be a non-empty string');
    }

    try {
        // Implementation
    } catch (error) {
        console.error('[YahooFinanceHomeModel] Navigation failed:', error);
        throw new Error(`Failed to navigate to quote for symbol ${symbol}: ${error}`);
    }
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- TypeScript 4.5+
- Puppeteer

### Installation

```bash
npm install
```

### Running the Example

```bash
# Run the Yahoo Finance scraper example
npx tsx src/examples/yahoo-finance-scraper.ts
```

## 📖 Usage Examples

### Basic Page Navigation

```typescript
import puppeteer from 'puppeteer';
import { YahooFinanceHomeModel } from './pages/home.model';
import { YahooFinanceQuoteSummaryModel } from './pages/quotes/subpage.model';
import { DEFAULT_BROWSER_CONFIG } from './config/browser.config';

const browser = await puppeteer.launch(DEFAULT_BROWSER_CONFIG);
const page = await browser.newPage();

await page.goto('https://finance.yahoo.com/');
const homeModel = new YahooFinanceHomeModel({ page });

// Validate we're on the correct page
await homeModel.validatePage();

// Navigate to a stock quote
await homeModel.goToQuote('AAPL');

// Create quote summary model and navigate to sub-pages
const quoteSummaryModel = new YahooFinanceQuoteSummaryModel({ page });
await quoteSummaryModel.validatePage();

// Navigate to historical data using page model method
const historicalDataModel = await quoteSummaryModel.openHistoricalData();
```

### Data Extraction

```typescript
import { HistoricalDataModel } from './pages/quotes/subpage.model';

const historicalModel = new HistoricalDataModel({ page });
await historicalModel.validatePage();

// Configure date range and frequency
await historicalModel.configurePeriod(
    new Date('2025-01-01'), 
    new Date('2025-12-31')
);
await historicalModel.configureFrequency('Daily');

// Extract structured data
const data = await historicalModel.extractHistoricalData();
console.log(data); // Array of HistoricalData objects
```

### Using Mixins for Optional Functionality

```typescript
import { PageModel, type PageModelConstructorArguments } from "../models";
import { PrintableMixin, type Printable } from "../mixins";

// Create a printable page model
class BasicPageModel extends PageModel {
    constructor(args: PageModelConstructorArguments) {
        super(args);
    }
    
    async getTitle(): Promise<string> {
        return this.page.title();
    }
}

// Apply mixin to add print functionality
const PrintablePageModel = PrintableMixin(BasicPageModel);

// Usage with type safety
const printableModel = new PrintablePageModel({ page });
await printableModel.getTitle(); // Original functionality
const pdf = await printableModel.printPage(); // Mixin functionality

// Function that only accepts printable models
function processPrintablePages(models: Printable[]) {
    // Type-safe usage of printPage method
}
```

## 🛠️ Development Standards

### Code Organization

- **`/src/models/`**: Base classes and abstract models
- **`/src/mixins/`**: Reusable functionality that can be composed
- **`/src/pages/`**: Concrete page object implementations
- **`/src/types/`**: Type definitions and interfaces
- **`/src/config/`**: Configuration files and constants

### JSDoc Documentation

All public methods must include:
- **Description** of functionality
- **Parameter documentation** with types and examples
- **Return type** documentation
- **@throws** tags for all possible exceptions
- **@example** blocks for complex methods

### TypeScript Standards

- **Strict mode** enabled in `tsconfig.json`
- **Explicit return types** for all public methods
- **Input validation** for all parameters
- **Null safety** with proper type guards
- **Modular imports** from organized folders

### Error Handling

- **Never fail silently** - always throw meaningful errors
- **Log context** before throwing exceptions
- **Validate inputs** at method entry points
- **Use typed exceptions** with descriptive messages

### Logging Standards

- **Consistent prefixes** using class names in brackets
- **Log all major operations** (navigation, validation, data extraction)
- **Include relevant context** in log messages
- **Use appropriate log levels** (info, warn, error)

## 🔧 Configuration

### Browser Settings

Three pre-configured browser setups:

- **`DEFAULT_BROWSER_CONFIG`**: Standard development setup
- **`HEADLESS_BROWSER_CONFIG`**: Production/CI environment
- **`DEBUG_BROWSER_CONFIG`**: Development with DevTools and slow motion

### Selector Management

All CSS selectors are centralized in `src/config/selectors.config.ts`:

- **Organized by page/feature**
- **Typed as const** for IntelliSense support
- **Descriptive naming** following BEM-like conventions
- **Easy to update** when UI changes

## 🧪 Testing Strategy

While this POC doesn't include tests, the architecture supports:

- **Unit testing** of individual page methods
- **Integration testing** of complete user flows
- **Mock-friendly design** with dependency injection
- **Deterministic behavior** through proper error handling

## 📋 Best Practices

### Page Object Design

1. **Single Responsibility**: Each page object handles one page/component
2. **Encapsulation**: Hide implementation details, expose clean APIs
3. **Validation**: Always validate page state before operations
4. **Immutability**: Don't modify page objects after creation

### Selector Strategy

1. **Prefer data attributes** over CSS classes for stability
2. **Use semantic selectors** that reflect business meaning
3. **Centralize selectors** to avoid duplication
4. **Document selector purposes** in configuration files

### Error Management

1. **Fail fast** with clear error messages
2. **Provide context** in all error messages
3. **Log before throwing** for debugging support
4. **Use specific error types** for different failure modes

## 🔄 Maintenance

### Updating Selectors

When Yahoo Finance updates their UI:

1. Update selectors in `src/config/selectors.config.ts`
2. Test with the example scraper
3. Update documentation if behavior changes

### Adding New Pages

1. Create new page object extending `PageModel`
2. Implement required abstract methods
3. Add selectors to configuration
4. Include comprehensive JSDoc documentation
5. Add usage example

## 📝 License

This is a proof of concept for internal RPA standards. Adapt as needed for your organization's requirements.

---

**Note**: This POC uses Yahoo Finance as an example target. Always respect robots.txt and terms of service when scraping websites in production.
