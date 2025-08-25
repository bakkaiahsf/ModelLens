import React from 'react';
import { Search, Sparkles, Clock, Shield, Zap, MessageSquare } from 'lucide-react';
import { QuickSearchBar } from './QuickSearchBar';

interface EmptyStateProps {
  remainingRequests: number;
  onQuickSearch: (query: string, task: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ remainingRequests, onQuickSearch }) => {
  const features = [
    {
      icon: Sparkles,
      title: 'Smart Search',
      description: 'AI-powered task inference from your queries.',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: MessageSquare,
      title: 'Conversational AI',
      description: 'Ask follow-up questions about your results.',
      color: 'text-teal-600 bg-teal-50'
    },
    {
      icon: Shield,
      title: 'Commercial Safe',
      description: 'Filters out non-commercial and NSFW content.',
      color: 'text-green-600 bg-green-50'
    },
    {
      icon: Clock,
      title: 'Fast Results',
      description: 'Cached responses for popular queries.',
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI Model Explorer Assistant
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Your intelligent gateway to Hugging Face. Search for models, get AI-powered summaries, and ask follow-up questions to find the perfect model for your project in seconds.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className={`${feature.color} rounded-lg p-4`}>
                  <IconComponent className="w-6 h-6 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Search Bar */}
        <QuickSearchBar onQuickSearch={onQuickSearch} />

        {/* Additional Info */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-800 font-medium">
              You have <span className="font-bold">{remainingRequests}</span> enhanced searches remaining today
            </span>
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            Or use the search bar below to describe what you're looking for in natural language
          </p>
        </div>
      </div>
    </div>
  );
};
