import { Link } from '@inertiajs/react';

interface NavbarProps {
    isAuthenticated?: boolean;
    loginUrl?: string;
    dashboardUrl?: string;
}

export function Navbar({ isAuthenticated, loginUrl, dashboardUrl }: NavbarProps) {
    return (
        <nav className="border-b border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex h-20 items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                        <img 
                            src="/logo_lpem.png" 
                            alt="LPEM FEB UI Logo" 
                            className="h-12 w-auto"
                        />
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-sm font-medium text-gray-700 transition-colors hover:text-yellow-600 dark:text-neutral-300 dark:hover:text-yellow-400"
                        >
                            Home
                        </Link>
                        <Link
                            href="/repository"
                            className="text-sm font-medium text-gray-700 transition-colors hover:text-yellow-600 dark:text-neutral-300 dark:hover:text-yellow-400"
                        >
                            Repository
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
