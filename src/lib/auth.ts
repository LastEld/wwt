/**
 * NextAuth.js Entry Point (v4)
 *
 * Exports auth handlers and utilities.
 */

import NextAuth from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth.config";

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;

export async function auth() {
    return getServerSession(authOptions);
}
