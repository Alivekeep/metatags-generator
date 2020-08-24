import { ParsedQuery } from '../common-interfaces/parsed-query.interface';
import { Element } from './element';
import { escapeHTML } from './escape-html';
import { html } from './html-tags';
import { parseQuery } from './parse-query';
import { isTextLike } from './text';
import { isHtmlVoidTag } from './void-tags';

/**
 * Query memoization
 */
const queryCache: Map<string, ParsedQuery> = new Map();

/**
 * Tag creator
 */
export const tag = (query: string) => {
  let cachedQuery: ParsedQuery | undefined;

  if (queryCache.has(query)) {
    cachedQuery = queryCache.get(query);
  } else {
    const parsedQuery = parseQuery(query);
    queryCache.set(query, parsedQuery);
    cachedQuery = queryCache.get(query);
  }

  return (...args): Element => {
    if (!cachedQuery) throw new Error(`Cached query doesn't exist`);

    const { tagName } = cachedQuery;
    let { id, className } = cachedQuery;
    const attributes: string[] = [];
    const content: string[] = [];

    args.forEach((arg) => {
      if (isTextLike(arg)) {
        content.push(escapeHTML(arg));
      } else if (typeof arg === 'object') {
        if (arg instanceof Element) {
          content.push(arg.toString());
        } else {
          for (const key in arg) {
            if (key === 'id' && arg.hasOwnProperty(key)) {
              id = arg[key];
            } else if (key === 'class') {
              if (className) {
                className += ' ';
              }
              className += escapeHTML(arg[key]);
            } else if (key === '$raw') {
              content.push(arg[key]);
            } else {
              attributes.push(` ${key}="${escapeHTML(arg[key])}"`);
            }
          }
        }
      }
    });

    if (id) {
      attributes.push(` id="${id}"`);
    }

    if (className) {
      attributes.push(` class="${className}"`);
    }

    if (tagName === 'doctype html') {
      return new Element(`<!DOCTYPE html>${content.join('')}`);
    }

    if (isHtmlVoidTag(tagName)) {
      return new Element(`<${tagName}${attributes.join('')}>`);
    } else {
      return new Element(`<${tagName}${attributes.join('')}>${content.join('')}</${tagName}>`);
    }
  };
};

/**
 * Dynamic tags
 */
export const tags = html(tag);
