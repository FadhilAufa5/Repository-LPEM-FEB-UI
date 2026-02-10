import { BookOpen, Calendar, ChevronDown, ChevronUp, FileText, Filter, Users } from 'lucide-react';
import { useState } from 'react';

interface Filters {
    title?: string;
    author?: string;
    abstract?: string;
    year?: string;
    grup_kajian?: string;
    jenis_laporan?: string;
}

interface SearchInputs {
    title: string;
    author: string;
    abstract: string;
    year: string;
}

interface AdditionalFiltersProps {
    filters: Filters;
    searchInputs: SearchInputs;
    onInputChange: (field: keyof SearchInputs, value: string) => void;
}

export function AdditionalFilters({
    filters,
    searchInputs,
    onInputChange,
}: AdditionalFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const currentYear = new Date().getFullYear();

    const activeFilterCount = [
        filters.title,
        filters.author,
        filters.abstract,
        filters.year,
    ].filter(Boolean).length;

    return (
        <div className="space-y-3">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 hover:text-yellow-600 transition-colors dark:text-white dark:hover:text-yellow-400"
            >
                <span className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-yellow-600" />
                    Additional Filters
                    {activeFilterCount > 0 && (
                        <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white">
                            {activeFilterCount}
                        </span>
                    )}
                </span>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                )}
            </button>

            <div
                className={`space-y-4 transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded
                        ? 'max-h-[800px] opacity-100'
                        : 'max-h-0 opacity-0'
                }`}
            >
                {/* Title Filter */}
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
                        onChange={(e) => onInputChange('title', e.target.value)}
                        placeholder="e.g. Economic Development..."
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-neutral-500">
                        Search for words in document titles
                    </p>
                </div>

                {/* Author Filter */}
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
                        onChange={(e) => onInputChange('author', e.target.value)}
                        placeholder="e.g. John Doe..."
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-neutral-500">
                        Search by lead researcher or staff members
                    </p>
                </div>

                {/* Keywords Filter */}
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
                        onChange={(e) => onInputChange('abstract', e.target.value)}
                        placeholder="e.g. poverty analysis..."
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-neutral-500">
                        Search in abstract, title, and document code
                    </p>
                </div>

                {/* Year Filter */}
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
                        onChange={(e) => onInputChange('year', e.target.value)}
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
    );
}
