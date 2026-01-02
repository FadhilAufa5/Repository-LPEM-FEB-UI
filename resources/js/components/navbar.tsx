import { Link } from '@inertiajs/react';
import { Menu, X, Facebook, Instagram, Twitter, Linkedin, Globe } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
    isAuthenticated?: boolean;
    loginUrl?: string;
    dashboardUrl?: string;
}

export function Navbar({
    isAuthenticated,
    loginUrl,
    dashboardUrl,
}: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="border-b border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between sm:h-20">
                    <Link
                        href="/"
                        className="flex items-center gap-3 transition-opacity hover:opacity-80"
                    >
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

                        {/* Social Media Icons */}
                        <div className="flex items-center gap-3 border-l border-gray-300 pl-6 dark:border-neutral-700">
                            <a
                                href="https://lpem.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 transition-colors hover:text-yellow-600 dark:text-neutral-400 dark:hover:text-yellow-400"
                                aria-label="Website"
                            >
                                <Globe className="h-5 w-5" />
                            </a>
                            <a
                                href="https://facebook.com/lpemfebui"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 transition-colors hover:text-yellow-600 dark:text-neutral-400 dark:hover:text-yellow-400"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="https://instagram.com/lpemfebui"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 transition-colors hover:text-yellow-600 dark:text-neutral-400 dark:hover:text-yellow-400"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com/lpemfebui"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 transition-colors hover:text-yellow-600 dark:text-neutral-400 dark:hover:text-yellow-400"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="https://linkedin.com/company/lpem-feb-ui"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 transition-colors hover:text-yellow-600 dark:text-neutral-400 dark:hover:text-yellow-400"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
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
