# Prompt 1: Project Foundation (Scaffolding & Auth)

---

## [MESSAGE 1: IGNITION]

### Task
Initialize a Next.js 14 project with Tailwind CSS and TypeScript. Set up the development environment including Docker and Prisma.

### Requirements
- **Directory Structure**: Create the folder structure specified in `implementation_plan.md`.
- **Environment**: Implement `.env.example` as provided in the root.
- **Docker**: Create `docker-compose.yml` with PostgreSQL and Redis.
- **Database**: Implement `schema.prisma` with `User`, `Account`, `Session`, `Reaction`, `Booking`, and `UserPreferences` models.
- **Authentication**: Configure NextAuth.js in `src/lib/auth.config.ts` with Google and Facebook providers + Prisma adapter.
- **Utilities**: Set up `prisma.ts` and `redis.ts` clients.

### Output
A working Next.js project that can connect to DB/Redis and has the auth configuration ready.

---

## [MESSAGE 2: HEALING]
Use the **[Universal Healing Prompt](file:///e:/evidenceWWT/prompts/builder/HEALING_PROMPT_TEMPLATE.md)** to audit and finalize this step. Ensure `schema.prisma` mapping matches the specification perfectly.
