"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play, ArrowUpRight } from "lucide-react";
import type { FacebookGalleryMedia } from "@/lib/facebook-gallery";
import styles from "./FacebookGallery.module.css";

function MediaCard({ media, copy, onError }: { media: FacebookGalleryMedia; copy?: boolean; onError: (id: string) => void }) {
  const label = media.kind === "video" ? "Voir la vidéo sur Facebook (nouvel onglet)" : "Voir la publication photo sur Facebook (nouvel onglet)";
  return <a href={media.permalink} target="_blank" rel="noopener noreferrer" className={styles.card}
    aria-label={copy ? undefined : label} tabIndex={copy ? -1 : 0}
    onMouseDown={copy ? (event) => event.preventDefault() : undefined}>
    {/* Signed Facebook thumbnails must expire with the server feed, not an image optimizer cache. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={media.thumbnail} alt="" loading="lazy" decoding="async" width={260} height={325} referrerPolicy="no-referrer" onError={() => onError(media.id)} />
    {media.kind === "video" && <span className={styles.video} aria-hidden="true"><Play size={18} fill="currentColor" /><ArrowUpRight size={12} /></span>}
  </a>;
}

function MediaRow({ media, reverse, paused, allowAnimation, onError }: { media: FacebookGalleryMedia[]; reverse?: boolean; paused: boolean; allowAnimation: boolean; onError: (id: string) => void }) {
  const group = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const animate = allowAnimation && media.length >= 5;
  useEffect(() => {
    const element = group.current;
    if (!element) return;
    const measure = () => setDuration(element.getBoundingClientRect().width / 30);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [media.length]);
  const renderCards = (copy = false) => media.map(item => <MediaCard key={item.id} media={item} copy={copy} onError={onError} />);
  return <div className={styles.row} data-animated={animate && duration > 0 || undefined} data-reverse={reverse || undefined} data-manual={keyboard || undefined}
    onFocusCapture={(event) => {
      setKeyboard(true);
      const target = event.target as HTMLElement;
      requestAnimationFrame(() => target.scrollIntoView({ block: "nearest", inline: "nearest" }));
    }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboard(false); }}>
    <div className={styles.track} style={{ "--gallery-duration": `${duration}s`, animationPlayState: paused ? "paused" : "running" } as CSSProperties}>
      <div className={styles.group} ref={group}>{renderCards()}</div>
      {animate && <div className={`${styles.group} ${styles.copy}`} aria-hidden="true">{renderCards(true)}</div>}
    </div>
  </div>;
}

export default function FacebookGallery({ media }: { media: FacebookGalleryMedia[] }) {
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const available = media.filter(item => !failed.has(item.id));
  if (!available.length) return null;
  const middle = Math.ceil(available.length / 2);
  const onError = (id: string) => setFailed(current => current.has(id) ? current : new Set([...current, id]));
  return <section className={styles.gallery} aria-label="Photos et vidéos de la page Facebook Yodi-K"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    {available.length >= 10 && <button type="button" className={styles.pause} aria-label={paused ? "Reprendre le défilement de la galerie" : "Mettre en pause le défilement de la galerie"}
      aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button>}
    <MediaRow media={available.slice(0, middle)} paused={paused || hovered || focused} allowAnimation={available.length >= 10} onError={onError} />
    {available.length > 1 && <MediaRow media={available.slice(middle)} reverse paused={paused || hovered || focused} allowAnimation={available.length >= 10} onError={onError} />}
  </section>;
}
