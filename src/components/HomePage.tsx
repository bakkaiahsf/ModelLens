import React, { useState } from 'react';
import { Search, Settings, AlertCircle } from 'lucide-react';
import { SearchFilters } from '../types/models';

interface HomePageProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  initialError: string | null;
}

const TASK_OPTIONS = [
  { value: 'text-generation', label: 'Text Generation' },
  { value: 'text-to-image', label: 'Image Generation' },
  { value: 'text-classification', label: 'Text Classification' },
  { value: 'question-answering', label: 'Question Answering' },
  { value: 'summarization', label: 'Summarization' },
  { value: 'translation', label: 'Translation' },
  { value: 'fill-mask', label: 'Fill Mask' },
  { value: 'token-classification', label: 'Token Classification' },
  { value: 'sentence-similarity', label: 'Sentence Similarity' }
];

export const HomePage: React.FC<HomePageProps> = ({ onSearch, initialError }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    task: 'text-classification',
    includeSpaces: false,
    includeDatasets: false,
    includeRestricted: false,
    sortBy: 'downloads'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch('', filters);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            ModelLens
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Seeing models clearly.
          </p>
        </div>

        <div className="mb-6">
           <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Settings className="w-6 h-6 mr-3 text-blue-600" />
              Model Search Filters
            </h2>
            
        </div>
        
        {initialError && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{initialError}</span>
          </div>
        )}

        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="task-type" className="block text-sm font-medium text-gray-700 mb-2">
                  AI Task Type
                </label>
                <select
                  id="task-type"
                  value={filters.task}
                  onChange={(e) => setFilters(prev => ({ ...prev, task: e.target.value as SearchFilters['task'] }))}
                  className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
                >
                  {TASK_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Models By
                </label>
                <select
                  id="sort-by"
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
                >
                  <option value="downloads">Downloads (Most Popular)</option>
                  <option value="likes">Likes (Community Favorite)</option>
                  <option value="lastModified">Last Updated (Newest)</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.includeSpaces}
                  onChange={(e) => setFilters(prev => ({ ...prev, includeSpaces: e.target.checked }))}
                  className="h-5 w-5 mr-3 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include Spaces</span>
              </label>
              
              <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.includeDatasets}
                  onChange={(e) => setFilters(prev => ({ ...prev, includeDatasets: e.target.checked }))}
                  className="h-5 w-5 mr-3 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include Datasets</span>
              </label>
              
              <label className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.includeRestricted}
                  onChange={(e) => setFilters(prev => ({ ...prev, includeRestricted: e.target.checked }))}
                  className="h-5 w-5 mr-3 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include Restricted</span>
              </label>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-lg shadow-md hover:shadow-lg"
                >
                    <Search className="w-6 h-6" />
                    Search Models
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};
