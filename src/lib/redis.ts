import Redis from 'ioredis'

const redisClientSingleton = () => {
    const url = process.env.REDIS_URL || 'redis://localhost:6379'
    const client = new Redis(url, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            if (times > 3) return null; // stop retrying
            return Math.min(times * 200, 2000);
        },
        lazyConnect: true,
    })

    client.on('error', (err) => {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[Redis] Connection error (non-fatal):', err.message)
        }
    })

    client.connect().catch(() => {
        console.warn('[Redis] Initial connection failed - operating in degraded mode')
    })

    return client
}

declare global {
    var redis: undefined | ReturnType<typeof redisClientSingleton>
}

const redis = globalThis.redis ?? redisClientSingleton()

export default redis

if (process.env.NODE_ENV !== 'production') globalThis.redis = redis
