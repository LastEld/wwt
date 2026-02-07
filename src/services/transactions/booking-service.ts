import prisma from "../../lib/prisma";
import { PriceLockService } from "./price-lock-service";
import { searchOrchestrator } from "../search/search-orchestrator";
import { RealtimeGateway } from "../realtime/realtime-gateway";
import { BookingStatus } from "@prisma/client";
import { logger } from "../../lib/logger";

export interface BookingRequest {
    lockToken: string;
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    specialRequests?: string;
    userId: string;
    hotelName: string; // Add these
    roomType: string;  // Add these
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms: number;
}

export class BookingService {
    /**
     * Executes the atomic booking process.
     */
    static async createBooking(req: BookingRequest) {
        // 1. Validate Price Lock
        const lockData = await PriceLockService.validateLock(req.lockToken);
        if (!lockData) {
            throw new Error("Price lock expired or invalid. Please refresh the page.");
        }

        // Logic Check: Does the lock match the user?
        if (lockData.userId && lockData.userId !== req.userId) {
            throw new Error("Security: Price lock belongs to a different session.");
        }

        // 2. Perform Atomic Prisma Transaction
        return await prisma.$transaction(async (tx) => {
            // A. Ensure user exists (required for demo/credentials mode)
            await tx.user.upsert({
                where: { id: req.userId },
                update: {
                    name: req.guestName,
                    email: req.guestEmail
                },
                create: {
                    id: req.userId,
                    name: req.guestName,
                    email: req.guestEmail
                }
            });

            // B. Create local record (PENDING)
            const booking = await tx.booking.create({
                data: {
                    userId: req.userId,
                    hotelId: lockData.hotelId,
                    hotelName: req.hotelName || lockData.hotelName || "Unknown Hotel",
                    roomId: lockData.roomId,
                    roomType: req.roomType || lockData.roomType || "Standard Room",
                    integration: lockData.integration,
                    checkIn: new Date(req.checkIn),
                    checkOut: new Date(req.checkOut),
                    nights: Math.ceil((new Date(req.checkOut).getTime() - new Date(req.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
                    guests: req.guests,
                    rooms: req.rooms,
                    pricePerNight: lockData.pricePerNight,
                    subtotal: lockData.totalPrice,
                    taxes: 0, // Simplified for MVP
                    fees: 0,
                    totalPrice: lockData.totalPrice,
                    currency: lockData.currency,
                    status: "PENDING",
                    guestName: req.guestName,
                    guestEmail: req.guestEmail,
                    guestPhone: req.guestPhone,
                    specialRequests: req.specialRequests
                }
            });

            try {
                // B. Call External Provider Adapter
                // Note: We'd normally use the orchestrator to find the right adapter
                logger.info({ integration: lockData.integration }, "Calling external provider adapter");

                // MOCK provider call
                const externalResult = await this.mockProviderReservation(lockData);

                if (externalResult.success) {
                    // C. Success: Update to CONFIRMED
                    const confirmedBooking = await tx.booking.update({
                        where: { id: booking.id },
                        data: {
                            status: "CONFIRMED",
                            confirmationId: externalResult.id,
                            confirmedAt: new Date()
                        }
                    });

                    // D. Post-success: Release lock and notify AI
                    await PriceLockService.releaseLock(req.lockToken);

                    RealtimeGateway.broadcast(`user:${req.userId}`, "booking:update", {
                        id: booking.id,
                        status: "CONFIRMED",
                        message: "Your stay is officially neuralized!"
                    });

                    return confirmedBooking;
                } else {
                    throw new Error(externalResult.message || "Provider reservation failed");
                }
            } catch (err: any) {
                logger.error({ err, integration: lockData.integration }, "Booking service integration error");

                // If we get here, the transaction rolls back local DB automatically.
                // BUT we must ensure the provider hasn't already reserved something.
                // In production: trigger a separate Audit Queue to verify status.
                throw err;
            }
        });
    }

    /**
     * Retrieves all bookings for a specific user.
     */
    static async getUserBookings(userId: string) {
        return prisma.booking.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }

    private static async mockProviderReservation(data: any) {
        // Simulating network delay
        await new Promise(r => setTimeout(r, 1500));

        // 90% success rate for simulation
        if (Math.random() > 0.1) {
            return {
                success: true,
                id: `CONF-${Math.random().toString(36).substring(7).toUpperCase()}`
            };
        }
        return {
            success: false,
            message: "Allergy-friendly rooms are temporarily unavailable at this location."
        };
    }
}
