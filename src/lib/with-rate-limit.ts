import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from './rate-limiter'

/**
 * Higher-order function that wraps a Next.js App Router handler with
 * Redis-backed rate limiting.
 *
 * Usage:
 *   export const POST = withRateLimit(handler, { limit: 30, windowSeconds: 60, prefix: 'search' })
 */

export interface RateLimitOptions {
    /** Max requests allowed in the window */
    limit: number
    /** Window size in seconds */
    windowSeconds: number
    /** Key prefix to namespace different routes (e.g. "search", "bookings") */
    prefix: string
}

type RouteHandler = (req: NextRequest, context?: any) => Promise<NextResponse | Response>

function getClientIp(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for')
    if (forwarded) {
        // x-forwarded-for can be a comma-separated list; take the first (original client)
        return forwarded.split(',')[0].trim()
    }
    const realIp = req.headers.get('x-real-ip')
    if (realIp) {
        return realIp.trim()
    }
    // Fallback — should rarely happen behind a reverse proxy
    return '127.0.0.1'
}

export function withRateLimit(
    handler: RouteHandler,
    options: RateLimitOptions,
): RouteHandler {
    return async (req: NextRequest, context?: any) => {
        const ip = getClientIp(req)
        const identifier = `${options.prefix}:${ip}`

        const { allowed, remaining, reset } = await rateLimit(
            identifier,
            options.limit,
            options.windowSeconds,
        )

        if (!allowed) {
            const retryAfter = Math.max(1, reset - Math.floor(Date.now() / 1000))
            return NextResponse.json(
                {
                    error: 'Too Many Requests',
                    message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(retryAfter),
                        'X-RateLimit-Limit': String(options.limit),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': String(reset),
                    },
                },
            )
        }

        // Call the original handler
        const response = await handler(req, context)

        // Attach rate-limit headers to successful responses.
        // NextResponse lets us clone and add headers; plain Response does not,
        // so we only add headers when we can.
        if (response instanceof NextResponse) {
            response.headers.set('X-RateLimit-Limit', String(options.limit))
            response.headers.set('X-RateLimit-Remaining', String(remaining))
            response.headers.set('X-RateLimit-Reset', String(reset))
        }

        return response
    }
}
