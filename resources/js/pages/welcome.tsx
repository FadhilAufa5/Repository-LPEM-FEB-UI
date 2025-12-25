import { Navbar } from '@/components/navbar';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    CalendarDays,
    ChevronRight as ChevronRightIcon,
    FileText,
    FolderOpen,
    Home,
    Library,
    Search,
    User,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [abstract, setAbstract] = useState('');
    const [year, setYear] = useState('');
    const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
    const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
    const yearPickerRef = useRef<HTMLDivElement>(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                yearPickerRef.current &&
                !yearPickerRef.current.contains(event.target as Node)
            ) {
                setIsYearPickerOpen(false);
            }
        };

        if (isYearPickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [isYearPickerOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};

        if (title) params.title = title;
        if (author) params.author = author;
        if (abstract) params.abstract = abstract;
        if (year) params.year = year;

        router.get('/repository', params);
    };

    const handleYearSelect = (selectedYear: number) => {
        setYear(selectedYear.toString());
        setIsYearPickerOpen(false);
    };

    const renderYearGrid = () => {
        const startYear = Math.floor(displayYear / 12) * 12;
        const yearsToShow = Array.from({ length: 12 }, (_, i) => startYear + i);

        return yearsToShow.map((y) => {
            const isSelected = year === y.toString();
            const isCurrent = y === currentYear;

            return (
                <button
                    key={y}
                    type="button"
                    onClick={() => handleYearSelect(y)}
                    className={`rounded py-2 text-sm font-medium transition-all duration-200 ${
                        isSelected
                            ? 'scale-105 bg-yellow-600 text-white shadow-md'
                            : isCurrent
                              ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:hover:bg-yellow-950/50'
                              : 'text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                    } `}
                >
                    {y}
                </button>
            );
        });
    };

    return (
        <>
            <Head title="Scientific Repository">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=inter:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
                <Navbar
                    isAuthenticated={!!auth.user}
                    loginUrl={login().url}
                    dashboardUrl={dashboard().url}
                />

                {/* Search Bar Section */}
                <div className="border-b border-gray-200 bg-white py-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mx-auto max-w-7xl px-6">
                        <form
                            onSubmit={handleSearch}
                            className="mx-auto max-w-3xl"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Search for articles, theses, journals..."
                                    className="w-full rounded-full border-2 border-gray-300 py-3 pr-12 pl-6 text-sm shadow-sm transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-yellow-400"
                                />
                                <button
                                    type="submit"
                                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-yellow-600 p-2 text-white transition-colors hover:bg-yellow-700"
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Breadcrumb */}
                <div className="border-b border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mx-auto max-w-7xl px-6 py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
                            <Home className="h-4 w-4" />
                            <span className="font-medium text-yellow-600 dark:text-yellow-400">
                                Home
                            </span>
                            <ChevronRightIcon className="h-3 w-3" />
                            <span>Repository</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-6 py-8">
                    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Welcome Section */}
                            <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-neutral-900">
                                <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                                    Welcome to the LPEM FEB UI Repository
                                </h1>
                                <p className="mb-4 leading-relaxed text-gray-700 dark:text-neutral-300">
                                    This repository is a digital archive of
                                    intellectual output from LPEM FEB UI,
                                    including research papers, theses,
                                    dissertations, journals, and other scholarly
                                    works. Our mission is to preserve and
                                    provide open access to academic research for
                                    the benefit of the global research
                                    community.
                                </p>
                                <p className="leading-relaxed text-gray-700 dark:text-neutral-300">
                                    Browse our collections, search by author or
                                    subject, and discover the wealth of
                                    knowledge produced by our academic
                                    community.
                                </p>
                            </div>

                            {/* Announcement Box */}
                            <div className="rounded-lg border-l-4 border-yellow-600 bg-yellow-50 p-6 shadow-sm dark:bg-yellow-950/30">
                                <div className="flex gap-3">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                                    <div>
                                        <h3 className="mb-2 font-semibold text-yellow-900 dark:text-yellow-300">
                                            Important Notice for LPEM FEB UI
                                        </h3>
                                        <p className="text-sm leading-relaxed text-yellow-800 dark:text-yellow-300">
                                            All research outputs, working
                                            papers, policy briefs, and
                                            publications produced by LPEM FEB UI
                                            are required to be submitted to this
                                            repository for proper archiving and
                                            institutional record-keeping. Please
                                            contact the LPEM FEB UI
                                            administration for submission
                                            guidelines and procedures.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <aside className="space-y-6">
                            {/* Browse Menu */}
                            <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-neutral-900">
                                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                                    Browse
                                </h3>
                                <nav className="space-y-2">
                                    <Link
                                        href="/repository"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-yellow-50 hover:text-yellow-600 dark:text-neutral-300 dark:hover:bg-yellow-950/30 dark:hover:text-yellow-400"
                                    >
                                        <Library className="h-4 w-4" />
                                        <span>All Repository</span>
                                    </Link>
                                    <Link
                                        href="/repository"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-yellow-50 hover:text-yellow-600 dark:text-neutral-300 dark:hover:bg-yellow-950/30 dark:hover:text-yellow-400"
                                    >
                                        <FolderOpen className="h-4 w-4" />
                                        <span>Collections</span>
                                    </Link>
                                    <Link
                                        href="/repository"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-yellow-50 hover:text-yellow-600 dark:text-neutral-300 dark:hover:bg-yellow-950/30 dark:hover:text-yellow-400"
                                    >
                                        <CalendarDays className="h-4 w-4" />
                                        <span>By Issue Date</span>
                                    </Link>
                                    <Link
                                        href="/repository"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-yellow-50 hover:text-yellow-600 dark:text-neutral-300 dark:hover:bg-yellow-950/30 dark:hover:text-yellow-400"
                                    >
                                        <Users className="h-4 w-4" />
                                        <span>Authors</span>
                                    </Link>
                                    <Link
                                        href="/repository"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-yellow-50 hover:text-yellow-600 dark:text-neutral-300 dark:hover:bg-yellow-950/30 dark:hover:text-yellow-400"
                                    >
                                        <BookOpen className="h-4 w-4" />
                                        <span>Titles</span>
                                    </Link>
                                    <Link
                                        href="/repository"
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-yellow-50 hover:text-yellow-600 dark:text-neutral-300 dark:hover:bg-yellow-950/30 dark:hover:text-yellow-400"
                                    >
                                        <FileText className="h-4 w-4" />
                                        <span>Subjects</span>
                                    </Link>
                                </nav>
                            </div>

                            {/* My Account Box */}
                            <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-neutral-900">
                                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                                    My Account
                                </h3>
                                {!auth.user ? (
                                    <div className="space-y-3">
                                        <Link
                                            href={login().url}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-yellow-700"
                                        >
                                            <User className="h-4 w-4" />
                                            <span>Login</span>
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register().url}
                                                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-yellow-600 px-4 py-2 text-sm font-semibold text-yellow-600 transition-all hover:bg-yellow-50 dark:hover:bg-yellow-950/30"
                                            >
                                                Register
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                                            Welcome,{' '}
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {auth.user.name}
                                            </span>
                                        </p>
                                        <Link
                                            href={dashboard().url}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-yellow-700"
                                        >
                                            Go to Dashboard
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </aside>
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
                            -Repository
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
