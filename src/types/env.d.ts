/**
 * Environment Variables Type Declaration
 * 
 * Provides type safety for process.env.
 */

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // App
            NODE_ENV: 'development' | 'production' | 'test';
            NEXT_PUBLIC_APP_URL: string;

            // Database
            DATABASE_URL: string;

            // Cache
            REDIS_URL: string;

            // Auth
            NEXTAUTH_SECRET: string;
            NEXTAUTH_URL: string;
            GOOGLE_CLIENT_ID: string;
            GOOGLE_CLIENT_SECRET: string;
            FACEBOOK_CLIENT_ID?: string;
            FACEBOOK_CLIENT_SECRET?: string;

            // AI
            OPENAI_API_KEY: string;
            AI_MODEL_NAME?: string;

            // Integrations
            HOTELBEDS_API_KEY: string;
            HOTELBEDS_SECRET: string;

            // Monitoring
            LOG_LEVEL?: string;
            SENTRY_DSN?: string;
        }
    }
}

export { };
