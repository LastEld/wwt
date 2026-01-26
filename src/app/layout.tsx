import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { NextAuthProvider } from "../components/providers/auth-provider";
import { SocketProvider } from "../components/providers/socket-provider";
import { QueryProvider } from "../components/providers/query-provider";
import { ChatWidget } from "../components/chat/ChatWidget";
import { PageTransition } from "../components/layout/PageTransition";

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'WinWin Travel | Personalized Luxury Discovery',
        template: '%s | WinWin Travel',
    },
    description:
        'The first neural-personalized travel platform. Find and book luxury hotels worldwide with zero-friction matching.',
    keywords: [
        'luxury travel',
        'neural search',
        'hotel booking',
        'personalized hotels',
        'exclusive stays',
        'winwin travel'
    ],
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://winwin.travel'),
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://winwin.travel',
        siteName: 'WinWin Travel',
        title: 'WinWin Travel | Discover Your Next Escape',
        description: 'AI-driven luxury discovery with real-time price stabilization.',
        images: [{ url: '/og-luxury.jpg', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'WinWin Travel',
        description: 'Neural personalized luxury discovery.',
        images: ['/og-luxury.jpg'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <body className="min-h-screen bg-background antialiased flex flex-col">
                <NextAuthProvider>
                    <QueryProvider>
                        <SocketProvider>
                            <Header />
                            <main className="flex-grow">
                                <PageTransition>
                                    {children}
                                </PageTransition>
                            </main>
                            <ChatWidget />
                            <Footer />
                        </SocketProvider>
                    </QueryProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
