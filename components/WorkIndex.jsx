import { workVideos, workPath, workTitle } from '../lib/work-videos';
import { localePath } from '../content/ui.mjs';

// Complete HTML index: discovery does not depend on the interactive media gallery.
export default function WorkIndex({locale, items = workVideos}) {
 return <section className="page-section work-index">
  <h2>{locale === 'ar' ? 'استكشف الأفلام' : 'Explore the films'}</h2>
  <ul>{items.map(video => <li key={video.id}>
   <a href={localePath(workPath(video), locale)}>{workTitle(video, locale)} <span aria-hidden="true">↗</span></a>
  </li>)}</ul>
 </section>;
}
