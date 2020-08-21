import { HtmlTag } from '../common-interfaces/html-tag.interface';
import { htmlTags } from '../dictionaries/html-tags';

/**
 * Building HTML tags
 */
export const html = (tag): HtmlTag =>
  htmlTags.reduce(
    (htmlData, tagName) => {
      Object.defineProperty(htmlData, tagName, {
        enumerable: true,
        get() {
          return tag(tagName);
        }
      });
      return htmlData;
    },
    {
      doctype: tag('doctype html')
    }
  );
