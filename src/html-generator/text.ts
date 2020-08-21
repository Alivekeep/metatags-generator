/**
 * Checking value
 */
export const isTextLike = (arg): boolean =>
  typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'boolean' || arg instanceof Date;
