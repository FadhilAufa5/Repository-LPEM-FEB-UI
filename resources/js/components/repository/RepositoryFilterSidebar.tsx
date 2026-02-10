import { Filter, Search } from 'lucide-react';
import { ResearchGroupFilter } from './ResearchGroupFilter';
import { ReportTypeFilter } from './ReportTypeFilter';
import { AdditionalFilters } from './AdditionalFilters';

interface Filters {
    title?: string;
    author?: string;
    abstract?: string;
    year?: string;
    grup_kajian?: string;
    jenis_laporan?: string;
}

interface RepositoryFilterSidebarProps {
    filters: Filters;
    selectedGrupKajian: string;
    selectedReportType: string;
    searchInputs: {
        title: string;
        author: string;
        abstract: string;
        year: string;
    };
    onGrupKajianChange: (value: string) => void;
    onReportTypeChange: (value: string) => void;
    onInputChange: (field: keyof RepositoryFilterSidebarProps['searchInputs'], value: string) => void;
    onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
    onClearFilters: () => void;
    isSearching: boolean;
    grupKajianCounts?: Record<string, number>;
    reportTypeCounts?: Record<string, number>;
    totalCount: number;
}

export function RepositoryFilterSidebar({
    filters,
    selectedGrupKajian,
    selectedReportType,
    searchInputs,
    onGrupKajianChange,
    onReportTypeChange,
    onInputChange,
    onSearch,
    onClearFilters,
    isSearching,
    grupKajianCounts = {},
    reportTypeCounts = {},
    totalCount,
}: RepositoryFilterSidebarProps) {
    const hasActiveFilters = Object.values(filters).some((v) => v);

    return (
        <div className="sticky top-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
                    <Filter className="h-4 w-4" />
                    Filter Search
                </h2>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-xs font-medium text-yellow-600 hover:text-yellow-700"
                    >
                        Reset
                    </button>
                )}
            </div>

            <form onSubmit={onSearch} className="space-y-5">
                {/* Research Group Filter */}
                <ResearchGroupFilter
                    selectedGrupKajian={selectedGrupKajian}
                    onGrupKajianChange={onGrupKajianChange}
                    grupKajianCounts={grupKajianCounts}
                    totalCount={totalCount}
                    currentFilter={filters.grup_kajian}
                />

                {/* Report Type Filter */}
                <ReportTypeFilter
                    selectedReportType={selectedReportType}
                    onReportTypeChange={onReportTypeChange}
                    reportTypeCounts={reportTypeCounts}
                    totalCount={totalCount}
                    currentFilter={filters.jenis_laporan}
                />

                {/* Additional Filters */}
                <AdditionalFilters
                    filters={filters}
                    searchInputs={searchInputs}
                    onInputChange={onInputChange}
                />

                {/* Submit Button */}
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
    );
}
