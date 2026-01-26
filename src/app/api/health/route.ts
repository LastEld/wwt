/**
 * Health Check API Route
 * 
 * GET /api/health
 * 
 * Returns status of all services (DB, Redis).
 * Used for container health checks and monitoring.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import redis from '@/lib/redis';

export const dynamic = 'force-dynamic';

interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    services: {
        database: 'connected' | 'disconnected';
        cache: 'connected' | 'disconnected';
    };
    version: string;
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
    const timestamp = new Date().toISOString();

    // Check database connection
    let dbStatus: 'connected' | 'disconnected' = 'disconnected';
    try {
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = 'connected';
    } catch {
        console.error('[HEALTH] Database connection failed');
    }

    // Check Redis connection
    let redisStatus: 'connected' | 'disconnected' = 'disconnected';
    try {
        const pong = await redis.ping();
        if (pong === 'PONG') {
            redisStatus = 'connected';
        }
    } catch {
        console.error('[HEALTH] Redis connection failed');
    }

    // Determine overall status
    const allHealthy = dbStatus === 'connected' && redisStatus === 'connected';
    const allUnhealthy = dbStatus === 'disconnected' && redisStatus === 'disconnected';

    const status: HealthStatus = {
        status: allHealthy ? 'healthy' : allUnhealthy ? 'unhealthy' : 'degraded',
        timestamp,
        services: {
            database: dbStatus,
            cache: redisStatus,
        },
        version: process.env.npm_package_version || '0.1.0',
    };

    const httpStatus = status.status === 'healthy' ? 200 : status.status === 'degraded' ? 200 : 503;

    return NextResponse.json(status, { status: httpStatus });
}
