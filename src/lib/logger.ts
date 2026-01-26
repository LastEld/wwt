import pino from 'pino';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    // Avoid pino-pretty worker thread issues on Windows during hot-reloads
    transport: (process.env.NODE_ENV !== 'production' && process.env.OS !== 'Windows_NT')
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined
});
