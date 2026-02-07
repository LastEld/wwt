import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md text-center">
                <h1 className="text-6xl font-display font-bold text-brand mb-4">404</h1>
                <h2 className="text-xl font-semibold text-brand mb-2">Page Not Found</h2>
                <p className="text-brand-muted mb-8">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex px-8 py-4 rounded-2xl bg-brand text-white font-bold text-sm uppercase tracking-widest hover:bg-brand-gold transition-colors"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
