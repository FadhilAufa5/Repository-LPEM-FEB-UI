import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useState } from 'react';

interface ReportTypeOption {
    value: string;
    label: string;
    description: string;
}

interface ReportTypeFilterProps {
    selectedReportType: string;
    onReportTypeChange: (value: string) => void;
    reportTypeCounts?: Record<string, number>;
    totalCount: number;
    currentFilter?: string;
}

export const reportTypeOptions: ReportTypeOption[] = [
    { 
        value: 'penelitian_survey', 
        label: 'Penelitian + Survey', 
        description: 'Comprehensive research with survey data collection' 
    },
    { 
        value: 'penelitian', 
        label: 'Penelitian', 
        description: 'Academic research and studies' 
    },
    { 
        value: 'diklat', 
        label: 'Diklat', 
        description: 'Training and education materials' 
    },
    { 
        value: 'jurnal', 
        label: 'Jurnal', 
        description: 'Journal publications and articles' 
    },
    { 
        value: 'buku', 
        label: 'Buku', 
        description: 'Books and monographs' 
    },
    { 
        value: 'lainnya', 
        label: 'Lainnya', 
        description: 'Other types of reports' 
    },
];

export function ReportTypeFilter({
    selectedReportType,
    onReportTypeChange,
    reportTypeCounts = {},
    totalCount,
    currentFilter,
}: ReportTypeFilterProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const getReportTypeCount = (reportTypeValue: string): number => {
        return reportTypeCounts[reportTypeValue] || 0;
    };

    return (
        <div className="space-y-3">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 hover:text-yellow-600 transition-colors dark:text-white dark:hover:text-yellow-400"
            >
                <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-yellow-600" />
                    Report Type
                    {currentFilter && (
                        <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white">
                            1
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
                className={`grid grid-cols-1 gap-2 transition-all duration-300 ease-in-out overflow-hidden ${
                    isExpanded
                        ? 'max-h-[500px] opacity-100'
                        : 'max-h-0 opacity-0'
                }`}
            >
                {/* All Report Types Option */}
                <label className="flex items-center gap-2.5 cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-all hover:border-yellow-400 hover:bg-yellow-50 has-[:checked]:border-yellow-500 has-[:checked]:bg-yellow-50 has-[:checked]:ring-2 has-[:checked]:ring-yellow-500/20 dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-yellow-600 dark:hover:bg-yellow-900/20 dark:has-[:checked]:border-yellow-500 dark:has-[:checked]:bg-yellow-900/30">
                    <input
                        type="radio"
                        name="report_type"
                        value=""
                        checked={selectedReportType === ''}
                        onChange={(e) => onReportTypeChange(e.target.value)}
                        className="h-4 w-4 text-yellow-600 focus:ring-2 focus:ring-yellow-500 border-gray-300 dark:border-neutral-600"
                    />
                    <span className="flex-1 font-medium text-gray-700 dark:text-neutral-200">
                        All Report Types
                    </span>
                    <span 
                        className="inline-flex items-center justify-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 transition-all duration-200 dark:bg-neutral-700 dark:text-neutral-300"
                        title={`${totalCount} total report${totalCount > 1 ? 's' : ''}`}
                    >
                        {totalCount}
                    </span>
                </label>

                {/* Individual Report Type Options */}
                <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-neutral-600 dark:scrollbar-track-neutral-800">
                    {reportTypeOptions.map((option) => {
                        const count = getReportTypeCount(option.value);
                        return (
                            <div key={option.value} className="group relative">
                                <label className="flex items-center gap-2.5 cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-2 text-sm transition-all hover:border-yellow-400 hover:bg-yellow-50 has-[:checked]:border-yellow-500 has-[:checked]:bg-yellow-50 has-[:checked]:ring-2 has-[:checked]:ring-yellow-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-yellow-600 dark:hover:bg-yellow-900/20 dark:has-[:checked]:border-yellow-500 dark:has-[:checked]:bg-yellow-900/30">
                                    <input
                                        type="radio"
                                        name="report_type"
                                        value={option.value}
                                        checked={selectedReportType === option.value}
                                        onChange={(e) => onReportTypeChange(e.target.value)}
                                        className="h-4 w-4 text-yellow-600 focus:ring-2 focus:ring-yellow-500 border-gray-300 dark:border-neutral-600"
                                    />
                                    <span className="flex-1 font-medium text-gray-700 dark:text-neutral-200">
                                        {option.label}
                                    </span>
                                    {count > 0 && (
                                        <span 
                                            className="inline-flex items-center justify-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800 transition-all duration-200 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            title={`${count} report${count > 1 ? 's' : ''} available`}
                                        >
                                            {count}
                                        </span>
                                    )}
                                </label>
                                
                                {/* Tooltip */}
                                <div className="absolute left-0 bottom-full mb-2 w-48 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 dark:bg-neutral-800 dark:border dark:border-neutral-700 z-50 shadow-lg">
                                    <p className="font-semibold mb-1">{option.label}</p>
                                    <p className="text-gray-300">{option.description}</p>
                                    <div className="absolute left-1/3 top-full h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900 dark:bg-neutral-800"></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
