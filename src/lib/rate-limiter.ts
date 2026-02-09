import redis from './redis'

/**
 * Redis-backed sliding window rate limiter using INCR + EXPIRE.
 *
 * Algorithm (fixed window with per-second granularity):
 *   - Key = "rl:<identifier>:<window_epoch>"
 *   - INCR the key on each request
 *   - If the key is new (count === 1), set EXPIRE to windowSeconds
 *   - If count > limit, reject
 *
 * Fail-open: if Redis is unreachable the request is ALLOWED so real
 * users are never blocked by infrastructure issues.
 */
export interface RateLimitResult {
    /** Whether this request is allowed */
    allowed: boolean
    /** How many requests remain in the current window */
    remaining: number
    /** Unix epoch (seconds) when the current window resets */
    reset: number
}

export async function rateLimit(
    identifier: string,
    limit: number,
    windowSeconds: number,
): Promise<RateLimitResult> {
    try {
        const now = Math.floor(Date.now() / 1000)
        const windowStart = Math.floor(now / windowSeconds) * windowSeconds
        const reset = windowStart + windowSeconds
        const key = `rl:${identifier}:${windowStart}`

        const count = await redis.incr(key)

        // First request in this window — set the TTL so the key self-cleans
        if (count === 1) {
            await redis.expire(key, windowSeconds)
        }

        const allowed = count <= limit
        const remaining = Math.max(0, limit - count)

        return { allowed, remaining, reset }
    } catch (err) {
        // Fail open: if Redis is down, allow the request
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[RateLimit] Redis unavailable, failing open:', (err as Error).message)
        }
        return {
            allowed: true,
            remaining: limit,
            reset: Math.floor(Date.now() / 1000) + windowSeconds,
        }
    }
}
