import crypto from 'crypto';

/**
 * Generates a unique download token.
 */
export function generateDownloadToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Calculates the expiry date (48 hours from now).
 */
export function getTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 48);
  return expiry;
}

/**
 * Validates that a token is not expired.
 */
export function isTokenExpired(expiry: Date): boolean {
  return new Date() > expiry;
}

/**
 * Creates a download URL for a given token.
 */
export function createDownloadUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/api/download/${token}`;
}
