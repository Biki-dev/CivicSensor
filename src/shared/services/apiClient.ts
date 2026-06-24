export interface ApiResponse<T> {
  data: T;
  status: number;
  error?: string;
}

export interface ApiClient {
  get<T>(path: string, params?: Record<string, any>): Promise<ApiResponse<T>>;
  post<T>(path: string, body: any): Promise<ApiResponse<T>>;
  put<T>(path: string, body: any): Promise<ApiResponse<T>>;
  delete<T>(path: string): Promise<ApiResponse<T>>;
}

export class FetchApiClient implements ApiClient {
  constructor(private baseUrl: string) {}

  private async request<T>(path: string, init: RequestInit): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, init);
    const text = await response.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      data = text;
    }
    return {
      status: response.status,
      data,
      error: response.ok ? undefined : response.statusText,
    };
  }

  get<T>(path: string, params?: Record<string, any>) {
    const query = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';
    return this.request<T>(path + query, { method: 'GET' });
  }

  post<T>(path: string, body: any) {
    return this.request<T>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  put<T>(path: string, body: any) {
    return this.request<T>(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}
