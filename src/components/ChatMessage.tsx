import React, { useState } from 'react';
import { Bot, User, AlertCircle, CheckCircle, Sparkles, Zap } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types/models';
import { ModelCard } from './ModelCard';
import { ModelDescriptionCard } from './ModelDescriptionCard';
import { openRouterAPI } from '../utils/openRouterApi';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [showAiAnalysis, setShowAiAnalysis] = useState(false);
  const isUser = message.type === 'user';
  const isResults = message.type === 'results';
  const aiApiStatus = openRouterAPI.getApiStatus();

  if (isResults && message.results) {
    return (
      <div className="mb-8">
        {/* Assistant Response Header */}
        <div className="flex items-start space-x-3 mb-6">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  AI Model Search Results
                </span>
                <span className="text-xs text-blue-600">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-blue-800 mb-3">{message.content}</p>
              
              {/* Search Summary */}
              <div className="bg-blue-100 rounded-lg p-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-900">{message.results.length}</div>
                    <div className="text-xs text-blue-700">Models Found</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-blue-900">
                      {message.filters?.task?.replace('-', ' ') || 'Mixed'}
                    </div>
                    <div className="text-xs text-blue-700">Task Type</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-blue-900">
                      {message.filters?.sortBy === 'downloads' ? 'Popular' : 
                       message.filters?.sortBy === 'likes' ? 'Liked' : 'Recent'}
                    </div>
                    <div className="text-xs text-blue-700">Sorted By</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-blue-900">
                      {message.filters?.includeRestricted ? 'All' : 'Commercial'}
                    </div>
                    <div className="text-xs text-blue-700">License Filter</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Cards Grid */}
        <div className="ml-11">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span>Top 5 Results</span>
            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
              {message.results.length} models
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {message.results.map((model, index) => (
              <ModelCard key={`${model.id}-${index}`} model={model} searchQuery={message.originalQuery || ''} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-3 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-gray-200' : 'bg-blue-100'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-gray-600" />
          ) : (
            <Bot className="w-5 h-5 text-blue-600" />
          )}
        </div>
        
        <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
          <div className={`rounded-lg p-3 ${
            isUser 
              ? 'bg-gray-100 text-gray-900' 
              : message.content.includes('error') || message.content.includes('Error')
                ? 'bg-red-50 text-red-900'
                : 'bg-blue-50 text-blue-900'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">
                {isUser ? 'You' : 'Assistant'}
              </span>
              <span className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            
            <div className="flex items-start space-x-2">
              {!isUser && (message.content.includes('error') || message.content.includes('Error')) && (
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              {!isUser && message.content.includes('popular alternatives') && (
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              )}
              
              <div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {isUser && message.filters && (
                  <div className="mt-2 text-xs text-gray-500">
                    <span>Filters: {message.filters.task.replace('-', ' ')}</span>
                    {message.filters.sortBy !== 'downloads' && (
                      <span> • Sort: {message.filters.sortBy}</span>
                    )}
                    {message.filters.includeRestricted && <span> • Including restricted</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
