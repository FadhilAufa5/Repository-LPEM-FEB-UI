import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Search, Calendar, ArrowRight, ChevronLeft, ChevronRight, Sparkles, BookOpen, Users, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/navbar';

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
        console.log('Filters:', { title, author, abstract, year });
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
                            ? 'bg-primary text-white shadow-md scale-105' 
                            : isCurrent
                            ? 'bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30'
                            : 'hover:bg-neutral-100 text-neutral-700 dark:hover:bg-neutral-800 dark:text-neutral-300'
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
            <Head title="Repository Search">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
            </Head>

            {/* <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-neutral-950 dark:via-blue-950 dark:to-purple-950"> */}
                {/* Background decorative elements */}
                {/* <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-primary/20 to-purple-400/20 blur-3xl"></div>
                    <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-primary/20 blur-3xl"></div>
                </div> */}

                {/* Navbar */}
                <Navbar
                    isAuthenticated={!!auth.user}
                    loginUrl={login().url}
                    registerUrl={register().url}
                    dashboardUrl={dashboard().url}
                    canRegister={canRegister}
                />

                {/* Main Content */}
                <main className="relative mx-auto max-w-4xl px-6 py-8 md:py-12">
                    {/* Hero Section */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-semibold text-neutral-700 backdrop-blur-sm dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                            <Sparkles className="size-3.5" />
                            <span>Pencarian Repository yang Powerful</span>
                        </div>
                        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-4xl">
                            Temukan
                            <span className="text-neutral-700 dark:text-neutral-300"> Repository</span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-sm text-neutral-600 dark:text-neutral-300">
                            Cari repository berdasarkan judul, penulis, dan tahun dengan mudah. Akses koleksi LPEM FEB UI Repository dalam hitungan detik.
                        </p>
                    </div>

                    {/* Search Card */}
                    <div className="group rounded-2xl border border-neutral-200/60 bg-white/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-neutral-200 dark:border-neutral-800/50 dark:bg-neutral-900/80">
                        <div className="mb-4 flex items-center gap-2.5">
                            <div className="rounded-lg bg-neutral-700 p-2 shadow-md dark:bg-neutral-600">
                                <Search className="size-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                                    Pencarian Koleksi
                                </h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    LPEM FEB UI Repository
                                </p>
                            </div>
                        </div>
                        <form onSubmit={handleSearch} className="space-y-4">
                            {/* Title */}
                            <div className="space-y-1.5">
                                <label htmlFor="title" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                    <BookOpen className="size-3.5 text-primary" />
                                    Judul
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Masukkan judul repository..."
                                    className="w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-100 dark:placeholder-neutral-500"
                                />
                            </div>

                            {/* Author */}
                            <div className="space-y-1.5">
                                <label htmlFor="author" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                    <Users className="size-3.5 text-primary" />
                                    Penulis
                                </label>
                                <input
                                    id="author"
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="Masukkan nama penulis..."
                                    className="w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-100 dark:placeholder-neutral-500"
                                />
                            </div>

                            {/* Abstract */}
                            <div className="space-y-1.5">
                                <label htmlFor="abstract" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                    <Search className="size-3.5 text-primary" />
                                    Abstrak
                                </label>
                                <input
                                    id="abstract"
                                    type="text"
                                    value={abstract}
                                    onChange={(e) => setAbstract(e.target.value)}
                                    placeholder="Masukkan kata kunci dari abstrak..."
                                    className="w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-sm text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-100 dark:placeholder-neutral-500"
                                />
                            </div>

                            {/* Year Picker */}
                            <div className="relative space-y-1.5" ref={yearPickerRef}>
                                <label htmlFor="year" className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                    <Calendar className="size-3.5 text-primary" />
                                    Tahun
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsYearPickerOpen(!isYearPickerOpen)}
                                    className="w-full rounded-lg border border-neutral-200 bg-white py-2 px-3 text-left text-sm text-neutral-900 transition-all duration-200 hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-100"
                                >
                                    <span className={year ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-500'}>
                                        {year || 'Pilih tahun...'}
                                    </span>
                                </button>

                                {/* Year Picker Dropdown */}
                                {isYearPickerOpen && (
                                    <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                                        {/* Year Navigation */}
                                        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800">
                                            <button
                                                type="button"
                                                onClick={() => setDisplayYear(displayYear - 12)}
                                                className="rounded p-1 text-neutral-600 transition-colors hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
                                            >
                                                <ChevronLeft className="size-4" />
                                            </button>
                                            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                                {Math.floor(displayYear / 12) * 12} - {Math.floor(displayYear / 12) * 12 + 11}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setDisplayYear(displayYear + 12)}
                                                className="rounded p-1 text-neutral-600 transition-colors hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
                                            >
                                                <ChevronRight className="size-4" />
                                            </button>
                                        </div>
                                        
                                        {/* Year Grid */}
                                        <div className="grid grid-cols-3 gap-1.5 p-3">
                                            {renderYearGrid()}
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="border-t border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-800">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setYear('');
                                                    setIsYearPickerOpen(false);
                                                }}
                                                className="w-full rounded py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
                                            >
                                                Reset Tahun
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Search Button */}
                            <button
                                type="submit"
                                className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-neutral-900 px-6 py-2.5 font-bold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-neutral-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                            >
                                <Search className="relative size-4" />
                                <span className="relative text-sm">Cari Repository</span>
                                <ArrowRight className="relative size-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </form>

                        {/* Info */}
                        <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-800/50">
                            <div className="flex items-start gap-2">
                                <div className="rounded bg-primary/10 p-1.5 dark:bg-primary/20">
                                    <Clock className="size-3.5 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                        {(() => {
                                            const activeFilters = [
                                                title && `Judul: "${title}"`,
                                                author && `Penulis: "${author}"`,
                                                abstract && `Abstrak: "${abstract}"`,
                                                year && `Tahun: ${year}`
                                            ].filter(Boolean);
                                            
                                            return activeFilters.length > 0 
                                                ? `Filter aktif: ${activeFilters.join(', ')}`
                                                : 'Gunakan filter di atas untuk mencari koleksi repository';
                                        })()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        <div className="group relative overflow-hidden rounded-xl border border-neutral-200/60 bg-gradient-to-br from-white to-neutral-50 p-5 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 dark:border-neutral-800/50 dark:from-neutral-900 dark:to-neutral-950">
                            <div className="absolute -right-6 -top-6 size-16 rounded-full bg-primary/10 blur-xl transition-all group-hover:bg-primary/20"></div>
                            <div className="relative">
                                <div className="mb-2 flex justify-center">
                                    <div className="rounded-full bg-gradient-to-br from-primary to-purple-500 p-2">
                                        <BookOpen className="size-4 text-white" />
                                    </div>
                                </div>
                                <div className="mb-1 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-2xl font-extrabold text-transparent">100+</div>
                                <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Repository Tersedia</div>
                            </div>
                        </div>
                        <div className="group relative overflow-hidden rounded-xl border border-neutral-200/60 bg-gradient-to-br from-white to-neutral-50 p-5 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 dark:border-neutral-800/50 dark:from-neutral-900 dark:to-neutral-950">
                            <div className="absolute -right-6 -top-6 size-16 rounded-full bg-purple-500/10 blur-xl transition-all group-hover:bg-purple-500/20"></div>
                            <div className="relative">
                                <div className="mb-2 flex justify-center">
                                    <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-2">
                                        <Calendar className="size-4 text-white" />
                                    </div>
                                </div>
                                <div className="mb-1 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-2xl font-extrabold text-transparent">{currentYear - 2010}+</div>
                                <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Tahun Data</div>
                            </div>
                        </div>
                        <div className="group relative overflow-hidden rounded-xl border border-neutral-200/60 bg-gradient-to-br from-white to-neutral-50 p-5 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/10 dark:border-neutral-800/50 dark:from-neutral-900 dark:to-neutral-950">
                            <div className="absolute -right-6 -top-6 size-16 rounded-full bg-pink-500/10 blur-xl transition-all group-hover:bg-pink-500/20"></div>
                            <div className="relative">
                                <div className="mb-2 flex justify-center">
                                    <div className="rounded-full bg-gradient-to-br from-pink-500 to-primary p-2">
                                        <Clock className="size-4 text-white" />
                                    </div>
                                </div>
                                <div className="mb-1 bg-gradient-to-r from-pink-500 to-primary bg-clip-text text-2xl font-extrabold text-transparent">24/7</div>
                                <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Selalu Tersedia</div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative border-t border-neutral-200/60 bg-gradient-to-b from-white to-neutral-50 py-6 backdrop-blur-xl dark:border-neutral-800/50 dark:from-neutral-900 dark:to-neutral-950">
                    <div className="mx-auto max-w-7xl px-6 text-center">
                        <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                            &copy; {currentYear} <span className="font-bold text-primary">detooseto</span>
                        </p>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                            LPEM FEB UI Repository - Pencarian Repository yang Powerful
                        </p>
                    </div>
                </footer>
            {/* </div> */}
        </>
    );
}
