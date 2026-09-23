'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { getRandomWorkVideos, workVideos } from '../lib/work-videos';

const serviceMap = {
  '/services/video-production/': 'Video Production',
  '/services/content-creation/': 'Content Creation',
  '/services/social-media/': 'Social Media',
  '/services/ad-campaigns/': 'Ad Campaigns',
  '/services/branding/': 'Brand Storytelling',
  '/services/digital-marketing/': 'Ad Campaigns',
  '/services/event-management/': 'Content Creation',
  '/services/web-design/': 'Brand Storytelling',
};

function usePortalTarget(selector, position = 'beforeend') {
  const [target, setTarget] = useState(null);
  useEffect(() => {
    const host = document.querySelector(selector);
    if (!host) return undefined;
    const mount = document.createElement('div');
    host.insertAdjacentElement(position, mount);
    setTarget(mount);
    return () => mount.remove();
  }, [selector, position]);
  return target;
}

function ManagedVideo({ video, className = '', eager = false, active }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = document.querySelector(`[data-video-id="${video.id}"]`);
    if (!element || active !== undefined || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) element.play().catch(() => {});
      else element.pause();
    }, { rootMargin: '180px 0px', threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [video.id, active]);
  useEffect(() => {
    if (active === undefined) return undefined;
    const element = document.querySelector(`[data-video-id="${video.id}"]`);
    if (!element) return undefined;
    if (active) element.play().catch(() => {});
    else element.pause();
    return undefined;
  }, [active, video.id]);
  if (failed) return <div className={`${className} video-fallback`} aria-hidden="true" />;
  return <video className={className} data-video-id={video.id} muted playsInline loop preload={eager ? 'metadata' : 'none'} autoPlay={eager} onError={() => setFailed(true)} aria-hidden="true"><source src={video.src} type="video/mp4" /></video>;
}

function Universe({ videos }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const target = usePortalTarget('.work', 'afterbegin');
  useEffect(() => {
    const update = () => {
      const section = document.querySelector('.media-universe');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, rect.height - innerHeight);
      const next = Math.max(0, Math.min(1, -rect.top / range));
      setProgress(next);
      setActive(Math.min(videos.length - 1, Math.floor(next * videos.length)));
    };
    addEventListener('scroll', update, { passive: true });
    update();
    return () => removeEventListener('scroll', update);
  }, [videos.length]);
  if (!target) return null;
  const current = videos[active];
  return createPortal(
    <section className="media-universe" aria-label="Creovo Media Universe">
      <div className="universe-sticky" style={{ '--universe-progress': progress }}>
        <div className="universe-heading"><span className="micro">[02] / CREOVO MEDIA UNIVERSE</span><h2>Our work,<br /><em>in motion.</em></h2><p>Move through a living edit of recent Creovo work.</p></div>
        <div className="universe-field" aria-hidden="true">
          {videos.map((video, index) => <div className={`universe-frame frame-${index} ${active === index ? 'is-active' : ''}`} key={video.id}><ManagedVideo video={video} className="universe-video" eager={index === 0} active={Math.abs(active - index) < 2} /></div>)}
          <div className="universe-vignette" />
        </div>
        <div className="universe-caption" aria-live="polite"><span className="micro">0{active + 1} / 0{videos.length}</span><div><span className="micro">{current.category} / {current.year}</span><h3>{current.title}</h3></div><a href="/work/">View work <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>, target,
  );
}

function HeroReel({ video }) {
  const target = usePortalTarget('.hero', 'beforeend');
  if (!target) return null;
  return createPortal(<div className="hero-work-signal"><ManagedVideo video={video} className="hero-work-video" eager /><span className="micro">LIVE WORK REEL</span></div>, target);
}

function WorkRail({ videos }) {
  const target = usePortalTarget('.work-page-grid', 'beforeend');
  if (!target) return null;
  return createPortal(<section className="motion-work-rail" aria-label="Work in motion"><header><span className="micro">WORK IN MOTION</span><h2>Stories that<br /><em>move.</em></h2></header><div className="motion-rail-track">{videos.map((video, index) => <article className="motion-rail-item" key={video.id}><ManagedVideo video={video} className="motion-rail-video" eager={index === 0} /><div><span className="micro">{video.category} / {video.year}</span><h3>{video.title}</h3></div></article>)}</div></section>, target);
}

function ServiceReel({ video, service }) {
  const target = usePortalTarget('.page-hero', 'beforeend');
  if (!target) return null;
  return createPortal(<aside className="service-motion-reel"><ManagedVideo video={video} className="service-motion-video" eager /><div><span className="micro">SELECTED MOTION</span><b>{service}</b></div></aside>, target);
}

export default function WorkMedia({ route }) {
  const videos = useMemo(() => getRandomWorkVideos(7), []);
  if (route === '/') return <><HeroReel video={videos[0]} /><Universe videos={videos.slice(0, 6)} /></>;
  if (route === '/work/') return <WorkRail videos={videos.slice(0, 6)} />;
  if (route === '/services/') return <ServiceReel video={videos[0]} service="Creative services" />;
  if (serviceMap[route]) return <ServiceReel video={videos[0]} service={serviceMap[route]} />;
  return null;
}
