import Redis from 'ioredis'

const redisClientSingleton = () => {
    const url = process.env.REDIS_URL || 'redis://localhost:6379'
    return new Redis(url)
}

declare global {
    var redis: undefined | ReturnType<typeof redisClientSingleton>
}

const redis = globalThis.redis ?? redisClientSingleton()

export default redis

if (process.env.NODE_ENV !== 'production') globalThis.redis = redis
