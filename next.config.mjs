/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development experience
    reactStrictMode: true,

    // Optimize images from external hotel provider CDNs
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'photos.hotelbeds.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.cloudfront.net',
                pathname: '/**',
            },
        ],
    },

    // Enable experimental features for App Router
    experimental: {
        // Server Actions for mutations
        serverActions: {
            bodySizeLimit: '2mb',
        },
        serverComponentsExternalPackages: ['onnxruntime-node'],
    },

    // Logging configuration
    logging: {
        fetches: {
            fullUrl: process.env.NODE_ENV === 'development',
        },
    },

    // Security headers
    async headers() {
        const isDev = process.env.NODE_ENV === 'development';
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' blob: data: https://photos.hotelbeds.com https://*.cloudfront.net https://images.unsplash.com",
                            "font-src 'self'",
                            "connect-src 'self' ws: wss:",
                            "frame-ancestors 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                        ].join('; '),
                    },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
                ],
            },
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                ],
            },
        ];
    },
};

export default nextConfig;
