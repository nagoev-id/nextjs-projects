import DOMPurify from 'dompurify';

/**
 * Security utilities for input validation and sanitization
 */

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// URL validation regex
const URL_REGEX = /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/;

// Common XSS patterns to detect
const XSS_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /onload\s*=/gi,
  /onerror\s*=/gi,
  /onclick\s*=/gi,
  /onmouseover\s*=/gi,
];

// SQL injection patterns
const SQL_INJECTION_PATTERNS = [
  /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/gi,
  /['\\';|*%<>{}[\]()]/gi,
];

/**
 * Sanitize HTML content using DOMPurify
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side: basic sanitization
    return dirty
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '');
  }
  
  // Client-side: use DOMPurify
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Escape special characters for safe display
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return URL_REGEX.test(url.trim());
}

/**
 * Check for potential XSS attacks
 */
export function containsXSS(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return XSS_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Check for potential SQL injection
 */
export function containsSQLInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Sanitize user input for safe storage and display
 */
export function sanitizeInput(input: string, options: {
  maxLength?: number;
  allowHtml?: boolean;
  allowNewlines?: boolean;
} = {}): string {
  if (!input || typeof input !== 'string') return '';

  const { maxLength = 1000, allowHtml = false, allowNewlines = true } = options;

  let sanitized = input.trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Remove or escape HTML
  if (!allowHtml) {
    sanitized = escapeHtml(sanitized);
  } else {
    sanitized = sanitizeHtml(sanitized);
  }

  // Handle newlines
  if (!allowNewlines) {
    sanitized = sanitized.replace(/\r?\n|\r/g, ' ');
  }

  return sanitized;
}

/**
 * Validate and sanitize file uploads
 */
export function validateFile(file: File, options: {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
} = {}): { valid: boolean; error?: string; sanitizedName?: string } {
  const { 
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit` 
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type ${file.type} is not allowed` 
    };
  }

  // Check file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return { 
      valid: false, 
      error: `File extension ${extension} is not allowed` 
    };
  }

  // Sanitize filename
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100); // Limit filename length

  return { 
    valid: true, 
    sanitizedName 
  };
}

/**
 * Generate a secure random string
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomArray = new Uint8Array(length);
  
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomArray);
  } else if (typeof require !== 'undefined') {
    // Node.js environment
    const crypto = require('crypto');
    const buffer = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      randomArray[i] = buffer[i];
    }
  } else {
    // Fallback (less secure)
    for (let i = 0; i < length; i++) {
      randomArray[i] = Math.floor(Math.random() * 256);
    }
  }
  
  for (let i = 0; i < length; i++) {
    result += chars[randomArray[i] % chars.length];
  }
  
  return result;
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests
    const validRequests = userRequests.filter(time => time > windowStart);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(time => time > windowStart);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
} 