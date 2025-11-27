import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Search, Calendar, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Navbar } from '@/components/navbar';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [abstract, setAbstract] = useState('');
    const [year, setYear] = useState('');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement search logic
        console.log('Filters:', { title, author, abstract, year });
    };

    return (
        <>
            <Head title="Repository Search">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
                {/* Navbar */}
                <Navbar
                    isAuthenticated={!!auth.user}
                    loginUrl={login().url}
                    registerUrl={register().url}
                    dashboardUrl={dashboard().url}
                    canRegister={canRegister}
                />

                {/* Main Content */}
                <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
                    {/* Hero Section */}
                    <div className="mb-12 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary dark:bg-primary/20">
                            <Calendar className="size-4" />
                            <span>Cari berdasarkan tahun</span>
                        </div>
                        <h2 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-5xl">
                            Temukan Repository
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
                            Cari repository berdasarkan nama dan tahun dengan mudah. Temukan proyek yang Anda butuhkan dalam hitungan detik.
                        </p>
                    </div>

                    {/* Search Card */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg dark:border-neutral-800 dark:bg-neutral-950 md:p-10">
                        <h3 className="mb-6 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            Search for collections on LPEM FEB UI Repository
                        </h3>
                        <form onSubmit={handleSearch} className="space-y-5">
                            {/* Title */}
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter title..."
                                    className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 px-4 text-neutral-900 placeholder-neutral-400 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500"
                                />
                            </div>

                            {/* Author */}
                            <div className="space-y-2">
                                <label htmlFor="author" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Author
                                </label>
                                <input
                                    id="author"
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="Enter author name..."
                                    className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 px-4 text-neutral-900 placeholder-neutral-400 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500"
                                />
                            </div>

                            {/* Abstract */}
                            <div className="space-y-2">
                                <label htmlFor="abstract" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Abstract
                                </label>
                                <input
                                    id="abstract"
                                    type="text"
                                    value={abstract}
                                    onChange={(e) => setAbstract(e.target.value)}
                                    placeholder="Enter keywords from abstract..."
                                    className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 px-4 text-neutral-900 placeholder-neutral-400 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500"
                                />
                            </div>

                            {/* Year */}
                            <div className="space-y-2">
                                <label htmlFor="year" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Year
                                </label>
                                <select
                                    id="year"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 px-4 text-neutral-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                                >
                                    <option value="">All years</option>
                                    {years.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Search Button */}
                            <button
                                type="submit"
                                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-neutral-950"
                            >
                                <Search className="size-5" />
                                <span>Cari Repository</span>
                                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </form>

                        {/* Info */}
                        <div className="mt-6 border-t border-neutral-200 pt-5 dark:border-neutral-800">
                            <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                                {(() => {
                                    const activeFilters = [
                                        title && `Title: "${title}"`,
                                        author && `Author: "${author}"`,
                                        abstract && `Abstract: "${abstract}"`,
                                        year && `Year: ${year}`
                                    ].filter(Boolean);
                                    
                                    return activeFilters.length > 0 
                                        ? `Active filters: ${activeFilters.join(', ')}`
                                        : 'Use the filters above to search for repository collections';
                                })()}
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-12 grid gap-6 sm:grid-cols-3">
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-800 dark:bg-neutral-950">
                            <div className="mb-2 text-3xl font-bold text-primary">100+</div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">Repository Tersedia</div>
                        </div>
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-800 dark:bg-neutral-950">
                            <div className="mb-2 text-3xl font-bold text-primary">{currentYear - 2010}+</div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">Tahun Data</div>
                        </div>
                        <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-800 dark:bg-neutral-950">
                            <div className="mb-2 text-3xl font-bold text-primary">24/7</div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">Selalu Tersedia</div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-neutral-200 bg-white py-8 dark:border-neutral-800 dark:bg-neutral-950">
                    <div className="mx-auto max-w-7xl px-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
                        <p>&copy; {currentYear} Repository Finder. Built with Laravel & React.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
