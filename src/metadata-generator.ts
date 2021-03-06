import { AddParams } from './common-interfaces/add-params.interface';
import { BreadcrumbData } from './common-interfaces/breadcrumb-data.interface';
import { ImageInput } from './common-interfaces/image-input.interface';
import { MetatagsDocument } from './common-interfaces/metatags-document.interface';
import { OpengraphTypes } from './common-interfaces/opengraph-types.interface';
import { PageMeta } from './common-interfaces/page-meta.interface';
import { ProjectMeta } from './common-interfaces/project-meta.interface';
import { SafariMobileApp } from './common-interfaces/safari-mobile-app.interface';
import { Settings } from './common-interfaces/settings.interface';
import { TwitterMeta } from './common-interfaces/twitter-meta.interface';
import { defaultSettings } from './dictionaries/default-settings';
import { headTags } from './dictionaries/head-tags';
import {
  androidChromeIconSizes,
  appleTouchIconSizes,
  microsoftTileIconSizes,
  microsoftTilesNamingMap
} from './dictionaries/icons';
import { reImageSizeFromStr } from './dictionaries/image-size-reg-exp';
import { mimeTypesByExtension } from './dictionaries/mimes';
import { HtmlGenerator } from './html-generator/generator';

/**
 * Metadata generator implementation
 */
export class MetadataGenerator {
  /**
   * Data for rendering, contains HTML
   */
  public document: MetatagsDocument;
  /**
   * User settings
   * @private
   */
  private settings: Settings;

  /**
   * Default settings
   * @private
   */
  private readonly defaultSettings: Settings = defaultSettings;

  /**
   * Instance of utility
   * @private
   */
  private readonly htmlGenerator: HtmlGenerator;

  /**
   * List of raw meta tags (head)
   * @private
   */
  private readonly elementsOfHead: Map<string, string>;

  /**
   * List of raw meta tags (body)
   * @private
   */
  private readonly elementsOfBody: Map<string, string>;

  constructor() {
    this.htmlGenerator = new HtmlGenerator();

    this.configure();

    this.document = {
      body: '',
      head: ''
    };

    this.elementsOfHead = new Map();
    this.elementsOfBody = new Map();

    this.disableMicrosoftAppConfig();
  }

  /**
   * Disable Microsoft app config
   */
  public disableMicrosoftAppConfig(): MetadataGenerator {
    this.add('meta', { name: 'msapplication-config', content: 'none' });

    return this;
  }

  /**
   * Set robots
   */
  public setRobots(content: string): MetadataGenerator {
    this.add('meta', { name: 'robots', content });

    return this;
  }

  /**
   * Set short link
   */
  public setShortLink(url: string): MetadataGenerator {
    this.add('link', { rel: 'shortlink', href: url, type: 'text/html' });

    return this;
  }

  /**
   * Set canonical page URL
   */
  public setCanonical(url: string): MetadataGenerator {
    this.add('link', { rel: 'canonical', href: url });

    return this;
  }

  /**
   * Set local version
   */
  public setLocalVersion(locale: string, url: string, isActiveLocale: boolean = false): MetadataGenerator {
    this.add('link', { rel: 'alternate', href: url, hreflang: locale });

    if (this.settings.openGraphTags) {
      const suffix = isActiveLocale ? '' : ':alternate';
      this.add('meta', { property: 'og:locale' + suffix, content: locale });
    }

    return this;
  }

  /**
   * Set mobile version URL
   */
  public setAlternateHandheld(url: string): MetadataGenerator {
    this.add('link', { rel: 'alternate', media: 'handheld', href: url });

    return this;
  }

