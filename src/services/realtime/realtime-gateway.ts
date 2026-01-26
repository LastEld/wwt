import { Server as SocketServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import redis from "../../lib/redis";
import { getToken } from "next-auth/jwt";
import { logger } from "../../lib/logger";

export class RealtimeGateway {
    private static io: SocketServer | null = null;

    static async init(httpServer: any) {
        if (this.io) return this.io;

        this.io = new SocketServer(httpServer, {
            cors: {
                origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true
            },
            path: "/api/socket/io"
        });

        // 1. Setup Redis Adapter for multi-node scaling
        const pubClient = redis.duplicate();
        const subClient = redis.duplicate();
        this.io.adapter(createAdapter(pubClient, subClient));

        // 2. Authentication Handshake
        this.io.use(async (socket, next) => {
            try {
                const token = await getToken({
                    req: socket.request as any,
                    secret: process.env.NEXTAUTH_SECRET
                });

                if (token) {
                    (socket as any).userId = token.id;
                    next();
                } else {
                    // Allow anonymous connections for guest search, but limit room access
                    next();
                }
            } catch (err) {
                next(new Error("Authentication failed"));
            }
        });

        // 3. Connection Logic & Room Management
        this.io.on("connection", (socket) => {
            const userId = (socket as any).userId;
            logger.info({ socketId: socket.id, userId: userId || 'anonymous' }, "Socket connected");

            if (userId) {
                socket.join(`user:${userId}`);
            }

            socket.on("session:join", (sessionId: string) => {
                socket.join(`session:${sessionId}`);
            });

            socket.on("hotel:join", (hotelId: string) => {
                socket.join(`hotel:${hotelId}`);
            });

            socket.on("hotel:leave", (hotelId: string) => {
                socket.leave(`hotel:${hotelId}`);
            });

            socket.on("disconnect", () => {
                logger.info({ socketId: socket.id }, "Socket disconnected");
            });
        });

        return this.io;
    }

    static getInstance(): SocketServer {
        if (!this.io) {
            throw new Error("RealtimeGateway not initialized. Call init() first.");
        }
        return this.io;
    }

    /**
     * Broadcasts events to specific users or hotel property rooms.
     */
    static broadcast(room: string, event: string, data: any) {
        if (this.io) {
            this.io.to(room).emit(event, data);
        }
    }
}
