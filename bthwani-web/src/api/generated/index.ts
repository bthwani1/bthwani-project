// Main Web App API Client
// Generated from OpenAPI spec: openapi.yaml
// Generation Date: 2025-10-25T20:38:42.706Z
// Do not edit manually - regenerate using: npm run generate:sdks

export * from './apis';
export * from './models';

// Enhanced API client with interceptors
export class bthwaniwebApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.REACT_APP_API_URL || "http://localhost:3000";
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
}
