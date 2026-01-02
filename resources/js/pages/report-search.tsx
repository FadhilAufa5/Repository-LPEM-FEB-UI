import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FileText,
    FileStack,
    GraduationCap,
    Newspaper,
    Library,
    FolderOpen,
    Home,
    ChevronRight,
    Search,
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

interface ReportSearchPageProps {
    repositories: {
        data: RepositoryItem[];
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
    jenisLaporanCounts: Record<string, number>;
    filters: {
        jenis_laporan?: string;
    };
}

const reportTypes = [
    {
        value: 'penelitian_survey',
        label: 'Penelitian + Survey',
        icon: FileStack,
        color: 'blue',
        description: 'Comprehensive research with survey data collection',
    },
    {
        value: 'penelitian',
        label: 'Penelitian',
        icon: Search,
        color: 'purple',
        description: 'Academic research and studies',
    },
    {
        value: 'diklat',
        label: 'Diklat',
        icon: GraduationCap,
        color: 'green',
        description: 'Training and education materials',
    },
    {
        value: 'jurnal',
        label: 'Jurnal',
        icon: Newspaper,
        color: 'yellow',
        description: 'Journal publications and articles',
    },
    {
        value: 'buku',
        label: 'Buku',
        icon: BookOpen,
        color: 'red',
        description: 'Books and monographs',
    },
    {
        value: 'lainnya',
        label: 'Lainnya',
        icon: FolderOpen,
        color: 'gray',
        description: 'Other types of reports',
    },
];

const colorClasses = {
    blue: {
        card: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-900 dark:hover:border-blue-700 dark:hover:bg-blue-950/30',
        icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
    purple: {
        card: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50 dark:border-purple-900 dark:hover:border-purple-700 dark:hover:bg-purple-950/30',
        icon: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
        badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    },
    green: {
        card: 'border-green-200 hover:border-green-400 hover:bg-green-50 dark:border-green-900 dark:hover:border-green-700 dark:hover:bg-green-950/30',
        icon: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
        badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    yellow: {
        card: 'border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50 dark:border-yellow-900 dark:hover:border-yellow-700 dark:hover:bg-yellow-950/30',
        icon: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
        badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    red: {
        card: 'border-red-200 hover:border-red-400 hover:bg-red-50 dark:border-red-900 dark:hover:border-red-700 dark:hover:bg-red-950/30',
        icon: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
        badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    },
    gray: {
        card: 'border-gray-200 hover:border-gray-400 hover:bg-gray-50 dark:border-neutral-700 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/50',
        icon: 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400',
        badge: 'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300',
    },
};

export default function ReportSearch({
    repositories,
    jenisLaporanCounts,
    filters,
}: ReportSearchPageProps) {
    const { auth } = usePage<SharedData>().props;
    const [selectedType, setSelectedType] = useState(filters.jenis_laporan || '');

    const handleTypeSelect = (type: string) => {
        setSelectedType(type);
        router.get('/report-search', { jenis_laporan: type }, { preserveState: true });
    };

    const getCount = (type: string) => {
        return jenisLaporanCounts[type] || 0;
    };

    return (
        <>
            <Head title="Search by Report Type - LPEM FEB UI Repository" />

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
                            <ChevronRight className="h-3 w-3" />
                            <span className="font-medium text-gray-900 dark:text-white">
                                Search by Report Type
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-6 py-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="mb-3 text-4xl font-bold text-gray-900 dark:text-white">
                            Browse by Report Type
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-neutral-400">
                            Explore our repository organized by document types
                        </p>
                    </div>

                    {/* Report Type Cards Grid */}
                    <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {reportTypes.map((type) => {
                            const Icon = type.icon;
                            const count = getCount(type.value);
                            const colors = colorClasses[type.color as keyof typeof colorClasses];

                            return (
                                <button
                                    key={type.value}
                                    onClick={() => handleTypeSelect(type.value)}
                                    className={`group relative overflow-hidden rounded-xl border-2 bg-white p-6 text-left shadow-sm transition-all duration-300 dark:bg-neutral-900 ${colors.card} ${
                                        selectedType === type.value
                                            ? 'ring-4 ring-yellow-500/20 scale-105'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div
                                            className={`rounded-xl p-3 ${colors.icon} transition-transform duration-300 group-hover:scale-110`}
                                        >
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        {count > 0 && (
                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-bold ${colors.badge}`}
                                            >
                                                {count}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="mb-2 mt-4 text-xl font-bold text-gray-900 dark:text-white">
                                        {type.label}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                                        {type.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>

                    {/* Results Section */}
                    {selectedType && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Results for {reportTypes.find((t) => t.value === selectedType)?.label}
                                </h2>
                                <button
                                    onClick={() => {
                                        setSelectedType('');
                                        router.get('/report-search', {}, { preserveState: true });
                                    }}
                                    className="text-sm font-medium text-yellow-600 hover:text-yellow-700 dark:text-yellow-400"
                                >
                                    Clear Selection
                                </button>
                            </div>

                            {repositories.data.length > 0 ? (
                                <>
                                    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                                            Found{' '}
                                            <span className="font-semibold text-yellow-600">
                                                {repositories.total}
                                            </span>{' '}
                                            document{repositories.total !== 1 ? 's' : ''}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {repositories.data.map((repo) => (
                                            <div
                                                key={repo.id}
                                                className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-yellow-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-yellow-700"
                                            >
                                                <div className="mb-3">
                                                    <p className="text-sm leading-snug text-gray-900 dark:text-white">
                                                        <span className="font-medium">
                                                            {repo.author}
                                                        </span>{' '}
                                                        ({repo.year}){' '}
                                                        <span className="font-semibold">
                                                            {repo.title}
                                                        </span>
                                                        .{' '}
                                                        <span className="text-xs text-gray-600 dark:text-neutral-400">
                                                            {repo.jenis_laporan}, {repo.grup_kajian}.
                                                        </span>
                                                    </p>
                                                </div>

                                                <p className="mb-4 text-xs leading-relaxed text-gray-600 dark:text-neutral-400">
                                                    {repo.abstract.length > 250
                                                        ? `${repo.abstract.substring(0, 250)}...`
                                                        : repo.abstract}
                                                </p>

                                                <div className="border-t border-gray-200 pt-3 dark:border-neutral-800">
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
                                </>
                            ) : (
                                <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
                                        <FileText className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                                        No Documents Found
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                                        There are no documents for this report type yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* No Selection State */}
                    {!selectedType && (
                        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center dark:border-neutral-700 dark:bg-neutral-900">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                                <Library className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                                Select a Report Type
                            </h3>
                            <p className="text-gray-600 dark:text-neutral-400">
                                Click on any report type card above to view documents in that category
                            </p>
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
}
