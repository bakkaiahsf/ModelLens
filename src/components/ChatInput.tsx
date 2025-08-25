import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings, Zap } from 'lucide-react';
import { SearchFilters } from '../types/models';
import { huggingFaceAPI } from '../utils/huggingfaceApi';
import { openRouterAPI } from '../utils/openRouterApi';

interface ChatInputProps {
  onSendMessage: (message: string, filters: SearchFilters) => void;
  disabled?: boolean;
  remainingRequests: number;
}

const TASK_OPTIONS = [
  { value: 'auto-detect', label: 'Auto-Detect from Query', emoji: '🤖' },
  { value: 'text-generation', label: 'Text Generation', emoji: '📝' },
  { value: 'text-to-image', label: 'Image Generation', emoji: '🎨' },
  { value: 'text-classification', label: 'Text Classification', emoji: '🏷️' },
  { value: 'question-answering', label: 'Question Answering', emoji: '❓' },
  { value: 'summarization', label: 'Summarization', emoji: '📄' },
  { value: 'translation', label: 'Translation', emoji: '🌐' },
  { value: 'fill-mask', label: 'Fill Mask', emoji: '🔤' },
  { value: 'token-classification', label: 'Token Classification', emoji: '🔍' },
  { value: 'sentence-similarity', label: 'Sentence Similarity', emoji: '🔗' }
];

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  remainingRequests 
}) => {
  const [message, setMessage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    task: 'auto-detect',
    includeSpaces: false,
    includeDatasets: false,
    includeRestricted: false,
    sortBy: 'downloads'
  });
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hfApiStatus = huggingFaceAPI.getApiKeyStatus();
  const aiApiStatus = openRouterAPI.getApiStatus();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSendMessage(message.trim(), filters);
    setMessage('');
    setShowFilters(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const canSubmit = message.trim() && !disabled && remainingRequests > 0;

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        {showFilters && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Advanced Search Filters
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  AI Task Type
                </label>
                <select
                  value={filters.task}
                  onChange={(e) => setFilters(prev => ({ ...prev, task: e.target.value as SearchFilters['task'] }))}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {TASK_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.emoji} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Sort Models By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="downloads">📈 Downloads (Most Popular)</option>
                  <option value="likes">❤️ Likes (Community Favorite)</option>
                  <option value="lastModified">🔄 Last Updated (Newest)</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={filters.includeSpaces}
                  onChange={(e) => setFilters(prev => ({ ...prev, includeSpaces: e.target.checked }))}
                  className="mr-2 rounded"
                />
                <span className="flex items-center">
                  🚀 Include Spaces (Interactive demos and applications)
                </span>
              </label>
              
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={filters.includeDatasets}
                  onChange={(e) => setFilters(prev => ({ ...prev, includeDatasets: e.target.checked }))}
                  className="mr-2 rounded"
                />
                <span className="flex items-center">
                  📊 Include Datasets (Training data and benchmarks)
                </span>
              </label>
              
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={filters.includeRestricted}
                  onChange={(e) => setFilters(prev => ({ ...prev, includeRestricted: e.target.checked }))}
                  className="mr-2 rounded"
                />
                <span className="flex items-center">
                  ⚠️ Include Restricted/Non-commercial (Check license carefully)
                </span>
              </label>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for AI/ML models... (e.g. 'best text generation model for chatbot', 'stable diffusion for art creation', 'sentiment analysis classifier')"
              className="w-full p-3 pr-16 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              rows={1}
              disabled={disabled}
              maxLength={500}
            />
            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
              <span className="text-xs text-gray-400">
                {message.length}/500
              </span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-blue-50 border-blue-300 text-blue-600' 
                : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
            title="Advanced ML Search Filters"
            disabled={disabled}
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <button
            type="submit"
            disabled={!canSubmit}
            className={`p-3 rounded-lg transition-all ${
              canSubmit
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            title={
              remainingRequests === 0 ? 'Rate limit exceeded' :
              !message.trim() ? 'Enter search query' :
              'Search AI models'
            }
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        
        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Press Enter to search, Shift+Enter for new line</span>
            {aiApiStatus.configured && (
              <span className="inline-flex items-center text-blue-600 font-medium">
                <Zap className="w-3 h-3 mr-1" />
                AI-Enhanced Descriptions
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {hfApiStatus.configured && (
              <span className="text-green-600 font-medium">✓ HF API</span>
            )}
            {aiApiStatus.configured && (
              <span className="text-blue-600 font-medium">✓ AI Agent</span>
            )}
            <span className={remainingRequests <= 5 ? 'text-orange-600 font-medium' : ''}>
              Searches: {remainingRequests}/50
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
