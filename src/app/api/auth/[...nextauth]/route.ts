/**
 * NextAuth.js API Route Handler
 * 
 * Handles all auth-related requests:
 * - GET /api/auth/providers
 * - GET /api/auth/session
 * - POST /api/auth/signin
 * - POST /api/auth/signout
 * - GET /api/auth/callback/:provider
 */

import { GET, POST } from "@/lib/auth";

export { GET, POST };
