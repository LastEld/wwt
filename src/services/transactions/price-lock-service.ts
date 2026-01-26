import prisma from "../../lib/prisma";
import redis from "../../lib/redis";
import crypto from "crypto";
import { logger } from "../../lib/logger";

export interface PriceLockData {
    hotelId: string;
    hotelName: string;
    roomId: string;
    roomType: string;
    integration: string;
    pricePerNight: number;
    totalPrice: number;
    currency: string;
    sessionId: string;
    userId?: string;
}

export class PriceLockService {
    private static REDIS_PREFIX = "lock:price:";
    private static LOCK_TTL = 300; // 5 minutes in seconds
    private static SIGNING_SECRET = process.env.NEXTAUTH_SECRET || "default-secret-winwin";

    /**
     * Acquires a price lock and returns a signed token.
     */
    static async acquireLock(data: PriceLockData): Promise<{ token: string; expiresAt: Date }> {
        const lockId = crypto.randomUUID();
        const key = `${this.REDIS_PREFIX}${lockId}`;
        const expiresAt = new Date(Date.now() + this.LOCK_TTL * 1000);

        const lockPayload = {
            ...data,
            id: lockId,
            expiresAt: expiresAt.toISOString()
        };

        // 1. Store in Redis for fast validation
        if (!redis) throw new Error("Redis connection unavailable for price lock");
        await redis.setex(key, this.LOCK_TTL, JSON.stringify(lockPayload));

        // 2. Backup in Prisma for audit/long-term tracking
        await prisma.priceLock.create({
            data: {
                id: lockId,
                hotelId: data.hotelId,
                roomId: data.roomId,
                integration: data.integration,
                pricePerNight: data.pricePerNight,
                totalPrice: data.totalPrice,
                currency: data.currency,
                sessionId: data.sessionId,
                userId: data.userId,
                expiresAt: expiresAt
            }
        });

        // 3. Create a signed token (hmac includes IDs for high integrity)
        const tokenSource = `${lockId}:${data.totalPrice}:${data.currency}:${data.sessionId}`;
        const signature = crypto
            .createHmac("sha256", this.SIGNING_SECRET)
            .update(tokenSource)
            .digest("hex");

        return {
            token: `${lockId}.${signature}`,
            expiresAt
        };
    }

    /**
     * Validates a lock token and returns the locked data.
     */
    static async validateLock(token: string): Promise<PriceLockData | null> {
        const [lockId, signature] = token.split(".");
        if (!lockId || !signature) return null;

        const key = `${this.REDIS_PREFIX}${lockId}`;
        if (!redis) throw new Error("Redis connection unavailable for lock validation");
        const cached = await redis.get(key);
        if (!cached) return null;

        const data = JSON.parse(cached);

        // Verify signature (Cross-check with stored session info)
        const tokenSource = `${lockId}:${data.totalPrice}:${data.currency}:${data.sessionId}`;
        const expectedSignature = crypto
            .createHmac("sha256", this.SIGNING_SECRET)
            .update(tokenSource)
            .digest("hex");

        if (signature !== expectedSignature) {
            logger.error({ lockId, sessionId: data.sessionId }, "PriceLock Security violation: Signature or session mismatch");
            return null;
        }

        return data;
    }

    /**
     * Releases a lock early (e.g., after booking success).
     */
    static async releaseLock(token: string): Promise<void> {
        const [lockId] = token.split(".");
        if (lockId && redis) {
            await redis.del(`${this.REDIS_PREFIX}${lockId}`);
        }
    }
}
