/**
 * Kinde Management API Service
 *
 * This service provides methods to interact with the Kinde Management API
 * for multi-product access control using user properties.
 *
 * Required environment variables:
 * - KINDE_M2M_CLIENT_ID: M2M application client ID
 * - KINDE_M2M_CLIENT_SECRET: M2M application client secret
 * - KINDE_ISSUER_URL: Your Kinde domain (e.g., https://auth.truetone.ai)
 */

interface KindeTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface KindeUser {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_suspended?: boolean;
  created_on?: string;
}

class KindeApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'KindeApiError';
  }
}

class KindeManagementService {
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private baseUrl: string;
  private managementApiBaseUrl: string;
  private managementApiAudience: string;

  constructor() {
    const issuerUrl = process.env.KINDE_ISSUER_URL;
    if (!issuerUrl) {
      console.warn('[Kinde] KINDE_ISSUER_URL not configured');
      this.baseUrl = '';
      this.managementApiBaseUrl = '';
      this.managementApiAudience = '';
    } else {
      // Remove trailing slash if present
      this.baseUrl = issuerUrl.replace(/\/$/, '');

      // Management API uses the Kinde-native domain, not custom domains
      // e.g., https://truetoneai.kinde.com instead of https://auth.truetone.ai
      // The audience and API calls must use the same native domain
      this.managementApiAudience = process.env.KINDE_MANAGEMENT_API_AUDIENCE || `${this.baseUrl}/api`;

      // Derive the Management API base URL from the audience
      // If audience is "https://truetoneai.kinde.com/api", base URL is "https://truetoneai.kinde.com"
      this.managementApiBaseUrl = this.managementApiAudience.replace(/\/api$/, '');
    }
  }

