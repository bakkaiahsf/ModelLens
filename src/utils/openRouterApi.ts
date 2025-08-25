import axios from 'axios';
import { HuggingFaceModel } from '../types/models';

const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';
const PLACEHOLDER_KEYS = ['YOUR_API_KEY', 'API_KEY_ADDED'];

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class OpenRouterAPI {
  private apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  private isKeyConfigured(): boolean {
    return !!this.apiKey && !PLACEHOLDER_KEYS.includes(this.apiKey);
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'HuggingFace Model Search Assistant'
    };
  }

  async generateModelDescription(modelData: HuggingFaceModel, searchQuery: string): Promise<string> {
    if (!this.isKeyConfigured()) {
      return this.getFallbackDescription(modelData);
    }

    const systemPrompt = `You are an expert Machine Learning Model Agent. Your role is to analyze provided Hugging Face model data and a user's search query. Based on this, provide a concise, 2-3 sentence expert description. Focus strictly on the model's technical capabilities, performance metrics (like downloads and likes), and its most ideal use cases relevant to the user's query. Be technical but accessible. Do not invent information not present in the provided data.`;

    const userPrompt = `Analyze this model based on the data below:\n\nMODEL INFO:\n- ID: ${modelData.id}\n- Task: ${modelData.pipeline_tag || 'Unknown'}\n- Downloads: ${modelData.downloads || 0}\n- Likes: ${modelData.likes || 0}\n- Library: ${modelData.library_name || 'transformers'}\n- License: ${modelData.cardData?.license || 'N/A'}\n\nUSER SEARCH: "${searchQuery}"\n\nProvide your expert analysis based only on the information given.`;

    try {
      const response = await axios.post<OpenRouterResponse>(
        `${OPENROUTER_API_BASE}/chat/completions`,
        {
          model: 'anthropic/claude-3.5-sonnet',
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
          max_tokens: 300,
          temperature: 0.3
        },
        { headers: this.getHeaders(), timeout: 10000 }
      );
      return response.data.choices[0]?.message?.content || this.getFallbackDescription(modelData);
    } catch (error) {
      console.error('OpenRouter API error:', error);
      return this.getFallbackDescription(modelData);
    }
  }

  private getFallbackDescription(modelData: HuggingFaceModel): string {
    const task = modelData.pipeline_tag || 'general';
    const modelName = modelData.id.split('/').pop() || modelData.id;
    return `${modelName} is a specialized AI model for ${task.replace('-', ' ')} applications, offering reliable performance with community-validated results for your machine learning projects.`;
  }

  getApiStatus(): { configured: boolean } {
    return { configured: this.isKeyConfigured() };
  }

  async getConversationalResponse(question: string, history: any[], models: HuggingFaceModel[]): Promise<string> {
    if (!this.isKeyConfigured()) {
      return "I can't answer follow-up questions without an API key configured for the AI assistant.";
    }

    const systemPrompt = `You are a highly specialized AI assistant for exploring Hugging Face models. Your ONLY function is to answer questions based on the provided list of models and conversation history. Do not answer any questions that are not directly related to these models. If the user asks an off-topic question, politely decline by saying 'I can only answer questions about the provided model search results.'

Here is the list of models the user is looking at:
${models.map(m => `- ${m.id} (Task: ${m.pipeline_tag}, Downloads: ${m.downloads})`).join('\n')}

Here is the recent conversation history:
${history.map(h => `${h.type}: ${h.content}`).join('\n')}

Based strictly on the provided context, answer the user's latest question.`;

    const userPrompt = `User's question: "${question}"`;

    try {
      const response = await axios.post<OpenRouterResponse>(
        `${OPENROUTER_API_BASE}/chat/completions`,
        {
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 400,
          temperature: 0.5
        },
        { headers: this.getHeaders(), timeout: 15000 }
      );
      return response.data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error('OpenRouter conversational error:', error);
      return "I'm having trouble connecting to my AI brain right now. Please try again in a moment.";
    }
  }
}

export const openRouterAPI = new OpenRouterAPI();
