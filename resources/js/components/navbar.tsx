import { Link } from '@inertiajs/react';
import { ChevronDown, Home, HelpCircle, Info, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
    isAuthenticated?: boolean;
    loginUrl?: string;
    registerUrl?: string;
    dashboardUrl?: string;
    canRegister?: boolean;
}

export function Navbar({ isAuthenticated, loginUrl, registerUrl, dashboardUrl, canRegister }: NavbarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const websites = [
        {
            name: 'LPEM FEB UI',
            url: 'https://lpem.org',
            description: 'Lembaga Penyelidikan Ekonomi dan Masyarakat'
        },
        {
            name: 'FEB UI',
            url: 'https://www.feb.ui.ac.id',
            description: 'Fakultas Ekonomi dan Bisnis Universitas Indonesia'
        },
        {
            name: 'Perpustakaan UI',
            url: 'https://lib.ui.ac.id',
            description: 'Perpustakaan Universitas Indonesia'
        },
        {
            name: 'Universitas Indonesia',
            url: 'https://www.ui.ac.id',
            description: 'Website Resmi Universitas Indonesia'
        },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo/Brand */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        <img className="w-24 " src="/logo_lpem.png" alt="logo_lpem" />
                    </Link>

                    {/* Navigation Menu */}
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-sm font-medium text-neutral-700 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                        >
                            <Home className="size-4" />
                            <span>Home</span>
                        </Link>

                        <Link
                            href="/about"
                            className="flex items-center gap-2 text-sm font-medium text-neutral-700 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                        >
                            <Info className="size-4" />
                            <span>About</span>
                        </Link>

                        <Link
                            href="/help"
                            className="flex items-center gap-2 text-sm font-medium text-neutral-700 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                        >
                            <HelpCircle className="size-4" />
                            <span>Help</span>
                        </Link>

                        {/* Link Website Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                                className="flex items-center gap-1 text-sm font-medium text-neutral-700 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                            >
                                <ExternalLink className="size-4" />
                                <span>Link Website</span>
                                <ChevronDown className={`size-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute left-0 top-full mt-2 w-80 rounded-lg border border-neutral-200 bg-white py-2 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
                                    {websites.map((site, index) => (
                                        <a
                                            key={index}
                                            href={site.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block px-4 py-3 transition hover:bg-neutral-100 dark:hover:bg-neutral-900"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <div className="font-medium text-neutral-900 dark:text-neutral-100">
                                                        {site.name}
                                                    </div>
                                                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                                        {site.description}
                                                    </div>
                                                </div>
                                                <ExternalLink className="size-4 shrink-0 text-neutral-400" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>
                </div>

                {/* Auth Buttons */}
                <nav className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <Link
                            href={dashboardUrl || '/dashboard'}
                            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={loginUrl || '/login'}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                            >
                                Login
                            </Link>
                            {canRegister && (
                                <Link
                                    href={registerUrl || '/register'}
                                    className="rounded-lg border border-neutral-300 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:border-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                                >
                                    Register
                                </Link>
                            )}
                        </>
                    )}
                </nav>
            </div>

            {/* Mobile Navigation */}
            <div className="border-t border-neutral-200 px-6 py-3 md:hidden dark:border-neutral-800">
                <div className="flex items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                    >
                        <Home className="size-3.5" />
                        <span>Home</span>
                    </Link>
                    <Link
                        href="/about"
                        className="flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                    >
                        <Info className="size-3.5" />
                        <span>About</span>
                    </Link>
                    <Link
                        href="/help"
                        className="flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                    >
                        <HelpCircle className="size-3.5" />
                        <span>Help</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
