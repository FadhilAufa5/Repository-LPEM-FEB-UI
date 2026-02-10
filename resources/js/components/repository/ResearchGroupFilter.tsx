import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface GrupKajianOption {
    value: string;
    label: string;
    description: string;
}

interface ResearchGroupFilterProps {
    selectedGrupKajian: string;
    onGrupKajianChange: (value: string) => void;
    grupKajianCounts?: Record<string, number>;
    totalCount: number;
    currentFilter?: string;
}

export const grupKajianOptions: GrupKajianOption[] = [
    { value: 'bc_glove', label: 'BC-GLOVE', description: 'Business, Commerce & Global Learning and Opportunities for Value Enhancement' },
    { value: 'nres', label: 'NRES', description: 'Natural Resources and Environmental Studies' },
    { value: 'gec_rg', label: 'GEC-RG', description: 'Green Economy & Climate Research Group' },
    { value: 'dtbs', label: 'DTBS', description: 'Development, Trade & Business Strategy' },
    { value: 'mfpe', label: 'MFPE', description: 'Monetary & Financial Policy Economics' },
    { value: 'spl', label: 'SPL', description: 'Social Policy & Labor' },
    { value: 'sece', label: 'SECE', description: 'Socio-Economic and Cultural Economics' },
    { value: 'devpfin', label: 'DEVPFIN', description: 'Development & Public Finance Innovation' },
    { value: 'mpower', label: 'MPOWER', description: 'Micro-finance, Poverty & Well-being Research' },
    { value: 'trust', label: 'TRUST', description: 'Trade, Resource Use, Sustainability & Technology' },
];

export function ResearchGroupFilter({
    selectedGrupKajian,
    onGrupKajianChange,
    grupKajianCounts = {},
    totalCount,
    currentFilter,
}: ResearchGroupFilterProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const getGroupCount = (groupValue: string): number => {
        return grupKajianCounts[groupValue] || 0;
    };

    return (
        <div className="space-y-3">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 hover:text-yellow-600 transition-colors dark:text-white dark:hover:text-yellow-400"
            >
                <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-yellow-600" />
                    Research Group
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
                {/* All Groups Option */}
                <label className="flex items-center gap-2.5 cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-all hover:border-yellow-400 hover:bg-yellow-50 has-[:checked]:border-yellow-500 has-[:checked]:bg-yellow-50 has-[:checked]:ring-2 has-[:checked]:ring-yellow-500/20 dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-yellow-600 dark:hover:bg-yellow-900/20 dark:has-[:checked]:border-yellow-500 dark:has-[:checked]:bg-yellow-900/30">
                    <input
                        type="radio"
                        name="grup_kajian"
                        value=""
                        checked={selectedGrupKajian === ''}
                        onChange={(e) => onGrupKajianChange(e.target.value)}
                        className="h-4 w-4 text-yellow-600 focus:ring-2 focus:ring-yellow-500 border-gray-300 dark:border-neutral-600"
                    />
                    <span className="flex-1 font-medium text-gray-700 dark:text-neutral-200">
                        All Groups
                    </span>
                    <span 
                        className="inline-flex items-center justify-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 transition-all duration-200 dark:bg-neutral-700 dark:text-neutral-300"
                        title={`${totalCount} total repositor${totalCount > 1 ? 'ies' : 'y'}`}
                    >
                        {totalCount}
                    </span>
                </label>

                {/* Individual Group Options */}
                <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-neutral-600 dark:scrollbar-track-neutral-800">
                    {grupKajianOptions.map((option) => {
                        const count = getGroupCount(option.value);
                        return (
                            <div key={option.value} className="group relative">
                                <label className="flex items-center gap-2.5 cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-2 text-sm transition-all hover:border-yellow-400 hover:bg-yellow-50 has-[:checked]:border-yellow-500 has-[:checked]:bg-yellow-50 has-[:checked]:ring-2 has-[:checked]:ring-yellow-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-yellow-600 dark:hover:bg-yellow-900/20 dark:has-[:checked]:border-yellow-500 dark:has-[:checked]:bg-yellow-900/30">
                                    <input
                                        type="radio"
                                        name="grup_kajian"
                                        value={option.value}
                                        checked={selectedGrupKajian === option.value}
                                        onChange={(e) => onGrupKajianChange(e.target.value)}
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
