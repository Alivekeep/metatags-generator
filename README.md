# Meta tags generator

SEO meta tags generator for Node.js applications. Written in TypeScript. Zero dependencies.

### How to use

Typescript

```typescript
import { MetadataGenerator } from '@d0v/metatags-generator';
```

Pure Nodejs

```js
const MetadataGenerator = require('@d0v/metatags-generator');
```

```js
const settings = {
  structuredData: true,
  androidChromeIcons: true,
  msTags: true,
  safariTags: true,
  appleTags: true,
  openGraphTags: true,
  twitterTags: true,
  facebookTags: true
};

const generator = new MetadataGenerator(settings);
const preparedData = generator
  .setRobots('index, follow')
  .setShortLink('https://bit.ly/1ahy')
  .setLocalVersion('en_US', 'https://example.com', true)
  .setAlternateHandheld('https://m.example.com')
  .setProjectMeta({
    name: 'Example app',
    url: 'https://example.com',
    logo: '/path/logo.png',
    primaryColor: '#333333',
    backgroundColor: '#ffffff'
  })
  .setPageMeta({
    title: 'Home',
    description: 'This is home page',
    url: 'https://example.com',
    image: '/path/cover.jpg',
    keywords: 'site, app, example, pug',
    locale: 'en_US'
  })
  .openGraphData('video.movie')
  .setCanonical('https://example.com')
  .breadcrumb(data)
  .setIcons(icons)
  .setTwitterMeta({
    card: 'summary_large_image',
    site: '@nytimesbits',
    creator: '@nickbilton'
  })
  .setFacebookMeta(5233)
  .build();
```

Then you can use HTML output for inject in your page.


### Express + Pug example

Install dependencies
```shell script
npm i express pug @d0v/metatags-generator
```

Create files:

index.js
```js
const express = require('express');
const { MetadataGenerator } = require('@d0v/metatags-generator');

const app = express();
const port = 3000;

app.set('views', `${__dirname}`);
app.set('view engine', 'pug');

const generator = new MetadataGenerator();

const data = [
  { title: 'Home', url: 'https://example.com' },
  { title: 'About', url: 'https://example.com/about' }
];

const icons = ['/path/icon-72x72.png', '/path/icon-180x180.png'];

const preparedData = generator
  .setRobots('index')
  .setRobots('index, follow')
  .setShortLink('https://bit.ly/1ahy')
  .setLocalVersion('en_US', 'https://example.com', true)
  .setAlternateHandheld('https://m.example.com')
  .setProjectMeta({
    name: 'Example app',
    url: 'https://example.com',
    logo: '/path/logo.png',
    primaryColor: '#333333',
    backgroundColor: '#ffffff'
  })
  .setPageMeta({
    title: 'Home',
    description: 'This is home page',
    url: 'https://example.com',
    image: '/path/cover.jpg',
    keywords: 'site, app, example, pug',
    locale: 'en_US'
  })
  .openGraphData('video.movie')
  .setCanonical('https://example.com')
  .breadcrumb(data)
  .setIcons(icons)
  .setTwitterMeta({
    card: 'summary_large_image',
    site: '@nytimesbits',
    creator: '@nickbilton'
  })
  .setFacebookMeta(5233)
  .build();

app.get('/', (req, res) => {
  res.render('index', { head: preparedData.head, body: preparedData.body });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

```

index.pug

```html
doctype html
html(lang="en", prefix="og: http://ogp.me/ns#")
	head
		| !{head}
	body
		| !{body}
		h1 Hello World

```
