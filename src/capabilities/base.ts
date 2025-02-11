import type { BaseClient } from '../types';

export abstract class BaseCapability {
    constructor(protected readonly client: BaseClient) {}

    protected get basePath(): string {
        return '';
    }

    protected endpoint(path: string): string {
        return `${this.basePath}${path}`;
    }
}
