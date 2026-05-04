import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { home } from '@/routes';
import { BookOpen, Lock, Shield } from 'lucide-react';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh">
            {/* ── Left Panel: Form ── */}
            <div className="relative flex w-full flex-col justify-between bg-white p-8 dark:bg-neutral-950 lg:w-1/2 lg:p-12">
                {/* Top Logo */}
                <div>
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
                    >
                        <img
                            src="/logo_lpem.png"
                            alt="LPEM FEB UI"
                            className="h-10 w-auto"
                        />
                        {/* <div className="hidden sm:block">
                            <p className="text-sm font-bold leading-tight text-gray-900 dark:text-white">
                                LPEM FEB UI
                            </p>
                            <p className="text-xs text-gray-500 dark:text-neutral-400">
                                Scientific Repository
                            </p>
                        </div> */}
                    </Link>
                </div>

                {/* Form Content */}
                <div className="mx-auto w-full max-w-sm">
                    {/* Heading */}
                    <div className="mb-8">
                        {/* <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                            <Lock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div> */}
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {title ?? 'Masuk ke Akun Anda'}
                        </h1>
                        {description && (
                            <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-neutral-400">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Slot */}
                    {children}
                </div>

                {/* Bottom Footer */}
                <p className="text-xs text-gray-400 dark:text-neutral-600">
                    © {new Date().getFullYear()} LPEM FEB UI. All rights reserved.
                </p>
            </div>

            {/* ── Right Panel: Branding ── */}
            <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
                {/* Background Image */}
                <img
                    src="/login-bg.png"
                    alt="Repository background"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-yellow-900/40" />

                {/* Content over image */}
                <div className="relative flex flex-col justify-between p-12 text-white">
                    {/* Top badge */}
                    <div className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 backdrop-blur-sm">
                        
                       
                    </div>

                    {/* Center copy */}
                    <div>
                        {/* <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/20 backdrop-blur-sm ring-1 ring-yellow-400/30">
                            <BookOpen className="h-8 w-8 text-yellow-400" />
                        </div> */}
                        <h2 className="mb-4 text-4xl font-bold leading-tight tracking-tight">
                            Research Repository{' '}
                            <span className="text-yellow-400">LPEM FEB UI</span>
                        </h2>
                        <p className="max-w-sm text-base leading-relaxed text-white/70">
                         Explore all our research archives, journals, and scientific documents in one place—safe, organized, and easy to access.
                        </p>

                        {/* Stats */}
                        <div className="mt-8 grid grid-cols-3 gap-4">
                            {[
                                { label: 'Documents', value: '500+' },
                                { label: 'Research', value: '200+' },
                                { label: 'Journals', value: '50+' },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm"
                                >
                                    <p className="text-2xl font-bold text-yellow-400">
                                        {stat.value}
                                    </p>
                                    <p className="mt-0.5 text-xs text-white/60">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom university logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo ui2.png"
                            alt="Universitas Indonesia"
                            className="h-10 w-auto opacity-80"
                        />
                        <div>
                            <p className="text-xs font-semibold text-white/80">
                                Lembaga Penelitian Ekonomi dan Masyarakat
                            </p>
                            <p className="text-xs text-white/50">
                                Fakultas Ekonomi dan Bisnis — Universitas Indonesia
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
