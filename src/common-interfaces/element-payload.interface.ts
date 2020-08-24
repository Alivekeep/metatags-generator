import { Element } from '../html-generator/element';

/**
 * Dynamic element payload
 */
export class ElementPayload {
  /**
   * Abstract key-value
   */
  [key: string]: string | Element | object;
}
