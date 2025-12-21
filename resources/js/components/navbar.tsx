import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
    isAuthenticated?: boolean;
    loginUrl?: string;
    dashboardUrl?: string;
}

export function Navbar({ isAuthenticated, loginUrl, dashboardUrl }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="border-b border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between sm:h-20">
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                        <img 
                            src="/logo_lpem.png" 
                            alt="LPEM FEB UI Logo" 
                            className="h-10 w-auto sm:h-12"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-6 md:flex">
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

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 md:hidden dark:text-neutral-300 dark:hover:bg-neutral-800"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="border-t border-gray-200 py-3 md:hidden dark:border-neutral-800">
                        <div className="flex flex-col space-y-3">
                            <Link
                                href="/"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-yellow-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-yellow-400"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/repository"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-yellow-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-yellow-400"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Repository
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
