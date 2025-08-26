import axios from 'axios';
import { HuggingFaceModel, SearchFilters, ApiResponse } from '../types/models';

// Point to the Node.js backend endpoint
const HF_API_BASE = '/api/huggingface-models'; // For Vercel deployment

class HuggingFaceAPI {
  private cache = new Map<string, { data: HuggingFaceModel[]; timestamp: number; }>(); // Simplified cache entry

  private getCacheKey(query: string, filters: SearchFilters): string {
    return `${query}_${JSON.stringify(filters)}`;
  }

  private isValidCache(entry: { data: HuggingFaceModel[]; timestamp: number; }): boolean {
    return Date.now() - entry.timestamp < 10 * 60 * 1000; 
  }

  async searchModels(query: string, filters?: Partial<SearchFilters>): Promise<ApiResponse> {
    try {
      const searchFilters: SearchFilters = {
        task: filters?.task || 'text-generation',
        includeSpaces: filters?.includeSpaces ?? false,
        includeDatasets: filters?.includeDatasets ?? false,
        includeRestricted: filters?.includeRestricted ?? false,
        sortBy: filters?.sortBy || 'downloads',
        language: filters?.language
      };

      const cacheKey = this.getCacheKey(query, searchFilters);
      const cached = this.cache.get(cacheKey);

      if (cached && this.isValidCache(cached)) {
        return { models: cached.data };
      }

      const params: any = {
        task: searchFilters.task,
        sortBy: searchFilters.sortBy,
        includeSpaces: searchFilters.includeSpaces,
        includeDatasets: searchFilters.includeDatasets,
        includeRestricted: searchFilters.includeRestricted,
        query: query || undefined 
      };

      const response = await axios.get(HF_API_BASE, {
        params,
        timeout: 15000
      });

      let models: HuggingFaceModel[] = response.data || [];

      if (!searchFilters.includeRestricted) {
        models = models.filter(model => {
          const tags = model.tags || [];
          const isNSFW = tags.some(tag => 
            tag.toLowerCase().includes('nsfw') || 
            tag.toLowerCase().includes('adult') ||
            tag.toLowerCase().includes('sexual')
          );
          
          const license = model.cardData?.license?.toLowerCase() || '';
          const isNonCommercial = license.includes('nc') ||
                                 license.includes('non-commercial') ||
                                 tags.some(tag => tag.toLowerCase().includes('non-commercial'));
          
          const isGated = model.gated || model.private;
          
          return !isNSFW && !isNonCommercial && !isGated;
        });
      }

      models.sort((a, b) => {
        if (searchFilters.sortBy === 'downloads') {
          if ((b.downloads || 0) !== (a.downloads || 0)) return (b.downloads || 0) - (a.downloads || 0);
        } else if (searchFilters.sortBy === 'likes') {
          if ((b.likes || 0) !== (a.likes || 0)) return (b.likes || 0) - (a.likes || 0);
        } else if (searchFilters.sortBy === 'lastModified') {
          if ((new Date(b.lastModified || 0).getTime()) !== (new Date(a.lastModified || 0).getTime())) return (new Date(b.lastModified || 0).getTime()) - (new Date(a.lastModified || 0).getTime());
        }
        return (new Date(b.lastModified || 0).getTime()) - (new Date(a.lastModified || 0).getTime());
      });

      this.cache.set(cacheKey, {
        data: models,
        timestamp: Date.now()
      });

      return { models };

    } catch (error) {
      console.error('HuggingFace API proxy error:', error);
      return {
        models: [],
        error: 'Could not fetch models. Please try again later.'
      };
    }
  }
}

export const huggingFaceAPI = new HuggingFaceAPI();
