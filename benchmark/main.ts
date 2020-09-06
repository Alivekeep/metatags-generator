import { randomBytes } from 'crypto';
import { MetadataGenerator, OpengraphTypes } from '../src/main';

const startTime = process.hrtime.bigint();

const iterationsNumber = 100_000;

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

for (let i = 0; i < iterationsNumber; i++) {
  const preparedMetadata = {
    siteURL: `https://${randomBytes(20).toString('hex')}.com`,
    shortLink: `https://as.io/${randomBytes(5).toString('hex')}.com`,
    mobileLink: `https://m.${randomBytes(20).toString('hex')}.com`
  };

  const data = [
    { title: randomBytes(10).toString('hex'), url: preparedMetadata.siteURL },
    { title: randomBytes(10).toString('hex'), url: `${preparedMetadata.siteURL}/about` }
  ];

  const icons = ['/path/icon-72x72.png', '/path/icon-180x180.png'];

  const generator = new MetadataGenerator();

  generator
    .configure(settings)
    .setRobots('index')
    .setRobots('index, follow')
    .setShortLink(preparedMetadata.shortLink)
    .setLocalVersion('en_US', preparedMetadata.siteURL, true)
    .setAlternateHandheld(preparedMetadata.mobileLink)
    .setProjectMeta({
      name: randomBytes(50).toString('hex'),
      url: preparedMetadata.siteURL,
      logo: '/path/logo.png',
      primaryColor: '#333333',
      backgroundColor: '#ffffff'
    })
    .setPageMeta({
      title: randomBytes(30).toString('hex'),
      description: randomBytes(150).toString('hex'),
      url: preparedMetadata.siteURL,
      image: '/path/cover.jpg',
      keywords: randomBytes(50).toString('hex'),
      locale: 'en_US'
    })
    .openGraphData(OpengraphTypes.movie)
    .setCanonical(preparedMetadata.siteURL)
    .breadcrumb(data)
    .setIcons(icons)
    .setTwitterMeta({
      card: 'summary_large_image',
      site: '@nytimesbits',
      creator: '@nickbilton'
    })
    .setFacebookMeta(Math.random() * 1000)
    .build();
}

const used = process.memoryUsage();
const measurement: {}[] = [];

for (const key in used) {
  if (used && used.hasOwnProperty(key)) {
    measurement.push({
      type: `mem: ${key}`,
      value: `${Math.round((used[key] / 1024 / 1024) * 100) / 100}Mb`
    });
  }
}

const totalTime = Math.ceil(Number(process.hrtime.bigint() - startTime) / 1000 / 1000) / 1000;

measurement.push({
  type: `time`,
  value: `${totalTime}s`
});

measurement.push({
  type: `item per sec`,
  value: iterationsNumber / totalTime
});

console.table(measurement);
