import { PageModel } from '../models';

// Printable interface for pages that support PDF generation
export interface Printable {
    printPage(): Promise<Uint8Array>;
}

// Type for constructors that can be mixed in
export type Constructor<T = {}> = new (...args: any[]) => T;

// Class mixin that adds printable functionality
export function PrintableMixin<TBase extends Constructor<PageModel>>(Base: TBase) {
    return class PrintablePageModel extends Base implements Printable {
        async printPage(): Promise<Uint8Array> {
            return this._page.pdf();
        }
    };
}
