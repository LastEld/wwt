import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/checkout/'],
        },
        sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
    };
}
