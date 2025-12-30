/**
 * Custom error class for cross-product access issues
 * This is thrown when a user from another product (e.g., TrueTone) tries to access Newsletter
 * without proper Newsletter access
 */
export class CrossProductAccessError extends Error {
  constructor(
    message: string,
    public readonly sourceProduct: string,
    public readonly email?: string
  ) {
    super(message);
    this.name = 'CrossProductAccessError';
  }
}
