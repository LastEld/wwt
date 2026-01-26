export class IntegrationError extends Error {
    constructor(public provider: string, message: string) {
        super(`[${provider}] ${message}`);
        this.name = 'IntegrationError';
    }
}

export class ProviderTimeoutError extends IntegrationError {
    constructor(provider: string) {
        super(provider, 'Request timed out');
        this.name = 'ProviderTimeoutError';
    }
}

export class ProviderRateLimitError extends IntegrationError {
    constructor(provider: string) {
        super(provider, 'Rate limit exceeded');
        this.name = 'ProviderRateLimitError';
    }
}

export class ProviderValidationError extends IntegrationError {
    constructor(provider: string, details: string) {
        super(provider, `Validation failed: ${details}`);
        this.name = 'ProviderValidationError';
    }
}
