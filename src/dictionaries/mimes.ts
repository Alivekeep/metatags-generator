/**
 * Abstract types
 */
interface ExtensionTypes {
  /**
   * Abstract string type
   */
  [key: string]: string;
}

/**
 * Image mime types
 */
export const mimeTypesByExtension: ExtensionTypes = {
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  ico: 'image/x-icon',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp'
};
