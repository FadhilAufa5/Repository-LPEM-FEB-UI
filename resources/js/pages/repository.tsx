import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Briefcase,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronRight as ChevronRightIcon,
    ChevronUp,
    FileText,
    Filter,
    Home,
    Search,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
        grup_kajian?: string;
    };
    grupKajianCounts?: Record<string, number>;
}

const grupKajianOptions = [
    { value: 'bc_glove', label: 'BC-GLOVE' },
    { value: 'nres', label: 'NRES' },
    { value: 'gec_rg', label: 'GEC-RG' },
    { value: 'dtbs', label: 'DTBS' },
    { value: 'mfpe', label: 'MFPE' },
    { value: 'spl', label: 'SPL' },
    { value: 'sece', label: 'SECE' },
    { value: 'devpfin', label: 'DEVPFIN' },
    { value: 'mpower', label: 'MPOWER' },
    { value: 'trust', label: 'TRUST' },
];

export default function Repository({
    canRegister = true,
    repositories,
    filters,
    grupKajianCounts = {},
}: RepositoryPageProps) {
    const { auth } = usePage<SharedData>().props;
    const [showFilters, setShowFilters] = useState(false);
    const [selectedGrupKajian, setSelectedGrupKajian] = useState(
        filters.grup_kajian || '',
    );
    const [searchInputs, setSearchInputs] = useState({
        title: filters.title || '',
        author: filters.author || '',
        abstract: filters.abstract || '',
        year: filters.year || '',
    });
    const [isSearching, setIsSearching] = useState(false);
    const [isGrupKajianExpanded, setIsGrupKajianExpanded] = useState(true);
    const [isAdditionalFiltersExpanded, setIsAdditionalFiltersExpanded] =
        useState(true);
    const currentYear = new Date().getFullYear();

    const hasActiveFilters = Object.values(filters).some((v) => v);
    const activeFilterCount = Object.values(filters).filter((v) => v).length;

    // Function to get count for a specific research group
    const getGroupCount = (groupValue: string) => {
        return grupKajianCounts[groupValue] || 0;
    };

    const clearFilters = () => {
        setSelectedGrupKajian('');
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
                                    className="space-y-5"
                                >
                                    {/* Grup Kajian Radio Buttons */}
                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsGrupKajianExpanded(
                                                    !isGrupKajianExpanded,
                                                )
                                            }
                                            className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 hover:text-yellow-600 transition-colors dark:text-white dark:hover:text-yellow-400"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Briefcase className="h-4 w-4 text-yellow-600" />
                                                Research Group
                                                {filters.grup_kajian && (
                                                    <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white">
                                                        1
                                                    </span>
                                                )}
                                            </span>
                                            {isGrupKajianExpanded ? (
                                                <ChevronUp className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                                            )}
                                        </button>
                                        <div
                                            className={`grid grid-cols-1 gap-2 transition-all duration-300 ease-in-out overflow-hidden ${
                                                isGrupKajianExpanded
                                                    ? 'max-h-[500px] opacity-100'
                                                    : 'max-h-0 opacity-0'
                                            }`}
                                        >
                                            <label className="flex items-center gap-2.5 cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-all hover:border-yellow-400 hover:bg-yellow-50 has-[:checked]:border-yellow-500 has-[:checked]:bg-yellow-50 has-[:checked]:ring-2 has-[:checked]:ring-yellow-500/20 dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-yellow-600 dark:hover:bg-yellow-900/20 dark:has-[:checked]:border-yellow-500 dark:has-[:checked]:bg-yellow-900/30">
                                                <input
                                                    type="radio"
                                                    name="grup_kajian"
                                                    value=""
                                                    checked={
                                                        selectedGrupKajian === ''
                                                    }
                                                    onChange={(e) =>
                                                        handleGrupKajianChange(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-4 w-4 text-yellow-600 focus:ring-2 focus:ring-yellow-500 border-gray-300 dark:border-neutral-600"
                                                />
                                                <span className="flex-1 font-medium text-gray-700 dark:text-neutral-200">
                                                    All Groups
                                                </span>
                                                <span 
                                                    className="inline-flex items-center justify-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 transition-all duration-200 dark:bg-neutral-700 dark:text-neutral-300"
                                                    title={`${repositories.total} total repositor${repositories.total > 1 ? 'ies' : 'y'}`}
                                                >
                                                    {repositories.total}
                                                </span>
                                            </label>
                                            <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-neutral-600 dark:scrollbar-track-neutral-800">
                                                {grupKajianOptions.map(
                                                    (option) => {
                                                        const count = getGroupCount(option.value);
                                                        return (
                                                            <label
                                                                key={option.value}
                                                                className="flex items-center gap-2.5 cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-2 text-sm transition-all hover:border-yellow-400 hover:bg-yellow-50 has-[:checked]:border-yellow-500 has-[:checked]:bg-yellow-50 has-[:checked]:ring-2 has-[:checked]:ring-yellow-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-yellow-600 dark:hover:bg-yellow-900/20 dark:has-[:checked]:border-yellow-500 dark:has-[:checked]:bg-yellow-900/30"
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="grup_kajian"
                                                                    value={
                                                                        option.value
                                                                    }
                                                                    checked={
                                                                        selectedGrupKajian ===
                                                                        option.value
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleGrupKajianChange(
                                                                            e.target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="h-4 w-4 text-yellow-600 focus:ring-2 focus:ring-yellow-500 border-gray-300 dark:border-neutral-600"
                                                                />
                                                                <span className="flex-1 font-medium text-gray-700 dark:text-neutral-200">
                                                                    {option.label}
                                                                </span>
                                                                {count > 0 && (
                                                                    <span 
                                                                        className="inline-flex items-center justify-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800 transition-all duration-200 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                                        title={`${count} repositor${count > 1 ? 'ies' : 'y'} available`}
                                                                    >
                                                                        {count}
                                                                    </span>
                                                                )}
                                                            </label>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Filters Section */}
                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsAdditionalFiltersExpanded(
                                                    !isAdditionalFiltersExpanded,
                                                )
                                            }
                                            className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 hover:text-yellow-600 transition-colors dark:text-white dark:hover:text-yellow-400"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Filter className="h-4 w-4 text-yellow-600" />
                                                Additional Filters
                                                {(filters.title ||
                                                    filters.author ||
                                                    filters.abstract ||
                                                    filters.year) && (
                                                    <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white">
                                                        {[
                                                            filters.title,
                                                            filters.author,
                                                            filters.abstract,
                                                            filters.year,
                                                        ].filter(Boolean).length}
                                                    </span>
                                                )}
                                            </span>
                                            {isAdditionalFiltersExpanded ? (
                                                <ChevronUp className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                                            )}
                                        </button>

                                        <div
                                            className={`space-y-4 transition-all duration-300 ease-in-out overflow-hidden ${
                                                isAdditionalFiltersExpanded
                                                    ? 'max-h-[800px] opacity-100'
                                                    : 'max-h-0 opacity-0'
                                            }`}
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
                                            value={searchInputs.title}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'title',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g. Economic Development..."
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                                            Search for words in document titles
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="author"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300"
                                        >
                                            <Users className="h-4 w-4 text-yellow-600" />
                                            Author / Staff
                                        </label>
                                        <input
                                            id="author"
                                            name="author"
                                            type="text"
                                            value={searchInputs.author}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'author',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g. John Doe..."
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                                            Search by lead researcher or staff
                                            members
                                        </p>
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
                                            value={searchInputs.abstract}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'abstract',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g. poverty analysis..."
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                                            Search in abstract, title, and
                                            document code
                                        </p>
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
                                            value={searchInputs.year}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'year',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="2024"
                                            min="1900"
                                            max={currentYear + 10}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-neutral-500">
                                            Filter by publication year
                                        </p>
                                    </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSearching}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Search
                                            className={`h-4 w-4 ${isSearching ? 'animate-pulse' : ''}`}
                                        />
                                        {isSearching ? 'Searching...' : 'Apply Filters'}
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
                                    {filters.grup_kajian && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                                            Grup:{' '}
                                            {
                                                grupKajianOptions.find(
                                                    (o) =>
                                                        o.value ===
                                                        filters.grup_kajian,
                                                )?.label
                                            }
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
