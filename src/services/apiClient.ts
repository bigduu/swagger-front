/**
 * API Client for interacting with the backend server
 */

// OpenAI API types for requests/responses
interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface CompletionRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface CompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: OpenAIMessage;
    finish_reason: string;
  }[];
}

interface CodeExecutionRequest {
  code: string;
}

interface CodeExecutionResponse {
  result: string;
  error?: string;
}

// Default API configuration
const API_CONFIG = {
  baseURL: 'http://localhost:8000',
  defaultModel: 'gpt-3.5-turbo',
  defaultTemperature: 0.7,
  defaultMaxTokens: 2048,
};

/**
 * API Client for backend services
 */
export class ApiClient {
  private baseURL: string;
  
  constructor(baseURL = API_CONFIG.baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Makes a request to the completion endpoint
   * @param messages Array of messages in the OpenAI format
   * @param options Additional options for the completion request
   * @returns The completion response
   */
  async getCompletion(
    messages: OpenAIMessage[], 
    options: {
      model?: string,
      temperature?: number,
      max_tokens?: number,
      stream?: boolean
    } = {}
  ): Promise<CompletionResponse> {
    const requestBody: CompletionRequest = {
      model: options.model || API_CONFIG.defaultModel,
      messages,
      temperature: options.temperature || API_CONFIG.defaultTemperature,
      max_tokens: options.max_tokens || API_CONFIG.defaultMaxTokens,
      stream: options.stream || false,
    };

    try {
      const response = await fetch(`${this.baseURL}/completion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling completion API:', error);
      throw error;
    }
  }

  /**
   * Executes code on the backend
   * @param code Code to execute (should start with SCRIPT: keyword)
   * @returns The execution result
   */
  async executeCode(code: string): Promise<CodeExecutionResponse> {
    // Ensure the code starts with SCRIPT:
    const codeToExecute = code.startsWith('SCRIPT:') 
      ? code 
      : `SCRIPT:${code}`;

    try {
      const response = await fetch(`${this.baseURL}/code_execution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: codeToExecute }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error executing code:', error);
      throw error;
    }
  }

  /**
   * Helper to extract code blocks from markdown content
   * @param markdownContent Markdown content containing code blocks
   * @returns Array of code blocks
   */
  static extractCodeBlocks(markdownContent: string): string[] {
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
    const codeBlocks: string[] = [];
    
    let match;
    while ((match = codeBlockRegex.exec(markdownContent)) !== null) {
      codeBlocks.push(match[1].trim());
    }
    
    return codeBlocks;
  }

  /**
   * Extracts and executes the first code block from markdown content
   * @param markdownContent Markdown content containing code blocks
   * @returns The execution result or null if no code blocks found
   */
  async executeCodeFromMarkdown(markdownContent: string): Promise<CodeExecutionResponse | null> {
    const codeBlocks = ApiClient.extractCodeBlocks(markdownContent);
    
    if (codeBlocks.length === 0) {
      return null;
    }
    
    return this.executeCode(codeBlocks[0]);
  }
}

// Export a default instance for convenience
export default new ApiClient(); 