  /**
   * Set project metadata
   */
  public setProjectMeta(obj: ProjectMeta): MetadataGenerator {
    if (obj.name && obj.name.length) {
      if (this.settings.msTags) {
        this.add('meta', { name: 'application-name', content: obj.name });
      }

      if (this.settings.safariTags) {
        this.setSafariMobileWebApp({ name: obj.name });
      }

      if (this.settings.openGraphTags) {
        this.add('meta', { property: 'og:site_name', content: obj.name });
      }
    }

    if (obj.url && obj.url.length) {
      if (this.settings.msTags) {
        this.add('meta', { name: 'msapplication-starturl', content: obj.url });
      }
    }

    if (obj.logo && obj.logo.length) {
      if (this.settings.structuredData) {
        const generatedData: string = this.htmlGenerator.generateJSONLD(
          {
            '@type': 'Organization',
            logo: obj.logo,
            url: obj.url
          },
          { 'data-mptype': 'sdorg' }
        );
        this.elementsOfBody.set(generatedData, generatedData);
      }
    }

    if (obj.primaryColor && obj.primaryColor.length) {
      this.add('meta', { name: 'theme-color', content: obj.primaryColor });
    }

    if (obj.backgroundColor && obj.backgroundColor.length) {
      if (this.settings.msTags) {
        this.add('meta', { name: 'msapplication-TileColor', content: obj.backgroundColor });
      }
    }

    return this;
  }

  /**
   * Custom Open Graph metadata
   */
  public openGraphData(type: OpengraphTypes, duration?: number): MetadataGenerator {
    if (this.settings.openGraphTags) {
      this.add('meta', { property: 'og:type', content: type });

      if (type === OpengraphTypes.movie && duration) {
        this.add('meta', { property: 'video:duration', content: duration });
      }
    }

    return this;
  }

  /**
   * Set Safari mobile web application
   */
  public setSafariMobileWebApp(obj: SafariMobileApp): MetadataGenerator {
    if (!this.settings.appleTags) return this;

    this.add('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' });

    if (obj.name && obj.name.length) {
      this.add('meta', { name: 'apple-mobile-web-app-title', content: obj.name });
    }

    if (obj.statusBarStyle && obj.statusBarStyle.length) {
      this.add('meta', { name: 'apple-mobile-web-app-status-bar-style', content: obj.statusBarStyle });
    }