  /**
   * Get M2M access token for API calls
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid (with 60s buffer)
    if (this.accessToken && Date.now() < this.tokenExpiresAt - 60000) {
      return this.accessToken;
    }

    const clientId = process.env.KINDE_M2M_CLIENT_ID;
    const clientSecret = process.env.KINDE_M2M_CLIENT_SECRET;

    if (!clientId || !clientSecret || !this.baseUrl) {
      throw new Error(
        'Kinde M2M credentials not configured. Required: KINDE_M2M_CLIENT_ID, KINDE_M2M_CLIENT_SECRET, KINDE_ISSUER_URL'
      );
    }

    const tokenUrl = `${this.baseUrl}/oauth2/token`;

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        audience: this.managementApiAudience,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Kinde] Failed to get M2M token:', errorText);
      throw new Error(`Failed to get Kinde M2M token: ${response.status}`);
    }

    const data: KindeTokenResponse = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + data.expires_in * 1000;

    return this.accessToken;
  }

  /**
   * Make an authenticated request to the Kinde Management API
   * Uses the native Kinde domain (not custom domain) for API calls
   */
  private async makeApiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAccessToken();
    // Use managementApiBaseUrl (native domain) for API calls, not baseUrl (custom domain)
    const url = `${this.managementApiBaseUrl}/api/v1${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store',
        ...options.headers,
      },
      cache: 'no-store', // Ensure no caching of API responses
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Kinde] API request failed: ${endpoint}`, errorText);
      throw new KindeApiError(`Kinde API request failed: ${response.status}`, response.status);
    }

    return response.json();
  }

  // ============================================================================
  // USER RETRIEVAL
  // ============================================================================

  /**
   * Get a user by their Kinde ID
   * @returns The user if found, null if not found (404), throws for other errors
   */
  async getUser(userId: string): Promise<KindeUser | null> {
    try {
      const result = await this.makeApiRequest<KindeUser>(`/user?id=${userId}`);
      return result;
    } catch (error) {
      // Only return null for 404 (user not found)
      if (error instanceof KindeApiError && error.status === 404) {
        console.log(`[Kinde] User not found: ${userId}`);
        return null;
      }
      // Rethrow all other errors so callers can handle API failures
      console.error('[Kinde] Error getting user:', error);
      throw error;
    }
  }

  // ============================================================================
  // USER PROPERTIES - For multi-product access control
  // ============================================================================

  /**
   * Get all properties for a user
   */
  async getUserProperties(userId: string): Promise<Record<string, unknown>> {
    try {
      console.log(`[Kinde] Fetching properties for user ${userId} from ${this.managementApiBaseUrl}`);

      // Kinde API can return properties as an array of {key, value} objects
      // or as an object with property keys
      const result = await this.makeApiRequest<{
        properties: Array<{ key: string; value: unknown }> | Record<string, { value: unknown }>;
      }>(`/users/${userId}/properties`);

      console.log(`[Kinde] Raw API response for user ${userId}:`, JSON.stringify(result, null, 2));

      const properties: Record<string, unknown> = {};
      if (result.properties) {
        // Handle array format: [{ key: "prop_name", value: "prop_value" }, ...]
        if (Array.isArray(result.properties)) {
          for (const prop of result.properties) {
            if (prop && typeof prop === 'object' && 'key' in prop) {
              properties[prop.key] = prop.value;
            }
          }
        } else {
          // Handle object format: { prop_name: { value: "prop_value" }, ... }
          for (const [key, prop] of Object.entries(result.properties)) {
            if (prop && typeof prop === 'object' && 'value' in prop) {
              properties[key] = prop.value;
            }
          }
        }
      }
      console.log(`[Kinde] Parsed user ${userId} properties:`, properties);
      return properties;
    } catch (error) {
      console.error('[Kinde] Error getting user properties:', error);
      return {};
    }
  }

  /**
   * Get a specific property for a user
   */
  async getUserProperty(
    userId: string,
    propertyKey: string
  ): Promise<unknown> {
    try {
      const properties = await this.getUserProperties(userId);
      return properties[propertyKey];
    } catch (error) {
      console.error(`[Kinde] Error getting user property ${propertyKey}:`, error);
      return undefined;
    }
  }

  /**
   * Set a property for a user
   */
  async setUserProperty(
    userId: string,
    propertyKey: string,
    value: unknown
  ): Promise<boolean> {
    try {
      console.log(`[Kinde] Setting property ${propertyKey}=${value} for user ${userId}`);
      await this.makeApiRequest(`/users/${userId}/properties/${propertyKey}`, {
        method: 'PUT',
        body: JSON.stringify({ value }),
      });
      console.log(`[Kinde] Property ${propertyKey} set successfully`);
      return true;
    } catch (error) {
      console.error(`[Kinde] Error setting user property ${propertyKey}:`, error);
      return false;
    }
  }

  // ============================================================================
  // PRODUCT ACCESS HELPERS
  // ============================================================================

  /**
   * Check if a user has access to a specific product
   * @param userId Kinde user ID
   * @param product Product name ('truetone' or 'newsletter')
   * @returns true if user has access, false otherwise
   */
  async checkProductAccess(
    userId: string,
    product: 'truetone' | 'newsletter'
  ): Promise<boolean> {
    const propertyKey =
      product === 'truetone' ? 'has_truetone_access' : 'has_newsletter_access';
    const value = await this.getUserProperty(userId, propertyKey);
    const hasAccess = value === true || value === 'true';
    console.log(`[Kinde] checkProductAccess(${userId}, ${product}): property=${propertyKey}, value=${JSON.stringify(value)}, hasAccess=${hasAccess}`);
    return hasAccess;
  }

  /**
   * Grant product access to a user
   * @param userId Kinde user ID
   * @param product Product name ('truetone' or 'newsletter')
   * @returns true if successful, false otherwise
   */
  async grantProductAccess(
    userId: string,
    product: 'truetone' | 'newsletter'
  ): Promise<boolean> {
    const propertyKey =
      product === 'truetone' ? 'has_truetone_access' : 'has_newsletter_access';
    return await this.setUserProperty(userId, propertyKey, true);
  }

  /**
   * Revoke product access from a user
   * @param userId Kinde user ID
   * @param product Product name ('truetone' or 'newsletter')
   * @returns true if successful, false otherwise
   */
  async revokeProductAccess(
    userId: string,
    product: 'truetone' | 'newsletter'
  ): Promise<boolean> {
    const propertyKey =
      product === 'truetone' ? 'has_truetone_access' : 'has_newsletter_access';
    return await this.setUserProperty(userId, propertyKey, false);
  }
}

// Export singleton instance
export const kindeManagementService = new KindeManagementService();
