const API_BASE_URL = 'http://localhost:8000';

export interface PredictionRequest {
  timeframe: string;
}

export interface PredictionResponse {
  predicted_price: number;
  confidence: number;
  current_price: number;
  timeframe: string;
  status: string;
  message: string;
}

export class MLApiService {
  private static async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async getHealth(): Promise<{ status: string; models_loaded: boolean; available_timeframes: string[] }> {
    return this.makeRequest('/health');
  }

  static async predictPrice(timeframe: string): Promise<PredictionResponse> {
    return this.makeRequest('/predict', {
      method: 'POST',
      body: JSON.stringify({ timeframe }),
    });
  }

  static async predictPriceGet(timeframe: string): Promise<PredictionResponse> {
    return this.makeRequest(`/predict/${timeframe}`);
  }

  // Helper method to format timeframe for display
  static formatTimeframe(timeframe: string): string {
    const formatMap: Record<string, string> = {
      '1d': '1 day',
      '1w': '1 week', 
      '1m': '1 month',
      '3m': '3 months'
    };
    return formatMap[timeframe] || timeframe;
  }

  // Helper method to format price
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  // Helper method to format confidence as percentage
  static formatConfidence(confidence: number): string {
    return `${(confidence * 100).toFixed(1)}%`;
  }
}
