import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronRight as ChevronRightIcon,
    FileText,
    Filter,
    Home,
    Search,
} from 'lucide-react';
import { useState } from 'react';
import { RepositoryFilterSidebar, grupKajianOptions, reportTypeOptions } from '@/components/repository';

interface RepositoryItem {
    id: number;
    title: string;
    author: string;
    year: number;
    abstract: string;
    file_url?: string;
    jenis_laporan: string;
    grup_kajian: string;
    staff: string;
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
        grup_kajian?: string;
        jenis_laporan?: string;
    };
    grupKajianCounts?: Record<string, number>;
    reportTypeCounts?: Record<string, number>;
}

export default function Repository({
    canRegister = true,
    repositories,
    filters,
    grupKajianCounts = {},
    reportTypeCounts = {},
}: RepositoryPageProps) {
    const { auth } = usePage<SharedData>().props;
    const [showFilters, setShowFilters] = useState(false);
    const [selectedGrupKajian, setSelectedGrupKajian] = useState(
        filters.grup_kajian || '',
    );
    const [selectedReportType, setSelectedReportType] = useState(
        filters.jenis_laporan || '',
    );
    const [searchInputs, setSearchInputs] = useState({
        title: filters.title || '',
        author: filters.author || '',
        abstract: filters.abstract || '',
        year: filters.year || '',
    });
    const [isSearching, setIsSearching] = useState(false);

    const hasActiveFilters = Object.values(filters).some((v) => v);
    const activeFilterCount = Object.values(filters).filter((v) => v).length;

    const clearFilters = () => {
        setSelectedGrupKajian('');
        setSelectedReportType('');
        setSearchInputs({
            title: '',
            author: '',
            abstract: '',
            year: '',
        });
        router.get('/repository', {}, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSearching(true);
        
        const params: Record<string, string> = {};

        if (searchInputs.title) params.title = searchInputs.title;
        if (searchInputs.author) params.author = searchInputs.author;
        if (searchInputs.abstract) params.abstract = searchInputs.abstract;
        if (searchInputs.year) params.year = searchInputs.year;
        if (selectedGrupKajian) params.grup_kajian = selectedGrupKajian;
        if (selectedReportType) params.jenis_laporan = selectedReportType;

        router.get('/repository', params, { 
            preserveState: true,
            onFinish: () => setIsSearching(false),
        });
    };

    const handleInputChange = (field: keyof typeof searchInputs, value: string) => {
        setSearchInputs((prev) => ({ ...prev, [field]: value }));
    };

    const handleGrupKajianChange = (value: string) => {
        setSelectedGrupKajian(value);
        
        // Immediately apply the filter
        const params: Record<string, string> = {};
        if (searchInputs.title) params.title = searchInputs.title;
        if (searchInputs.author) params.author = searchInputs.author;
        if (searchInputs.abstract) params.abstract = searchInputs.abstract;
        if (searchInputs.year) params.year = searchInputs.year;
        if (value) params.grup_kajian = value; // Use new value
        if (selectedReportType) params.jenis_laporan = selectedReportType;
        
        router.get('/repository', params, { preserveState: true });
    };

    const handleReportTypeChange = (value: string) => {
        setSelectedReportType(value);
        
        // Immediately apply the filter
        const params: Record<string, string> = {};
        if (searchInputs.title) params.title = searchInputs.title;
        if (searchInputs.author) params.author = searchInputs.author;
        if (searchInputs.abstract) params.abstract = searchInputs.abstract;
        if (searchInputs.year) params.year = searchInputs.year;
        if (selectedGrupKajian) params.grup_kajian = selectedGrupKajian;
        if (value) params.jenis_laporan = value; // Use new value
        
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
                            Research Repository Search Results
                        </h1>
                        <div className="mt-2 flex items-center gap-3">
                            <p className="text-sm text-gray-600 dark:text-neutral-400">
                                Found{' '}
                                <span className="font-semibold text-yellow-600">
                                    {repositories.total}
                                </span>{' '}
                                document{repositories.total !== 1 ? 's' : ''}
                            </p>
                            {hasActiveFilters && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                    <Filter className="h-3 w-3" />
                                    {activeFilterCount} filter
                                    {activeFilterCount !== 1 ? 's' : ''} active
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                        {/* Sidebar Filters */}
                        <aside
                            className={`${showFilters ? 'block' : 'hidden'} lg:block`}
                        >
                            <RepositoryFilterSidebar
                                filters={filters}
                                selectedGrupKajian={selectedGrupKajian}
                                selectedReportType={selectedReportType}
                                searchInputs={searchInputs}
                                onGrupKajianChange={handleGrupKajianChange}
                                onReportTypeChange={handleReportTypeChange}
                                onInputChange={handleInputChange}
                                onSearch={handleSearch}
                                onClearFilters={clearFilters}
                                isSearching={isSearching}
                                grupKajianCounts={grupKajianCounts}
                                reportTypeCounts={reportTypeCounts}
                                totalCount={repositories.total}
                            />
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
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                                            <span>Title: {filters.title}</span>
                                            <button
                                                onClick={() => {
                                                    setSearchInputs(prev => ({ ...prev, title: '' }));
                                                    const params = { ...filters, title: undefined };
                                                    delete params.title;
                                                    router.get('/repository', params, { preserveState: true });
                                                }}
                                                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 p-0.5 transition-colors"
                                            >
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    )}
                                    {filters.author && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                                            <span>Author: {filters.author}</span>
                                            <button
                                                onClick={() => {
                                                    setSearchInputs(prev => ({ ...prev, author: '' }));
                                                    const params = { ...filters, author: undefined };
                                                    delete params.author;
                                                    router.get('/repository', params, { preserveState: true });
                                                }}
                                                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 p-0.5 transition-colors"
                                            >
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    )}
                                    {filters.abstract && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                                            <span>Keywords: {filters.abstract}</span>
                                            <button
                                                onClick={() => {
                                                    setSearchInputs(prev => ({ ...prev, abstract: '' }));
                                                    const params = { ...filters, abstract: undefined };
                                                    delete params.abstract;
                                                    router.get('/repository', params, { preserveState: true });
                                                }}
                                                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 p-0.5 transition-colors"
                                            >
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    )}
                                    {filters.year && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                                            <span>Year: {filters.year}</span>
                                            <button
                                                onClick={() => {
                                                    setSearchInputs(prev => ({ ...prev, year: '' }));
                                                    const params = { ...filters, year: undefined };
                                                    delete params.year;
                                                    router.get('/repository', params, { preserveState: true });
                                                }}
                                                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 p-0.5 transition-colors"
                                            >
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    )}
                                    {filters.grup_kajian && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                                            <span>
                                                Grup:{' '}
                                                {
                                                    grupKajianOptions.find(
                                                        (o) =>
                                                            o.value ===
                                                            filters.grup_kajian,
                                                    )?.label
                                                }
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setSelectedGrupKajian('');
                                                    const params = { ...filters, grup_kajian: undefined };
                                                    delete params.grup_kajian;
                                                    router.get('/repository', params, { preserveState: true });
                                                }}
                                                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 p-0.5 transition-colors"
                                            >
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    )}
                                    {filters.jenis_laporan && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                                            <span>
                                                Report Type:{' '}
                                                {
                                                    reportTypeOptions.find(
                                                        (o) =>
                                                            o.value ===
                                                            filters.jenis_laporan,
                                                    )?.label
                                                }
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setSelectedReportType('');
                                                    const params = { ...filters, jenis_laporan: undefined };
                                                    delete params.jenis_laporan;
                                                    router.get('/repository', params, { preserveState: true });
                                                }}
                                                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 p-0.5 transition-colors"
                                            >
                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Repository List */}
                            {repositories.data.length > 0 ? (
                                <div className="space-y-3">
                                    {repositories.data.map((repo) => (
                                        <div
                                            key={repo.id}
                                            className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-yellow-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-yellow-700"
                                        >
                                            <div className="mb-2">
                                                <p className="text-sm leading-snug text-gray-900 dark:text-white">
                                                    <span className="font-medium">
                                                        {repo.author}
                                                    </span>{' '}
                                                   {repo.staff && repo.staff.length > 0 && (
                                                                            <span className="text-xs text-gray-600 dark:text-neutral-400">
                                                                                {repo.staff.join(', ')}
                                                                            </span> 
                                                                        )} {' '}
                                                    ({repo.year}){' '}
                                                    <span className="font-semibold">
                                                        {repo.title}
                                                    </span>
                                                    . <span className="text-xs text-gray-600 dark:text-neutral-400">{repo.jenis_laporan}, {repo.grup_kajian}.</span>
                                                </p>
                                            </div>

                                            <p className="mb-3 text-xs leading-relaxed text-gray-600 dark:text-neutral-400">
                                                {repo.abstract.length > 200
                                                    ? `${repo.abstract.substring(0, 200)}...`
                                                    : repo.abstract}
                                            </p>

                                            <div className="border-t border-gray-200 pt-2 dark:border-neutral-800">
                                                <Link
                                                    href={`/repository/${repo.id}`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-600 transition-colors hover:text-yellow-700"
                                                >
                                                    <FileText className="h-3.5 w-3.5" />
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

                <Footer />
            </div>
        </>
    );
}
