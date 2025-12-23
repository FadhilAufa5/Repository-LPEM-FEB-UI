import { Navbar } from '@/components/navbar';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Calendar,
    Download,
    FileText,
    FolderOpen,
    Tag,
    Users,
} from 'lucide-react';

interface Repository {
    id: number;
    kode: string;
    title: string;
    abstract: string;
    jenis_laporan: string;
    grup_kajian: string;
    author: string;
    staff: string[];
    year: number;
    file_url?: string;
    created_at: string;
}

interface RepositoryDetailProps {
    repository: Repository;
}

export default function RepositoryDetail({
    repository,
}: RepositoryDetailProps) {
    const { auth } = usePage<SharedData>().props;
    const currentYear = new Date().getFullYear();

    return (
        <>
            <Head title={repository.title} />

            <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
                <Navbar
                    isAuthenticated={!!auth.user}
                    loginUrl={login().url}
                    dashboardUrl={dashboard().url}
                />

                {/* Main Content */}
                <main className="mx-auto max-w-5xl px-6 py-8">
                    {/* Back Button */}
                    <Link
                        href="/repository"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-yellow-600 dark:text-neutral-400 dark:hover:text-yellow-400"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Repository
                    </Link>

                    {/* Repository Detail Card */}
                    <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-neutral-900">
                        {/* Header */}
                        <div className="mb-6 border-b border-gray-200 pb-6 dark:border-neutral-800">
                            <div className="mb-3 flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-400">
                                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400">
                                    {repository.kode}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {repository.year}
                                </span>
                            </div>
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                                {repository.title}
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
                                <Users className="h-4 w-4 text-yellow-600" />
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {repository.author}
                                </span>
                                <span>•</span>
                                <span>Published {repository.created_at}</span>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="space-y-6">
                            {/* Abstract */}
                            <div>
                                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                                    <FileText className="h-5 w-5 text-yellow-600" />
                                    Abstract
                                </h2>
                                <p className="leading-relaxed text-gray-700 dark:text-neutral-300">
                                    {repository.abstract}
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Jenis Laporan */}
                                <div>
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-neutral-300">
                                        <Tag className="h-4 w-4 text-yellow-600" />
                                        Report Type
                                    </h3>
                                    <p className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-neutral-800 dark:text-white">
                                        {repository.jenis_laporan}
                                    </p>
                                </div>

                                {/* Grup Kajian */}
                                <div>
                                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-neutral-300">
                                        <FolderOpen className="h-4 w-4 text-yellow-600" />
                                        Research Group
                                    </h3>
                                    <p className="rounded-lg bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:bg-neutral-800 dark:text-white">
                                        {repository.grup_kajian}
                                    </p>
                                </div>
                            </div>

                            {/* Staff */}
                            {repository.staff &&
                                repository.staff.length > 0 && (
                                    <div>
                                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-neutral-300">
                                            <Briefcase className="h-4 w-4 text-yellow-600" />
                                            Research Staff
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {repository.staff.map(
                                                (staff, index) => (
                                                    <span
                                                        key={index}
                                                        className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700 dark:bg-neutral-800 dark:text-neutral-300"
                                                    >
                                                        {staff}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* Download Button */}
                            {repository.file_url && (
                                <div className="pt-6">
                                    <a
                                        href={repository.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-yellow-700"
                                    >
                                        <Download className="h-5 w-5" />
                                        Download Document
                                    </a>
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
