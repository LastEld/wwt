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
};

export default nextConfig;
