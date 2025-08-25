import React from 'react';
import { Search, Zap, Image, MessageSquare, Languages, FileText, HelpCircle, Tag, BarChart3 } from 'lucide-react';

interface QuickSearchBarProps {
  onQuickSearch: (query: string, task: string) => void;
}

const QUICK_SEARCH_OPTIONS = [
  {
    id: 'text-generation',
    label: 'Text Generation',
    icon: MessageSquare,
    description: 'AI models for text completion, chatbots, and content generation',
    examples: ['GPT models', 'Conversational AI', 'Code generation'],
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 'text-to-image',
    label: 'Image Generation',
    icon: Image,
    description: 'Create images from text descriptions using AI',
    examples: ['Stable Diffusion', 'DALL-E style', 'Art generation'],
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: 'text-classification',
    label: 'Text Classification',
    icon: Tag,
    description: 'Classify text into categories, sentiment analysis',
    examples: ['Sentiment analysis', 'Spam detection', 'Topic classification'],
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 'question-answering',
    label: 'Question Answering',
    icon: HelpCircle,
    description: 'Extract answers from documents and contexts',
    examples: ['Document Q&A', 'Reading comprehension', 'FAQ bots'],
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    id: 'summarization',
    label: 'Text Summarization',
    icon: FileText,
    description: 'Summarize long documents and articles',
    examples: ['Article summarization', 'Meeting notes', 'Research papers'],
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    iconColor: 'text-yellow-600'
  },
  {
    id: 'translation',
    label: 'Translation',
    icon: Languages,
    description: 'Translate text between different languages',
    examples: ['Language translation', 'Multilingual support', 'Localization'],
    color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
    iconColor: 'text-indigo-600'
  }
];

export const QuickSearchBar: React.FC<QuickSearchBarProps> = ({ onQuickSearch }) => {
  const handleQuickSearch = (option: typeof QUICK_SEARCH_OPTIONS[0]) => {
    const query = `${option.label.toLowerCase()} model for ${option.examples[0].toLowerCase()}`;
    onQuickSearch(query, option.id);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Search className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Quick Model Search</h2>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        Choose a model type to instantly find the best AI models for your specific use case
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_SEARCH_OPTIONS.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => handleQuickSearch(option)}
              className={`p-4 border rounded-lg transition-all duration-200 text-left ${option.color}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 ${option.iconColor}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-1">{option.label}</h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{option.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {option.examples.slice(0, 2).map((example, idx) => (
                      <span key={idx} className="inline-block px-2 py-1 bg-white bg-opacity-60 rounded text-xs text-gray-700">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Zap className="w-4 h-4" />
          <span>Click any category for instant, curated results</span>
        </div>
      </div>
    </div>
  );
};
