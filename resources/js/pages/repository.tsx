import { Navbar } from '@/components/navbar';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ChevronRight as ChevronRightIcon,
    FileText,
    Filter,
    Home,
    Search,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface RepositoryItem {
    id: number;
    title: string;
    author: string;
    year: number;
    abstract: string;
    file_url?: string;
    jenis_laporan: string;
    grup_kajian: string;
}

interface RepositoryPageProps {
    canRegister?: boolean;
    repositories: {
        data: RepositoryItem[];
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
    filters: {
        title?: string;
        author?: string;
        abstract?: string;
        year?: string;
    };
}

export default function Repository({
    canRegister = true,
    repositories,
    filters,
}: RepositoryPageProps) {
    const { auth } = usePage<SharedData>().props;
    const [showFilters, setShowFilters] = useState(false);
    const currentYear = new Date().getFullYear();

    const hasActiveFilters = Object.values(filters).some((v) => v);

    const clearFilters = () => {
        router.get('/repository', {}, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const params: Record<string, string> = {};

        formData.forEach((value, key) => {
            if (value) params[key] = value.toString();
        });

        router.get('/repository', params, { preserveState: true });
    };

    return (
        <>
            <Head title="Repository" />

            <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
                <Navbar
                    isAuthenticated={!!auth.user}
                    loginUrl={login().url}
                    dashboardUrl={dashboard().url}
                />

                {/* Breadcrumb */}
                <div className="border-b border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mx-auto max-w-7xl px-6 py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400"
                            >
                                <Home className="h-4 w-4" />
                                <span>Home</span>
                            </Link>
                            <ChevronRightIcon className="h-3 w-3" />
                            <span className="font-medium text-gray-900 dark:text-white">
                                Repository
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-6 py-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Repository Search Results
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                            Found {repositories.total} documents in our
                            collection
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                        {/* Sidebar Filters */}
                        <aside
                            className={`${showFilters ? 'block' : 'hidden'} lg:block`}
                        >
                            <div className="sticky top-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
                                        <Filter className="h-4 w-4" />
                                        Filter Search
                                    </h2>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-xs font-medium text-yellow-600 hover:text-yellow-700"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>

                                <form
                                    onSubmit={handleSearch}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="title"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300"
                                        >
                                            <BookOpen className="h-4 w-4 text-yellow-600" />
                                            Title
                                        </label>
                                        <input
                                            id="title"
                                            name="title"
                                            type="text"
                                            defaultValue={filters.title}
                                            placeholder="Search by title..."
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="author"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300"
                                        >
                                            <Users className="h-4 w-4 text-yellow-600" />
                                            Author
                                        </label>
                                        <input
                                            id="author"
                                            name="author"
                                            type="text"
                                            defaultValue={filters.author}
                                            placeholder="Search by author..."
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="abstract"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300"
                                        >
                                            <FileText className="h-4 w-4 text-yellow-600" />
                                            Keywords
                                        </label>
                                        <input
                                            id="abstract"
                                            name="abstract"
                                            type="text"
                                            defaultValue={filters.abstract}
                                            placeholder="Search by keywords..."
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="year"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300"
                                        >
                                            <Calendar className="h-4 w-4 text-yellow-600" />
                                            Year
                                        </label>
                                        <input
                                            id="year"
                                            name="year"
                                            type="number"
                                            defaultValue={filters.year}
                                            placeholder="2024"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
                                    >
                                        <Search className="h-4 w-4" />
                                        Apply Filters
                                    </button>
                                </form>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="space-y-4">
                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 lg:hidden dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                            >
                                <Filter className="h-4 w-4" />
                                {showFilters ? 'Hide' : 'Show'} Filters
                            </button>

                            {/* Active Filters */}
                            {hasActiveFilters && (
                                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950/30">
                                    <span className="text-xs font-semibold text-yellow-900 dark:text-yellow-300">
                                        Active Filters:
                                    </span>
                                    {filters.title && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                                            Title: {filters.title}
                                        </span>
                                    )}
                                    {filters.author && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                                            Author: {filters.author}
                                        </span>
                                    )}
                                    {filters.abstract && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                                            Keywords: {filters.abstract}
                                        </span>
                                    )}
                                    {filters.year && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                                            Year: {filters.year}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Repository List */}
                            {repositories.data.length > 0 ? (
                                <div className="space-y-4">
                                    {repositories.data.map((repo) => (
                                        <div
                                            key={repo.id}
                                            className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-yellow-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-yellow-700"
                                        >
                                            <div className="mb-4">
                                                <p className="text-base leading-relaxed text-gray-900 dark:text-white">
                                                    <span className="font-medium">
                                                        {repo.author}
                                                    </span>{' '}
                                                    ({repo.year}){' '}
                                                    <span className="font-semibold">
                                                        {repo.title}
                                                    </span>
                                                    . {repo.jenis_laporan}, {repo.grup_kajian}.
                                                </p>
                                            </div>

                                            <p className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-neutral-300">
                                                {repo.abstract.length > 250
                                                    ? `${repo.abstract.substring(0, 250)}...`
                                                    : repo.abstract}
                                            </p>

                                            <div className="border-t border-gray-200 pt-4 dark:border-neutral-800">
                                                <Link
                                                    href={`/repository/${repo.id}`}
                                                    className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-600 transition-colors hover:text-yellow-700"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50 dark:bg-yellow-950/30">
                                        <Search className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                                        No Results Found
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                                        Try adjusting your search filters to
                                        find what you're looking for
                                    </p>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="mt-4 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-yellow-700"
                                        >
                                            Clear All Filters
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Pagination */}
                            {repositories.last_page > 1 &&
                                repositories.data.length > 0 && (
                                    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900">
                                        <div className="text-sm text-gray-600 dark:text-neutral-400">
                                            Showing{' '}
                                            {(repositories.current_page - 1) *
                                                repositories.per_page +
                                                1}{' '}
                                            to{' '}
                                            {Math.min(
                                                repositories.current_page *
                                                    repositories.per_page,
                                                repositories.total,
                                            )}{' '}
                                            of {repositories.total} documents
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    const params = {
                                                        ...filters,
                                                        page: (
                                                            repositories.current_page -
                                                            1
                                                        ).toString(),
                                                    };
                                                    router.get(
                                                        '/repository',
                                                        params,
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }}
                                                disabled={
                                                    repositories.current_page ===
                                                    1
                                                }
                                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:disabled:hover:bg-neutral-800"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </button>

                                            <div className="flex items-center gap-1">
                                                {Array.from(
                                                    {
                                                        length: repositories.last_page,
                                                    },
                                                    (_, i) => i + 1,
                                                ).map((page) => {
                                                    const showPage =
                                                        page === 1 ||
                                                        page ===
                                                            repositories.last_page ||
                                                        (page >=
                                                            repositories.current_page -
                                                                1 &&
                                                            page <=
                                                                repositories.current_page +
                                                                    1);

                                                    const showEllipsisBefore =
                                                        page ===
                                                            repositories.current_page -
                                                                2 &&
                                                        repositories.current_page >
                                                            3;
                                                    const showEllipsisAfter =
                                                        page ===
                                                            repositories.current_page +
                                                                2 &&
                                                        repositories.current_page <
                                                            repositories.last_page -
                                                                2;

                                                    if (
                                                        showEllipsisBefore ||
                                                        showEllipsisAfter
                                                    ) {
                                                        return (
                                                            <span
                                                                key={page}
                                                                className="px-2 text-gray-500 dark:text-neutral-500"
                                                            >
                                                                ...
                                                            </span>
                                                        );
                                                    }

                                                    if (!showPage) return null;

                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => {
                                                                const params = {
                                                                    ...filters,
                                                                    page: page.toString(),
                                                                };
                                                                router.get(
                                                                    '/repository',
                                                                    params,
                                                                    {
                                                                        preserveState: true,
                                                                        preserveScroll: true,
                                                                    },
                                                                );
                                                            }}
                                                            className={`hidden h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-all sm:inline-flex ${
                                                                page ===
                                                                repositories.current_page
                                                                    ? 'bg-yellow-600 text-white shadow-sm hover:bg-yellow-700'
                                                                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <button
                                                onClick={() => {
                                                    const params = {
                                                        ...filters,
                                                        page: (
                                                            repositories.current_page +
                                                            1
                                                        ).toString(),
                                                    };
                                                    router.get(
                                                        '/repository',
                                                        params,
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }}
                                                disabled={
                                                    repositories.current_page ===
                                                    repositories.last_page
                                                }
                                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:disabled:hover:bg-neutral-800"
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white py-6 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mx-auto max-w-7xl px-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                            &copy; {currentYear}{' '}
                            <span className="font-bold text-yellow-600">
                                LPEM FEB UI
                            </span>{' '}
                            - Scientific Repository
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                            Preserving and sharing academic excellence
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
