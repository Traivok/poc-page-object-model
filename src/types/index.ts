// Re-export from organized modules
export { PageModel, type PageModelConstructorArguments } from '../models';
export { PrintableMixin, type Printable, type Constructor } from '../mixins';

// Domain-specific types
export interface HistoricalData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}