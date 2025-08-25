export interface HuggingFaceModel {
  id: string;
  modelId?: string;
  author?: string;
  sha?: string;
  pipeline_tag?: string;
  tags?: string[];
  downloads?: number;
  library_name?: string;
  likes?: number;
  createdAt?: string;
  lastModified?: string;
  private?: boolean;
  gated?: boolean;
  disabled?: boolean;
  config?: {
    model_type?: string;
    architectures?: string[];
  };
  cardData?: {
    license?: string;
    language?: string[];
    datasets?: string[];
  };
}

export interface SearchFilters {
  task: string | 'auto-detect';
  includeSpaces: boolean;
  includeDatasets: boolean;
  includeRestricted: boolean;
  sortBy: 'downloads' | 'likes' | 'lastModified';
  language?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'results';
  content: string;
  timestamp: Date;
  results?: HuggingFaceModel[];
  filters?: SearchFilters;
  originalQuery?: string;
}

export interface ApiResponse {
  models: HuggingFaceModel[];
  error?: string;
}
