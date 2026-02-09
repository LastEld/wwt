import { logger } from "./logger";

// =============================================================================
// ApiError — Typed operational error for use in API routes
// =============================================================================

export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    // Convenience factory methods
    static badRequest(message: string) {
        return new ApiError(message, 400);
    }
    static unauthorized(message = "Unauthorized") {
        return new ApiError(message, 401);
    }
    static forbidden(message = "Forbidden") {
        return new ApiError(message, 403);
    }
    static notFound(message = "Resource not found") {
        return new ApiError(message, 404);
    }
    static conflict(message = "Resource conflict") {
        return new ApiError(message, 409);
    }
    static internal(message = "Internal server error") {
        return new ApiError(message, 500, false);
    }
}

// =============================================================================
// Sanitised error result returned to the client
// =============================================================================

export interface ApiErrorResult {
    error: string;
    status: number;
}

// =============================================================================
// Prisma error code mapping
// Covers the most common Prisma Client known-request errors.
// Reference: https://www.prisma.io/docs/reference/api-reference/error-reference
// =============================================================================

const PRISMA_ERROR_MAP: Record<string, { status: number; message: string }> = {
    P2000: { status: 400, message: "Value too long for the column" },
    P2001: { status: 404, message: "Record not found" },
    P2002: { status: 409, message: "A record with that value already exists" },
    P2003: { status: 400, message: "Related record not found" },
    P2006: { status: 400, message: "Invalid value provided" },
    P2014: { status: 400, message: "Invalid relation in request" },
    P2015: { status: 404, message: "Related record not found" },
    P2025: { status: 404, message: "Record not found" },
};

// =============================================================================
// handleApiError — single entry-point for every catch block
// =============================================================================

/**
 * Logs the full error server-side via Pino and returns a sanitised payload
 * that is safe to send back to the API consumer.
 *
 * @param error   The caught value (may be anything)
 * @param context A short label identifying the route/handler, e.g. "SearchAPI"
 * @returns       `{ error: string; status: number }` safe for NextResponse.json
 */
export function handleApiError(error: unknown, context: string): ApiErrorResult {
    // ------------------------------------------------------------------
    // 1. Operational ApiError — message was crafted by us, safe to relay
    // ------------------------------------------------------------------
    if (error instanceof ApiError && error.isOperational) {
        logger.warn(
            { err: error, context, statusCode: error.statusCode },
            `[${context}] Operational error`
        );
        return { error: error.message, status: error.statusCode };
    }

    // ------------------------------------------------------------------
    // 2. Zod validation error
    // ------------------------------------------------------------------
    if (isZodError(error)) {
        const zodMessages = error.issues
            .map((i: { path: (string | number)[]; message: string }) =>
                `${i.path.join(".")}: ${i.message}`
            )
            .join("; ");

        logger.warn(
            { err: { message: zodMessages }, context },
            `[${context}] Validation error`
        );
        return { error: "Validation failed", status: 400 };
    }

    // ------------------------------------------------------------------
    // 3. Prisma known-request error (PrismaClientKnownRequestError)
    // ------------------------------------------------------------------
    if (isPrismaError(error)) {
        const mapped = PRISMA_ERROR_MAP[error.code];
        logger.error(
            { err: { message: error.message, code: error.code, meta: error.meta }, context },
            `[${context}] Prisma error`
        );
        if (mapped) {
            return { error: mapped.message, status: mapped.status };
        }
        // Unknown Prisma code — treat as 500
        return { error: "A database error occurred", status: 500 };
    }

    // ------------------------------------------------------------------
    // 4. Prisma validation error (PrismaClientValidationError)
    // ------------------------------------------------------------------
    if (isPrismaValidationError(error)) {
        logger.error(
            { err: { message: error.message }, context },
            `[${context}] Prisma validation error`
        );
        return { error: "Invalid database query", status: 400 };
    }

    // ------------------------------------------------------------------
    // 5. Standard Error (catch-all for Error subclasses)
    // ------------------------------------------------------------------
    if (error instanceof Error) {
        logger.error(
            { err: { message: error.message, stack: error.stack, name: error.name }, context },
            `[${context}] Unhandled error`
        );
        return { error: "Internal server error", status: 500 };
    }

    // ------------------------------------------------------------------
    // 6. Non-Error throw (string, number, etc.)
    // ------------------------------------------------------------------
    logger.error(
        { err: { value: String(error) }, context },
        `[${context}] Non-Error thrown`
    );
    return { error: "Internal server error", status: 500 };
}

// =============================================================================
// Type guards — duck-typed so we don't need Prisma/Zod as hard dependencies
// =============================================================================

interface ZodLikeError {
    name: string;
    issues: { path: (string | number)[]; message: string }[];
}

function isZodError(err: unknown): err is ZodLikeError {
    return (
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        (err as { name: string }).name === "ZodError" &&
        "issues" in err &&
        Array.isArray((err as ZodLikeError).issues)
    );
}

interface PrismaKnownError {
    name: string;
    code: string;
    message: string;
    meta?: unknown;
}

function isPrismaError(err: unknown): err is PrismaKnownError {
    return (
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        (err as { name: string }).name === "PrismaClientKnownRequestError" &&
        "code" in err
    );
}

interface PrismaValidationError {
    name: string;
    message: string;
}

function isPrismaValidationError(err: unknown): err is PrismaValidationError {
    return (
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        (err as { name: string }).name === "PrismaClientValidationError"
    );
}
