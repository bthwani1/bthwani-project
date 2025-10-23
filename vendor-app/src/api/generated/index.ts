// Vendor Mobile App API Client
// Generated from OpenAPI spec: openapi.yaml
// Generation Date: 2025-10-23T16:00:16.285Z
// Do not edit manually - regenerate using: npm run generate:sdks

export * from './apis';
export * from './models';

// Enhanced API client with interceptors
export class vendorappApiClient {
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
