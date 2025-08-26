import React, { useState } from 'react';
import { huggingFaceAPI } from './utils/huggingfaceApi';
import { HuggingFaceModel, SearchFilters, Message } from './types/models';
import { HomePage } from './components/HomePage';
import { ResultsPage } from './components/ResultsPage';
import { Loader2, RefreshCw, Focus } from 'lucide-react';

function App() {
  const [view, setView] = useState<'home' | 'results'>('home');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<HuggingFaceModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (query: string, filters?: SearchFilters) => {
    setLoading(true);
    setError(null);

    const isFollowUp = view === 'results' && messages.length > 0;

    if (!isFollowUp) {
      // Initial search
      try {
        const response = await huggingFaceAPI.searchModels(query, filters || {});
        if (response.error) {
          setError(response.error);
          setResults([]);
        } else if (response.models.length === 0) {
          setError(`No models found for "${query}". Try broadening your search.`);
          setResults([]);
        } else {
          setResults(response.models);
          setSearchQuery(query);
          setSearchFilters(filters || null);
          setView('results');
        }
      } catch (e) {
        setError('An unexpected error occurred. Please try again.');
        setResults([]);
      }
    } else {
      // Follow-up question
      const newMessages: Message[] = [...messages, { role: 'user', content: query }];
      setMessages(newMessages);

      try {
        const response = await openRouterAPI.generateModelDescription(
          results,
          query,
          newMessages
        );
        setMessages([...newMessages, { role: 'assistant', content: response }]);
      } catch (e) {
        setError('An unexpected error occurred. Please try again.');
      }
    }

    setLoading(false);
  };

  const handleBackToHome = () => {
    setView('home');
    setResults([]);
    setSearchQuery('');
    setSearchFilters(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 flex items-center">
            <span><Focus className="w-5 h-5 mr-2" /> ModelLens</span>
          </h1>
          {view === 'results' && (
            <button
              onClick={handleBackToHome}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              <span>New Search</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 h-full">
        {loading ? (
          <div className="flex items-center justify-center h-full w-full absolute top-0 left-0 bg-white bg-opacity-75">
            <div className="flex items-center space-x-3 text-gray-600 p-6 bg-white rounded-lg shadow-lg">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-lg">Searching for models...</span>
            </div>
          </div>
        ) : view === 'home' ? (
          <HomePage onSearch={handleSendMessage} initialError={error} />
        ) : (
          <ResultsPage
            results={results}
            searchQuery={searchQuery}
            searchFilters={searchFilters}
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}

export default App;