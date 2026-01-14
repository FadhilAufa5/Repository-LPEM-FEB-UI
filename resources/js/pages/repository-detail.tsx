import { Navbar } from '@/components/navbar';
import { dashboard, login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Footer } from '@/components/footer';
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
    file_name?: string;
    file_size?: number;
    created_at: string;
}

interface RepositoryDetailProps {
    repository: Repository;
}

export default function RepositoryDetail({
    repository,
}: RepositoryDetailProps) {
    const { auth } = usePage<SharedData>().props;
    const [copied, setCopied] = useState(false);
    const currentYear = new Date().getFullYear();

    const formatDate = (d: string) => {
        try {
            return new Date(d).toLocaleDateString();
        } catch (e) {
            return d;
        }
    };

    const copyCitation = () => {
        const citation = `${repository.author} (${repository.year}). ${repository.title}. ${repository.grup_kajian}.`;
        if (navigator && 'clipboard' in navigator) {
            navigator.clipboard.writeText(citation).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

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
                <main className="mx-auto max-w-6xl px-6 py-8">
                    {/* Back Button */}
                    <Link
                        href="/repository"
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-yellow-600 dark:text-neutral-400 dark:hover:text-yellow-400"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Repository
                    </Link>
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main column */}
                        <div className="lg:col-span-2">
                            <div>
                                <div className="mb-6 flex items-start justify-between gap-6 pb-6">
                                    <div>
                                        <div className="mb-3 flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-400">
                                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400">
                                                {repository.kode}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {repository.year}
                                            </span>
                                        </div>
                                        <h1 className="mb-3 text-3xl font-extrabold leading-tight text-gray-900 dark:text-white">
                                            {repository.title}
                                        </h1>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-neutral-400">
                                            <Users className="h-4 w-4 text-yellow-600" />
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {repository.author}
                                            </span>
                                            <span className="text-xs text-gray-500">•</span>
                                            <span className="text-sm text-gray-500">
                                                Published {formatDate(repository.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        {repository.file_url && repository.file_name ? (
                                            <div className="space-y-1">
                                                <a
                                                    href={repository.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400 dark:hover:bg-yellow-950/50"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    View File
                                                </a>
                                                <p className="text-xs text-gray-500 dark:text-neutral-500">
                                                    {repository.file_name}
                                                    {repository.file_size && ` (${(repository.file_size / 1024 / 1024).toFixed(2)} MB)`}
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 dark:text-neutral-600">
                                                <FileText className="h-4 w-4" />
                                                No File
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-yellow-600" />
                                        Abstract
                                    </h2>
                                    <p className="mt-3 leading-relaxed text-gray-700 dark:text-neutral-300">
                                        {repository.abstract}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                       <aside className="lg:col-span-1">
    <div className="sticky top-24">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Document Details
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                    Quick metadata and actions
                </p>
            </div>

            {/* Metadata */}
            <div className="space-y-4 text-sm">
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                        Type
                    </p>
                    <p className="font-medium text-gray-900 dark:text-neutral-200">
                        {repository.jenis_laporan}
                    </p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                        Group
                    </p>
                    <p className="font-medium text-gray-900 dark:text-neutral-200">
                        {repository.grup_kajian}
                    </p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                        Authors
                    </p>
                    <p className="font-medium text-gray-900 dark:text-neutral-200">
                        {repository.author}
                    </p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                        Year
                    </p>
                    <p className="font-medium text-gray-900 dark:text-neutral-200">
                        {repository.year}
                    </p>
                </div>
            </div>

            {/* Staff */}
            {repository.staff?.length > 0 && (
                <div className="mt-5 border-t border-gray-100 pt-4 dark:border-neutral-800">
                    <p className="mb-1 text-xs uppercase tracking-wide text-gray-500">
                        Research Staff
                    </p>
                    <p className="text-sm text-gray-700 dark:text-neutral-300">
                        {repository.staff.join(', ')}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 dark:border-neutral-800">
                <button
                    onClick={copyCitation}
                    className="flex w-full items-center gap-2 text-sm font-medium text-yellow-700 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                >
                    <Tag className="h-4 w-4" />
                    {copied ? 'Citation Copied' : 'Copy Citation'}
                </button>

                {repository.file_url && repository.file_name && (
                    <a
                        href={repository.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-yellow-700 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                    >
                        <Download className="h-4 w-4" />
                        View File ({repository.file_name})
                    </a>
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 text-xs text-gray-500">
                Code:{' '}
                <span className="font-medium text-gray-700 dark:text-neutral-300">
                    {repository.kode}
                </span>
            </div>
        </div>
    </div>
</aside>

                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
}
