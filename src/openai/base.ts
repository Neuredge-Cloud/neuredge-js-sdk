import { BaseCapability } from '../capabilities/base';

export class OpenAICapability extends BaseCapability {
    protected get basePath(): string {
        return '/v1';
    }
}
