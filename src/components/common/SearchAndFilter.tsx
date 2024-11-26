import React from 'react';
import { Search } from 'lucide-react';

interface SearchAndFilterProps {
    search: string;
    onSearchChange: (value: string) => void;
    labels: string[];
    selectedLabels: string[];
    onLabelToggle: (label: string) => void;
    searchPlaceholder?: string;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    search,
    onSearchChange,
    labels,
    selectedLabels,
    onLabelToggle,
    searchPlaceholder = "Search..."
}) => (
    <>
        <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 rounded-xl border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-morphic-primary focus:border-transparent transition-all"
            />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
            {labels.map(label => (
                <button
                    key={label}
                    onClick={() => onLabelToggle(label)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedLabels.includes(label)
                            ? 'bg-morphic-primary text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-morphic-primary/20'
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    </>
); 