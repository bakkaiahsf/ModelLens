import React from 'react';
import { HuggingFaceModel, SearchFilters } from '../types/models';
import { ModelCard } from './ModelCard';
import { SideChat } from './SideChat';

interface ResultsPageProps {
  results: HuggingFaceModel[];
  searchQuery: string;
  searchFilters: SearchFilters | null;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ results, searchQuery, searchFilters }) => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Search Results for "{searchQuery}"
        </h1>
        <p className="text-md text-gray-600 mt-2">
          Showing top {results.length} models. Task: <span className="font-semibold capitalize">{searchFilters?.task?.replace('-', ' ') || 'N/A'}</span>, Sorted by: <span className="font-semibold capitalize">{searchFilters?.sortBy || 'N/A'}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Model Results */}
        <div className="lg:col-span-2 space-y-4">
          {results.map(model => (
            <ModelCard key={model.id} model={model} searchQuery={searchQuery} />
          ))}
        </div>

        {/* Right Column: Side Chat */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
             <SideChat searchQuery={searchQuery} models={results} />
          </div>
        </div>
      </div>
    </div>
  );
};