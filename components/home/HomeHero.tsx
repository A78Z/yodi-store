"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { HERO_INTERVAL_MS, heroSwipeDirection, homeSlides, nextHeroSlide } from "@/lib/home-slides";
import styles from "./HomeHero.module.css";

export default function HomeHero({ univers }: { univers: { slug: string }[] }) {
  const slides = homeSlides(univers);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(true);
  const [inView, setInView] = useState(false);
  const [manual, setManual] = useState(false);
  const region = useRef<HTMLElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const running = !paused && !hovered && !reducedMotion && visible && inView;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setVisible(document.visibilityState === "visible");
    updateMotion(); updateVisibility();
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    if (region.current) observer.observe(region.current);
    return () => {
      preference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => { setManual(false); setCurrent(value => nextHeroSlide(value, 1, slides.length)); }, HERO_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [current, running, slides.length]);

  function choose(index: number) {
    setPaused(true); setManual(true); setCurrent(index);
  }

  return <section className={styles.section} aria-label="Les rituels Maison Yodi-K" aria-roledescription="carrousel" ref={region}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={event => { if (!(event.target as HTMLElement).closest("[data-rotation-control]")) setPaused(true); }}
    onKeyDown={event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault(); choose(nextHeroSlide(current, event.key === "ArrowLeft" ? -1 : 1, slides.length));
      }
    }}>
    <h1 className={styles.srOnly}>Maison Yodi-K, vos rituels de soin</h1>
    <div className={styles.carousel}>
      <div className={styles.panels} id="home-hero-slides" aria-live={manual ? "polite" : "off"} aria-atomic="false"
        onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
        onTouchCancel={() => { touch.current = null; }}
        onTouchEnd={event => {
          if (!touch.current) return;
          const direction = heroSwipeDirection(event.changedTouches[0].clientX - touch.current.x, event.changedTouches[0].clientY - touch.current.y);
          touch.current = null;
          if (direction) choose(nextHeroSlide(current, direction, slides.length));
        }}>
        {slides.map((slide, index) => <article key={slide.id} className={`${styles.slide} ${styles[slide.theme]} ${index === current ? styles.active : ""}`} role="group" aria-roledescription="diapositive" aria-label={`${index + 1} sur ${slides.length} · ${slide.label}`} aria-hidden={index !== current} inert={index !== current}>
          <div className={styles.content}>
            <p className={styles.eyebrow}><span aria-hidden="true"/>{slide.eyebrow}</p>
            <h2>{slide.title}<em>{slide.accent}</em></h2>
            <p className={styles.description}>{slide.description}</p>
            <Link href={slide.href} className={styles.cta}>{slide.cta}<ArrowRight size={17} aria-hidden="true"/></Link>
            <div className={styles.signature} aria-hidden="true"><span/>Des gestes simples. Votre moment.</div>
          </div>
          <div className={styles.visual}>
            <Image src={slide.image} alt={slide.alt} fill priority={index === 0} sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1264px) 50vw, 600px" style={{ objectPosition: slide.position }} className={styles.photo}/>
            <div className={styles.photoShade}/><span className={styles.photoLabel}>{slide.caption}</span>
            <span className={styles.photoNumber} aria-hidden="true">0{index + 1}</span>
          </div>
        </article>)}
      </div>
      <div className={styles.controls}>
        <div className={styles.selectors} aria-label="Choisir une diapositive">{slides.map((slide, index) => <button key={slide.id} type="button" className={`${styles.selector} ${index === current ? styles.selected : ""}`} onClick={() => choose(index)} aria-label={`Afficher la diapositive ${index + 1} : ${slide.label}`} aria-current={index === current ? "true" : undefined} aria-controls="home-hero-slides"><span className={styles.selectorText}><span>0{index + 1}</span>{slide.label}</span><span className={styles.track} aria-hidden="true">{index === current && <span key={`${current}-${running}`} className={running ? styles.progress : styles.filled}/>}</span></button>)}</div>
        <div className={styles.navigation}>
          <span className={styles.count} aria-hidden="true">0{current + 1}<span>/ 03</span></span>
          <button className={styles.iconButton} type="button" aria-label="Diapositive précédente" onClick={() => choose(nextHeroSlide(current, -1, slides.length))}><ArrowLeft size={18} aria-hidden="true"/></button>
          <button className={styles.iconButton} type="button" aria-label="Diapositive suivante" onClick={() => choose(nextHeroSlide(current, 1, slides.length))}><ArrowRight size={18} aria-hidden="true"/></button>
          {!reducedMotion && <button className={`${styles.iconButton} ${styles.playButton}`} data-rotation-control type="button" aria-label={paused ? "Lancer le défilement automatique" : "Mettre en pause le défilement automatique"} onClick={() => { setPaused(value => !value); setManual(false); }}>{paused ? <Play size={15} aria-hidden="true"/> : <Pause size={15} aria-hidden="true"/>}</button>}
        </div>
      </div>
    </div>
  </section>;
}
