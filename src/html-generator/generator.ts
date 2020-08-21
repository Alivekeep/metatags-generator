import { ElementPayload } from '../common-interfaces/element-payload.interface';
import { Element } from './element';
import { tags } from './tag';

/**
 * HTML generator
 */
export class HtmlGenerator {
  /**
   * Generating JSONLD script
   */
  public generateJSONLD(document: object, options: object): string {
    return tags.script(new Element(JSON.stringify(document)), { type: 'application/ld+json' }, options).toString();
  }

  /**
   * Creates an instance of the element for the specified tag
   */
  public generateElement(tag: string, attributes: object, content?: object | string): string {
    if (!tags[tag]) throw new Error(`Can't found HTML tag`);

    const payload: ElementPayload = {
      attributes
    };

    if (content) {
      payload.content = new Element(typeof content === 'object' ? JSON.stringify(content) : content);
    }

    return tags[tag](...Object.values(payload)).toString();
  }
}
