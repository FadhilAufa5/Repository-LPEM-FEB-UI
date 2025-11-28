import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, Calendar, ChevronLeft, ChevronRight, BookOpen, Users, FileText, ChevronRight as ChevronRightIcon, Home, FolderOpen, CalendarDays, User, AlertCircle, Library } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
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
            if (yearPickerRef.current && !yearPickerRef.current.contains(event.target as Node)) {
                setIsYearPickerOpen(false);
            }
        };

        if (isYearPickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
                    className={`
                        rounded py-2 text-sm font-medium transition-all duration-200
                        ${isSelected 
                            ? 'bg-yellow-600 text-white shadow-md scale-105' 
                            : isCurrent
                            ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:hover:bg-yellow-950/50'
                            : 'hover:bg-gray-100 text-gray-700 dark:hover:bg-neutral-800 dark:text-neutral-300'
                        }
                    `}
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
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
                {/* Clean Navbar */}
                <nav className="border-b border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="flex h-20 items-center justify-between">
                            {/* Logo & Title */}
                            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                                <img 
                                    src="/logo_lpem.png" 
                                    alt="LPEM FEB UI Logo" 
                                    className="h-12 w-auto"
                                />
                                {/* <div className="hidden md:block">
                                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                                        LPEM FEB UI
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-neutral-400">
                                        Scientific Repository
                                    </div>
                                </div> */}
                            </Link>

                            {/* Navigation Links & Auth */}
                            <div className="flex items-center gap-6">
                                <Link
                                    href="/"
                                    className="text-sm font-medium text-gray-700 transition-colors hover:text-yellow-600 dark:text-neutral-300 dark:hover:text-yellow-400"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/repository"
                                    className="text-sm font-medium text-gray-700 transition-colors hover:text-yellow-600 dark:text-neutral-300 dark:hover:text-yellow-400"
                                >
                                    Repository
                                </Link>


                                
                                {/* {!auth.user ? (
                                    <Link
                                        href={login().url}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                    >
                                        Login
                                    </Link>
                                ) : (
                                    <Link
                                        href={dashboard().url}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                    >
                                        Dashboard
                                    </Link>
                                )} */}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Search Bar Section */}
                <div className="border-b border-gray-200 bg-white py-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mx-auto max-w-7xl px-6">
                        <form onSubmit={handleSearch} className="mx-auto max-w-3xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Search for articles, theses, journals..."
                                    className="w-full rounded-full border-2 border-gray-300 py-3 pl-6 pr-12 text-sm shadow-sm transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-yellow-400"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-yellow-600 p-2 text-white transition-colors hover:bg-yellow-700"
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
                            <span className="font-medium text-yellow-600 dark:text-yellow-400">Home</span>
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
                                    Welcome to the University Scientific Repository
                                </h1>
                                <p className="mb-4 leading-relaxed text-gray-700 dark:text-neutral-300">
                                    This repository is a digital archive of intellectual output from LPEM FEB UI, including research papers, theses, dissertations, journals, and other scholarly works. Our mission is to preserve and provide open access to academic research for the benefit of the global research community.
                                </p>
                                <p className="leading-relaxed text-gray-700 dark:text-neutral-300">
                                    Browse our collections, search by author or subject, and discover the wealth of knowledge produced by our academic community.
                                </p>
                            </div>

                            {/* Announcement Box */}
                            <div className="rounded-lg border-l-4 border-yellow-600 bg-yellow-50 p-6 shadow-sm dark:bg-yellow-950/30">
                                <div className="flex gap-3">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                                    <div>
                                        <h3 className="mb-2 font-semibold text-yellow-900 dark:text-yellow-300">
                                            Important Notice for Students
                                        </h3>
                                        <p className="text-sm leading-relaxed text-yellow-800 dark:text-yellow-300">
                                            All students are required to submit their final thesis or dissertation to the repository before graduation. Please contact the library administration for submission guidelines and procedures.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Search Section */}
                            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-neutral-900">
                                <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                                    Advanced Search
                                </h2>
                                <div className="space-y-4">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <label htmlFor="adv-title" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                                            <BookOpen className="h-4 w-4 text-yellow-600" />
                                            Title
                                        </label>
                                        <input
                                            id="adv-title"
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Enter document title..."
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
                                        />
                                    </div>

                                    {/* Author */}
                                    <div className="space-y-2">
                                        <label htmlFor="adv-author" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                                            <Users className="h-4 w-4 text-yellow-600" />
                                            Author
                                        </label>
                                        <input
                                            id="adv-author"
                                            type="text"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            placeholder="Enter author name..."
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
                                        />
                                    </div>

                                    {/* Abstract */}
                                    <div className="space-y-2">
                                        <label htmlFor="adv-abstract" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                                            <FileText className="h-4 w-4 text-yellow-600" />
                                            Abstract / Keywords
                                        </label>
                                        <input
                                            id="adv-abstract"
                                            type="text"
                                            value={abstract}
                                            onChange={(e) => setAbstract(e.target.value)}
                                            placeholder="Enter keywords from abstract..."
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500"
                                        />
                                    </div>

                                    {/* Year Picker */}
                                    <div className="relative space-y-2" ref={yearPickerRef}>
                                        <label htmlFor="year" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-neutral-300">
                                            <Calendar className="h-4 w-4 text-yellow-600" />
                                            Publication Year
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setIsYearPickerOpen(!isYearPickerOpen)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left text-sm text-gray-900 transition-all hover:border-yellow-400 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                        >
                                            <span className={year ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-neutral-500'}>
                                                {year || 'Select year...'}
                                            </span>
                                        </button>

                                        {/* Year Picker Dropdown */}
                                        {isYearPickerOpen && (
                                            <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                                                {/* Year Navigation */}
                                                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800">
                                                    <button
                                                        type="button"
                                                        onClick={() => setDisplayYear(displayYear - 12)}
                                                        className="rounded p-1 text-gray-600 transition-colors hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </button>
                                                    <span className="text-xs font-bold text-gray-900 dark:text-neutral-100">
                                                        {Math.floor(displayYear / 12) * 12} - {Math.floor(displayYear / 12) * 12 + 11}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDisplayYear(displayYear + 12)}
                                                        className="rounded p-1 text-gray-600 transition-colors hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
                                                    >
                                                        <ChevronRight className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                
                                                {/* Year Grid */}
                                                <div className="grid grid-cols-3 gap-1.5 p-3">
                                                    {renderYearGrid()}
                                                </div>

                                                {/* Quick Actions */}
                                                <div className="border-t border-gray-200 bg-gray-50 p-2 dark:border-neutral-800 dark:bg-neutral-800">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setYear('');
                                                            setIsYearPickerOpen(false);
                                                        }}
                                                        className="w-full rounded py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
                                                    >
                                                        Clear Year
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Search Button */}
                                    <button
                                        onClick={handleSearch}
                                        type="button"
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                    >
                                        <Search className="h-4 w-4" />
                                        <span>Search Repository</span>
                                    </button>
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
                                            Welcome, <span className="font-semibold text-gray-900 dark:text-white">{auth.user.name}</span>
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
                            &copy; {currentYear} <span className="font-bold text-yellow-600">LPEM FEB UI</span> - Scientific Repository
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
