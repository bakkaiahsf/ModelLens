import React, { useState } from 'react';
import { 
  Heart, 
  Download, 
  Clock, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Shield,
  Globe,
  Code
} from 'lucide-react';
import { HuggingFaceModel } from '../types/models';
import { AiModelSummary } from './AiModelSummary';

interface ModelCardProps {
  model: HuggingFaceModel;
  searchQuery: string;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, searchQuery }) => {
  const [showUsage, setShowUsage] = useState(false);

  const formatNumber = (num?: number): string => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTaskBadgeColor = (task?: string): string => {
    const colors: Record<string, string> = {
      'text-generation': 'bg-blue-100 text-blue-800',
      'text-to-image': 'bg-purple-100 text-purple-800',
      'text-classification': 'bg-green-100 text-green-800',
      'question-answering': 'bg-orange-100 text-orange-800',
      'summarization': 'bg-yellow-100 text-yellow-800',
      'translation': 'bg-indigo-100 text-indigo-800'
    };
    return colors[task || ''] || 'bg-gray-100 text-gray-800';
  };

  const getLicenseBadgeColor = (license?: string): string => {
    if (!license) return 'bg-gray-100 text-gray-800';
    if (license.toLowerCase().includes('mit')) return 'bg-green-100 text-green-800';
    if (license.toLowerCase().includes('apache')) return 'bg-blue-100 text-blue-800';
    if (license.toLowerCase().includes('cc')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const generateUsageSnippet = (): string => {
    const modelId = model.id;
    const task = model.pipeline_tag || 'text-generation';
    
    if (task === 'text-generation') {
      return `# Using transformers
from transformers import pipeline

generator = pipeline('text-generation', model='${modelId}')
result = generator("Hello, I'm a language model", max_length=50)
print(result)

# Using Hugging Face Inference API
import requests

API_URL = "https://api-inference.huggingface.co/models/${modelId}"
headers = {"Authorization": "Bearer YOUR_HF_TOKEN"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

output = query({"inputs": "Hello, I'm a language model"})`;
    }
    
    if (task === 'text-to-image') {
      return `# Using diffusers
from diffusers import StableDiffusionPipeline
import torch

pipe = StableDiffusionPipeline.from_pretrained("${modelId}", torch_dtype=torch.float16)
pipe = pipe.to("cuda")

prompt = "a beautiful landscape"
image = pipe(prompt).images[0]
image.save("output.png")

# Using Hugging Face Inference API
import requests

API_URL = "https://api-inference.huggingface.co/models/${modelId}"
headers = {"Authorization": "Bearer YOUR_HF_TOKEN"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content

image_bytes = query({"inputs": "a beautiful landscape"})`;
    }

    return `# Using transformers
from transformers import pipeline

classifier = pipeline('${task}', model='${modelId}')
result = classifier("Your input text here")
print(result)`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-600 truncate">
              {model.id.split('/')[0]}
            </p>
            <h3 className="text-lg font-semibold text-gray-900 truncate -mt-1">
              {model.id.split('/').pop()}
            </h3>
          </div>
          <a
            href={`https://huggingface.co/${model.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="View on Hugging Face"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {model.pipeline_tag && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskBadgeColor(model.pipeline_tag)}`}>
              {model.pipeline_tag.replace('-', ' ')}
            </span>
          )}
          
          {model.cardData?.license && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLicenseBadgeColor(model.cardData.license)}`}>
              <Shield className="w-3 h-3 inline mr-1" />
              {model.cardData.license.toUpperCase()}
            </span>
          )}

          {model.library_name && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <Code className="w-3 h-3 inline mr-1" />
              {model.library_name}
            </span>
          )}

          {model.cardData?.language && model.cardData.language.length > 0 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              <Globe className="w-3 h-3 inline mr-1" />
              {model.cardData.language[0]}
              {model.cardData.language.length > 1 && ` +${model.cardData.language.length - 1}`}
            </span>
          )}
        </div>

        {/* AI Summary */}
        <AiModelSummary model={model} searchQuery={searchQuery} />

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Download className="w-4 h-4 mr-1" />
              <span>{formatNumber(model.downloads)}</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              <span>{formatNumber(model.likes)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDate(model.lastModified)}</span>
            </div>
          </div>
        </div>

        {/* Show Usage Button */}
        <button
          onClick={() => setShowUsage(!showUsage)}
          className="w-full flex items-center justify-center py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium text-gray-700"
        >
          Show Usage
          {showUsage ? (
            <ChevronUp className="w-4 h-4 ml-1" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-1" />
          )}
        </button>

        {/* Usage Section */}
        {showUsage && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Usage Examples</h4>
            <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
              <pre className="text-sm text-gray-100 whitespace-pre-wrap">
                <code>{generateUsageSnippet()}</code>
              </pre>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <p>💡 Replace YOUR_HF_TOKEN with your Hugging Face token for API access</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
