import redis from "../../lib/redis";
import { HotelOffer } from "../../integrations/integration-adapter.interface";
import { RealtimeGateway } from "../realtime/realtime-gateway";
import { logger } from "../../lib/logger";

interface CachedPrice {
    amount: number;
    currency: string;
    totalAmount: number;
    timestamp: number;
    roomsLeft?: number;
}

export class PriceCache {
    private static PREFIX = "price:";
    private static LOCK_PREFIX = "lock:price:";
    private static DEFAULT_TTL = 300; // 5 minutes
    private static CRITICAL_TTL = 60; // 1 minute for low availability

    static async get(hotelId: string): Promise<CachedPrice | null> {
        const key = `${this.PREFIX}${hotelId}`;
        const data = await redis.get(key);
        if (!data) return null;
        return JSON.parse(data);
    }

    static async set(hotelId: string, price: CachedPrice): Promise<void> {
        const key = `${this.PREFIX}${hotelId}`;
        const ttl = (price.roomsLeft !== undefined && price.roomsLeft < 3)
            ? this.CRITICAL_TTL
            : this.DEFAULT_TTL;

        await redis.setex(key, ttl, JSON.stringify(price));
    }

    /**
     * Implements Stale-while-revalidate.
     * If data is found and not too old, returns it.
     * If it's "stale" (near TTL), triggers the revalidate callback.
     */
    static async getWithSWR(
        hotelId: string,
        revalidate: () => Promise<CachedPrice>
    ): Promise<CachedPrice | null> {
        const cached = await this.get(hotelId);

        if (!cached) {
            const fresh = await revalidate();
            await this.set(hotelId, fresh);
            return fresh;
        }

        const age = (Date.now() - cached.timestamp) / 1000;
        const isStale = age > (this.DEFAULT_TTL / 2);

        if (isStale) {
            // Revalidate in background with an atomic lock to avoid dog-pile effect
            const lockKey = `${this.LOCK_PREFIX}${hotelId}`;
            redis.set(lockKey, "1", "EX", 30, "NX") // Lock for 30s
                .then(async (locked: string | null) => {
                    if (locked === "OK") {
                        try {
                            const fresh = await revalidate();
                            const cached = await this.get(hotelId);

                            // Check if significant price change occurred
                            if (cached && Math.abs(cached.amount - fresh.amount) > 0.01) {
                                RealtimeGateway.broadcast(`hotel:${hotelId}`, "price:update", {
                                    hotelId,
                                    newPrice: fresh.amount,
                                    currency: fresh.currency,
                                    roomsLeft: fresh.roomsLeft
                                });
                            }

                            await this.set(hotelId, fresh);
                        } finally {
                            await redis.del(lockKey);
                        }
                    }
                })
                .catch((err: Error) => logger.error({ err, hotelId }, "PriceCache SWR background refresh failed"));
        }

        return cached;
    }
}
