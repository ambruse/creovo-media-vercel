const folder = '/videos/work/';

const files = [
  'ARG_1.mp4', 'ARG_2.mp4', 'ARG_3.mp4', 'ARG_4.mp4', 'ARG_5.mp4', 'ARG_6.mp4',
  'ARG_7.mp4', 'ARG_8.mp4', 'ARG_9.mp4', 'ARG_10.mp4', 'ARG_11.mp4', 'ARG_12.mp4',
  'Chocolate tart Re edit.mp4', 'Chocolate Tart.mp4', 'Doha chocolate - Review.mp4',
  'IMG_9438.mp4', 'London Cake Rewised.mp4', 'Lotus cake.mp4', 'Mini sandwiches.mp4',
  'Missing Cat.mp4', 'Truffles.mp4',
];

const names = [
  'Frame by frame', 'A taste of detail', 'Made to be seen', 'The daily ritual',
  'A brighter kind of story', 'In the making', 'Close enough to feel', 'Motion, considered',
  'A new point of view', 'The finish matters', 'Made for the moment', 'Here, now',
];

const categories = ['Content Creation', 'Video Production', 'Social Media', 'Ad Campaigns', 'Brand Storytelling'];

export const workVideos = files.map((file, index) => ({
  id: `work-${index + 1}`,
  src: `${folder}${encodeURIComponent(file)}`,
  title: names[index % names.length],
  category: categories[index % categories.length],
  year: '2026',
}));

export function getRandomWorkVideos(count = 1, pool = workVideos) {
  const shuffled = [...pool];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getRandomWorkVideosByCategory(category, count = 3) {
  const matches = workVideos.filter((video) => video.category === category);
  return getRandomWorkVideos(count, matches.length ? matches : workVideos);
}
