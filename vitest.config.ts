import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
        exclude: ['node_modules', '.next'],
        coverage: {
            provider: 'v8' as any,
            reporter: ['text', 'lcov'],
            include: ['src/services/**', 'src/lib/**'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
})
