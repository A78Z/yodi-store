"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play, ArrowUpRight, X } from "lucide-react";
import type { FacebookGalleryMedia } from "@/lib/facebook-gallery";

import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import styles from "./HomeMediaGallery.module.css";

export type HomeGalleryMedia = FacebookGalleryMedia & { label?: string; internal?: boolean; viewerUrl?: string };

function MediaCard({ media, copy, onError, onOpen }: { media: HomeGalleryMedia; copy?: boolean; onError: (id: string) => void; onOpen: (media: HomeGalleryMedia, trigger: HTMLElement) => void }) {
  const label = media.label || (media.kind === "video" ? "Voir la vidéo sur Facebook (nouvel onglet)" : "Voir la publication photo sur Facebook (nouvel onglet)");
  const content = <>
    {/* The server validates media URLs. Reserve dimensions and remove failed thumbnails. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={media.thumbnail} alt="" loading="lazy" decoding="async" width={260} height={325} referrerPolicy="no-referrer" onError={() => onError(media.id)} />
    {media.kind === "video" && <span className={styles.video} aria-hidden="true"><Play size={18} fill="currentColor" />{!media.viewerUrl && <ArrowUpRight size={12}/>}</span>}
  </>;
  const common = { className: styles.card, "aria-label": copy ? undefined : label, tabIndex: copy ? -1 : 0 };
  return media.viewerUrl
    ? <button type="button" {...common} onClick={event => onOpen(media, event.currentTarget)}>{content}</button>
    : <a {...common} href={media.permalink} target={media.internal ? undefined : "_blank"} rel={media.internal ? undefined : "noopener noreferrer"} onMouseDown={copy ? event => event.preventDefault() : undefined}>{content}</a>;
}

function MediaRow({ media, reverse, paused, allowAnimation, onError, onOpen }: { media: HomeGalleryMedia[]; reverse?: boolean; paused: boolean; allowAnimation: boolean; onError: (id: string) => void; onOpen: (media: HomeGalleryMedia, trigger: HTMLElement) => void }) {
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
  const renderCards = (copy = false) => media.map(item => <MediaCard key={item.id} media={item} copy={copy} onError={onError} onOpen={onOpen} />);
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

export default function HomeMediaGallery({ media, label = "Photos et vidéos de la page Facebook Yodi-K" }: { media: HomeGalleryMedia[]; label?: string }) {
  const [selected, setSelected] = useState<HomeGalleryMedia | null>(null);
  const [playError, setPlayError] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const available = media.filter(item => !failed.has(item.id));
  if (!available.length) return null;
  const middle = Math.ceil(available.length / 2);
  const onError = (id: string) => setFailed(current => current.has(id) ? current : new Set([...current, id]));
  const open = (item: HomeGalleryMedia, element: HTMLElement) => { trigger.current = element; setPlayError(false); setSelected(item); };
  return <section className={styles.gallery} aria-label={label}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    {available.length >= 10 && <button type="button" className={styles.pause} aria-label={paused ? "Reprendre le défilement de la galerie" : "Mettre en pause le défilement de la galerie"}
      aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}</button>}
    <MediaRow media={available.slice(0, middle)} paused={paused || hovered || focused || Boolean(selected)} allowAnimation={available.length >= 10} onError={onError} onOpen={open} />
    {available.length > 1 && <MediaRow media={available.slice(middle)} reverse paused={paused || hovered || focused || Boolean(selected)} allowAnimation={available.length >= 10} onError={onError} onOpen={open} />}
    <Dialog open={Boolean(selected)} onOpenChange={value => { if (!value) setSelected(null); }}>
      <DialogContent className={styles.viewer} showCloseButton={false} aria-describedby={undefined} onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus(); }}>
        <DialogTitle className="sr-only">{selected?.label || "Média Yodi-K"}</DialogTitle>
        <DialogClose className={styles.close} aria-label="Fermer le média"><X size={22}/></DialogClose>
        {selected && (selected.kind === "video" ? <video key={selected.id} src={selected.viewerUrl} poster={selected.thumbnail} controls playsInline preload="none" aria-label={selected.label} onError={() => setPlayError(true)}/> :
          // eslint-disable-next-line @next/next/no-img-element
          <img src={selected.viewerUrl} alt={selected.label || "Photo Yodi-K"} onError={() => setPlayError(true)}/>)}
        {playError && <p role="alert" className={styles.mediaError}>Ce média est momentanément indisponible. Fermez cette fenêtre et réessayez plus tard.</p>}
      </DialogContent>
    </Dialog>
  </section>;
}
