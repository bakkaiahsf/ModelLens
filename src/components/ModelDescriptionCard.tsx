import React, { useState, useEffect } from 'react';
import { HuggingFaceModel } from '../types/models';
import { openRouterAPI } from '../utils/openRouterApi';
import { 
  Brain, 
  Cpu, 
  Database, 
  Gauge, 
  Users, 
  Calendar,
  BookOpen,
  Sparkles,
  Zap,
  Loader2
} from 'lucide-react';

interface ModelDescriptionCardProps {
  model: HuggingFaceModel;
  searchQuery: string;
}

export const ModelDescriptionCard: React.FC<ModelDescriptionCardProps> = ({ model, searchQuery }) => {
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateDescription = async () => {
      setLoading(true);
      try {
        const description = await openRouterAPI.generateModelDescription(model, searchQuery);
        setAiDescription(description);
      } catch (error) {
        console.error('Failed to generate AI description:', error);
        setAiDescription(getFallbackDescription());
      } finally {
        setLoading(false);
      }
    };

    generateDescription();
  }, [model.id, searchQuery]);

  const getFallbackDescription = (): string => {
    const task = model.pipeline_tag || 'general';
    const modelName = model.id.split('/').pop() || model.id;
    
    const descriptions: Record<string, string> = {
      'text-generation': `${modelName} is a state-of-the-art language model optimized for natural text generation, conversation, and content creation. With ${formatNumber(model.downloads || 0)} downloads, it demonstrates proven reliability for production applications requiring human-like text output.`,
      
      'text-to-image': `${modelName} is an advanced diffusion model that generates high-quality images from textual descriptions. This model excels in creative visual generation and has earned ${model.likes || 0} community endorsements for its artistic capabilities and prompt adherence.`,
      
      'text-classification': `${modelName} is a robust neural classifier designed for accurate text categorization, sentiment analysis, and content filtering. Its proven architecture delivers consistent performance across diverse classification tasks with enterprise-grade reliability.`,
      
      'question-answering': `${modelName} is a sophisticated reading comprehension model that extracts precise answers from contextual documents. With strong community validation, it excels in knowledge extraction, document Q&A, and information retrieval applications.`,
      
      'summarization': `${modelName} is an intelligent text summarization model that condenses complex documents while preserving critical information. Its balanced approach to content reduction makes it valuable for research, news analysis, and document processing workflows.`,
      
      'translation': `${modelName} is a multilingual neural translation model supporting high-quality cross-language communication. This model demonstrates excellent semantic preservation and cultural context awareness across diverse language pairs.`
    };

    return descriptions[task] || `${modelName} is a specialized AI model engineered for ${task.replace('-', ' ')} applications, offering reliable performance with community-validated results for advanced machine learning workflows.`;
  };

  const getPerformanceMetrics = (model: HuggingFaceModel) => {
    const downloads = model.downloads || 0;
    const likes = model.likes || 0;
    
    let popularity = 'Emerging';
    let popularityColor = 'text-gray-600';
    
    if (downloads > 5000000) {
      popularity = 'Industry Standard';
      popularityColor = 'text-purple-600';
    } else if (downloads > 1000000) {
      popularity = 'Very Popular';
      popularityColor = 'text-green-600';
    } else if (downloads > 100000) {
      popularity = 'Popular';
      popularityColor = 'text-blue-600';
    } else if (downloads > 10000) {
      popularity = 'Growing';
      popularityColor = 'text-yellow-600';
    }
    
    let communityRating = 'Good';
    let ratingColor = 'text-gray-600';
    
    if (likes > 2000) {
      communityRating = 'Exceptional';
      ratingColor = 'text-purple-600';
    } else if (likes > 1000) {
      communityRating = 'Excellent';
      ratingColor = 'text-green-600';
    } else if (likes > 500) {
      communityRating = 'Very Good';
      ratingColor = 'text-blue-600';
    } else if (likes > 100) {
      communityRating = 'Good';
      ratingColor = 'text-yellow-600';
    }
    
    return { popularity, popularityColor, communityRating, ratingColor };
  };

  const getUseCases = (task: string): string[] => {
    const useCases: Record<string, string[]> = {
      'text-generation': ['🤖 Conversational AI & Chatbots', '✍️ Content Creation & Copywriting', '💻 Code Generation & Programming', '📚 Educational Content & Tutoring'],
      'text-to-image': ['🎨 Digital Art & Creative Design', '📱 Marketing & Social Media Content', '🏗️ Product Visualization & Mockups', '🎮 Game Assets & Concept Art'],
      'text-classification': ['📊 Sentiment Analysis & Opinion Mining', '🛡️ Content Moderation & Safety', '📧 Email Filtering & Organization', '📈 Business Intelligence & Analytics'],
      'question-answering': ['🔍 Knowledge Base & FAQ Systems', '📚 Educational Q&A Platforms', '🏢 Enterprise Document Search', '⚖️ Legal & Compliance Research'],
      'summarization': ['📰 News & Article Summarization', '📋 Meeting Notes & Reports', '🔬 Research Paper Analysis', '📊 Business Document Processing'],
      'translation': ['🌐 Website & App Localization', '📄 Document Translation Services', '💬 Real-time Communication', '🏢 International Business Support']
    };
    
    return useCases[task] || ['🔧 General AI Processing', '⚙️ Automated Analysis', '📊 Data Processing', '💡 Content Enhancement'];
  };

  const metrics = getPerformanceMetrics(model);
  const useCases = getUseCases(model.pipeline_tag || '');

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-lg">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-md">
            <Brain className="w-7 h-7 text-blue-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-bold text-gray-900">{model.id}</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                {model.pipeline_tag?.replace('-', ' ') || 'AI Model'}
              </span>
              {openRouterAPI.getApiStatus().configured && (
                <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs font-medium rounded-full">
                  <Zap className="w-3 h-3 mr-1" />
                  AI Enhanced
                </span>
              )}
            </div>
          </div>
          
          {/* AI-Generated Description */}
          <div className="bg-white bg-opacity-70 rounded-lg p-4 mb-4 border border-white shadow-sm">
            {loading ? (
              <div className="flex items-center space-x-2 text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Model Agent analyzing capabilities...</span>
              </div>
            ) : (
              <p className="text-gray-800 leading-relaxed font-medium">
                {aiDescription || getFallbackDescription()}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Performance Metrics */}
            <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-white shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Gauge className="w-4 h-4 mr-2 text-green-600" />
                Performance
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-sm font-semibold ${metrics.popularityColor}`}>
                    {metrics.popularity}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Community:</span>
                  <span className={`text-sm font-semibold ${metrics.ratingColor}`}>
                    {metrics.communityRating}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Downloads:</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatNumber(model.downloads || 0)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Technical Specs */}
            <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-white shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Cpu className="w-4 h-4 mr-2 text-purple-600" />
                Technical
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Framework:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {model.library_name || 'transformers'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">License:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {model.cardData?.license || 'Check model'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Updated:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {model.lastModified ? new Date(model.lastModified).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-white shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2 text-orange-600" />
                Community
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Likes:</span>
                  <span className="text-sm font-bold text-red-600">
                    ❤️ {formatNumber(model.likes || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Author:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {model.id.split('/')[0] || 'Community'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {model.private ? '🔒 Private' : '🌐 Public'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Use Cases */}
          <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-white shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-600" />
              Optimal Use Cases & Applications
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {useCases.map((useCase, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                  <span className="text-sm text-gray-700 font-medium">{useCase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