    return this;
  }

  /**
   * Set Apple Safari pinned tab
   */
  public setSafariPinnedTab(url: string, color?: string): MetadataGenerator {
    this.add('link', { rel: 'mask-icon', href: url, color: color || 'black' });

    return this;
  }

  /**
   * Set Facebook meta tags
   */
  public setFacebookMeta(appID: string | number): MetadataGenerator {
    this.add('meta', { property: 'fb:app_id', content: String(appID) });

    return this;
  }

  /**
   * Set Twitter meta tags
   */
  public setTwitterMeta(twitterMeta: TwitterMeta): MetadataGenerator {
    if (!this.settings.twitterTags) return this;

    if (twitterMeta.card) {
      this.add('meta', { name: 'twitter:card', content: twitterMeta.card });
    }

    if (twitterMeta.site) {
      this.add('meta', { name: 'twitter:site', content: twitterMeta.site });
    }

    if (twitterMeta.creator) {
      this.add('meta', { name: 'twitter:creator', content: twitterMeta.creator });
    }

    return this;
  }

  /**
   * Set breadcrumb
   */
  public breadcrumb(data: BreadcrumbData[]): MetadataGenerator {
    if (!this.settings.structuredData) return this;

    const content = {
      '@type': 'BreadcrumbList',
      itemListElement: data.map((obj, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: obj.title,
        item: obj.url
      }))
    };

    const generatedData: string = this.htmlGenerator.generateJSONLD(content, { 'data-mptype': 'sdb' });

    this.elementsOfBody.set(generatedData, generatedData);

    return this;
  }

  /**
   * Set page metadata
   */
  public setPageMeta(obj: PageMeta): MetadataGenerator {
    if (obj.title && obj.title.length) {
      this.add('title', {}, obj.title);

      if (this.settings.openGraphTags) {
        this.add('meta', { property: 'og:title', content: obj.title });
        this.add('meta', { name: 'title', content: obj.title });
      }

      if (this.settings.twitterTags) {
        this.add('meta', { name: 'twitter:title', content: obj.title });
      }
    }

    if (obj.description && obj.description.length) {
      this.add('meta', { name: 'description', content: obj.description });

      if (this.settings.openGraphTags) {
        this.add('meta', { property: 'og:description', content: obj.description });
      }

      if (this.settings.twitterTags) {
        this.add('meta', { name: 'twitter:description', content: obj.description });
      }
    }

    if (obj.keywords && obj.keywords.length) {
      this.add('meta', { name: 'keywords', content: obj.keywords });
    }

    if (obj.url && obj.url.length) {
      if (this.settings.openGraphTags) {
        this.add('meta', { property: 'og:url', content: obj.url });
      }
    }

    if (obj.image && obj.image.length) {
      const imageObject = MetadataGenerator.formatImageInput(obj.image);

      if (this.settings.openGraphTags) {
        this.add('meta', { property: 'og:image', content: imageObject.url });
        this.add('link', { rel: 'image_src', content: imageObject.url });

        if (imageObject.width) {
          this.add('meta', { property: 'og:image:width', content: imageObject.width });
        }

        if (imageObject.height) {
          this.add('meta', { property: 'og:image:height', content: imageObject.height });
        }
      }

      if (this.settings.twitterTags) {
        this.add('meta', { name: 'twitter:image', content: imageObject.url });
      }
    }

    if (obj.locale && obj.locale.length) {
      if (this.settings.openGraphTags) {
        this.add('meta', { property: 'og:locale', content: obj.locale.replace('-', '_') });
      }
    }

    return this;
  }

  /**
   * Set icons list
   */
  public setIcons(list: string[]): MetadataGenerator {
    const validTypes = Object.values(mimeTypesByExtension);

    list.forEach((url) => {
      const type = MetadataGenerator.findMimeType(url);
      const sizeMatches = url.match(reImageSizeFromStr);

      if (sizeMatches && sizeMatches.length > 0 && type && validTypes.indexOf(type) !== -1) {
        const size = sizeMatches[0];

        if (androidChromeIconSizes.indexOf(size) !== -1 && this.settings.androidChromeIcons) {
          this.add('link', { rel: 'icon', href: url, sizes: size, type });
        }

        if (appleTouchIconSizes.indexOf(size) !== -1 && this.settings.appleTags) {
          this.add('link', { rel: 'apple-touch-icon', href: url, sizes: size });
        }

        if (microsoftTileIconSizes.indexOf(size) !== -1 && this.settings.msTags) {
          this.add('meta', { name: microsoftTilesNamingMap[size], content: url });
        }
      }
    });

    return this;
  }

  /**
   * Add meta tag to stage
   */
  public add(tag: string, attrs: AddParams, content?: object | string): MetadataGenerator {
    if (headTags.includes(tag)) {
      this.elementsOfHead.set(
        `${tag}-${attrs.name || attrs.property || attrs.rel}-${attrs.media || attrs.sizes}`,
        this.htmlGenerator.generateElement(tag, attrs, content)
      );
    } else {
      this.elementsOfBody.set(
        `${tag}-${attrs.name || attrs.property || attrs.rel}-${attrs.media || attrs.sizes}`,
        this.htmlGenerator.generateElement(tag, attrs, content)
      );
    }

    return this;
  }

  /**
   * Instance configuration
   */
  public configure(settings?: Settings): MetadataGenerator {
    if (settings) {
      this.settings = settings;
    } else {
      this.settings = this.defaultSettings;
    }
    return this;
  }

  /**
   * Build meta tags
   */
  public build(): MetatagsDocument {
    this.document.head = Array.from(this.elementsOfHead.values()).sort().join(`\n`);
    this.document.body = Array.from(this.elementsOfBody.values()).sort().join(`\n`);

    return this.document;
  }

  /**
   * Clear all cached metadata
   */
  public clear(): MetadataGenerator {
    this.document = {
      body: '',
      head: ''
    };

    this.elementsOfHead.clear();
    this.elementsOfBody.clear();

    return this;
  }

  /**
   * Format images
   * @private
   */
  private static formatImageInput(input: string | ImageInput) {
    if (typeof input === 'string') {
      return { url: input };
    } else if (input !== null && typeof input === 'object') {
      return {
        url: input.url,
        width: input.width,
        height: input.height
      };
    } else return {};
  }

  /**
   * Find mime type for image
   * @private
   */
  private static findMimeType(path: string) {
    const lastIndex = path.lastIndexOf('.');
    if (lastIndex < 1) throw new Error('Not image link');

    const ext = path.slice(lastIndex + 1);
    if (!ext) throw new Error('Image without extensions');

    if (!Object.values(mimeTypesByExtension).includes(`image/${ext}`)) throw new Error('Extension not registered');

    return mimeTypesByExtension[ext];
  }
}
