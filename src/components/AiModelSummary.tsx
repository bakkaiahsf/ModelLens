import React, { useState, useEffect } from 'react';
import { HuggingFaceModel } from '../types/models';
import { openRouterAPI } from '../utils/openRouterApi';
import { Loader2, Sparkles } from 'lucide-react';

interface AiModelSummaryProps {
  model: HuggingFaceModel;
  searchQuery: string;
}

export const AiModelSummary: React.FC<AiModelSummaryProps> = ({ model, searchQuery }) => {
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateDescription = async () => {
      if (!openRouterAPI.getApiStatus().configured) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const description = await openRouterAPI.generateModelDescription(model, searchQuery);
        setAiDescription(description);
      } catch (error) {
        console.error('Failed to generate AI description:', error);
        setAiDescription('Could not load AI summary.');
      } finally {
        setLoading(false);
      }
    };

    generateDescription();
  }, [model.id, searchQuery]);

  if (!openRouterAPI.getApiStatus().configured) {
    return null; // Don't render anything if API key is not set
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
        <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
        AI-Powered Summary
      </h4>
      {loading ? (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Analyzing...</span>
        </div>
      ) : (
        <p className="text-sm text-gray-600 leading-relaxed">
          {aiDescription}
        </p>
      )}
    </div>
  );
};
