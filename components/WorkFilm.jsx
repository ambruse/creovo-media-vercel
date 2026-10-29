'use client';
import { useRef, useState } from 'react';
import { ui } from '../content/ui.mjs';
import { workTitle } from '../lib/work-videos';
import { track } from '../lib/analytics';

export default function WorkFilm({video, locale}) {
 const [failed, setFailed] = useState(false), started = useRef(false), t = ui[locale];
 return <figure className="work-film">
  <video src={video.src} poster={video.poster} width={video.width} height={video.height}
   controls playsInline preload="none" aria-label={workTitle(video, locale)}
   onError={() => setFailed(true)}
   onPlay={() => {if (!started.current) {track('video_start', {video_id: video.id}); started.current = true;}}}
   onEnded={() => track('video_complete', {video_id: video.id})}/>
  <figcaption>{failed && <p role="status">{t.videoError}</p>}<a href={video.src}>{t.openVideo}</a></figcaption>
 </figure>;
}
