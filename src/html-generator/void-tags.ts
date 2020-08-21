import { htmlVoidTags } from '../dictionaries/void-tags';

/**
 * Void tags lookup function
 */
const htmlVoidTagLookup = htmlVoidTags.reduce((lookup: { [key: string]: boolean }, tagName: string) => {
  lookup[tagName] = true;
  return lookup;
}, {});

/**
 * Checking void tags
 */
export const isHtmlVoidTag = (tagName: string): boolean => htmlVoidTagLookup[tagName] || false;
