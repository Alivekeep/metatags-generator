import { ParsedQuery } from '../common-interfaces/parsed-query.interface';

/**
 * Parse query
 */
export const parseQuery = (query: string): ParsedQuery => {
  const chunks: string[] = query.split(/([#.])/);
  let tagName = '';
  let id = '';
  const classNames: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (chunk === '#') {
      id = chunks[++i];
    } else if (chunk === '.') {
      classNames.push(chunks[++i]);
    } else if (chunk.length) {
      tagName = chunk;
    }
  }

  return {
    tagName: tagName || 'div',
    id,
    className: classNames.join(' ')
  };
};
