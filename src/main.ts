import { MetadataGenerator } from './metadata-generator';

const generator = new MetadataGenerator();

const data = [
  { title: 'Home', url: 'https://www.frondjs.org' },
  { title: 'About', url: 'https://www.frondjs.org/about' }
];

const icons = ['/path/icon-72x72.png', '/path/icon-180x180.png'];

const aa = generator
  .setRobots('index, nofollow')
  .setShortLink('https://mail.ru/asas')
  .setLocalVersion('en_US', 'https://vk.com', true)
  .setProjectMeta({
    name: 'Sample App',
    url: 'https://frondjs.org',
    logo: '/path/logo.png',
    primaryColor: '#333333',
    backgroundColor: '#ffffff'
  })
  .setPageMeta({
    title: 'Home',
    description: 'This is home.',
    url: 'https://frondjs.org',
    image: '/path/cover.jpg',
    locale: 'tr_TR'
  })
  .setCanonical('https://www.frondjs.org/home')
  .breadcrumb(data)
  .setIcons(icons)
  .setTwitterMeta({
    card: 'summary_large_image',
    site: '@twitter',
    creator: '@muratgozel'
  })
  .build();

console.log(aa);
