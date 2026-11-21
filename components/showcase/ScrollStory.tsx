"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import type { StoryCopy } from "@/lib/i18n/showcase";
import { trackEvent } from "@/lib/track";
import { useLead, type LeadKind } from "@/components/lead/LeadProvider";
import { Em, Eyebrow } from "./primitives";

type Props = {
  id: string;
  num?: number;
  t: StoryCopy;
  /** Qué formulario abre el botón del último paso */
  ctaKind?: LeadKind;
  waHref?: string;
  origin: string;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Historia al hacer scroll: cada paso enciende su video en el marco fijo y llena su barra de progreso.
 * Los videos se descargan solo cuando la sección está cerca de la pantalla y se pausan al salir.
 */
export function ScrollStory({ id, num, t, ctaKind = "visit", waHref, origin }: Props) {
  const { openLead } = useLead();
  const root = useRef<HTMLElement>(null);
  const steps = useRef<(HTMLDivElement | null)[]>([]);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const bars = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [armed, setArmed] = useState(false);
  const [near, setNear] = useState(false);
  const reduce = useReducedMotion();
  const activeRef = useRef(0);
  const seen = useRef(new Set<number>());

  const update = useCallback(() => {
    const vh = window.innerHeight;
    const mobile = window.innerWidth < 1024;
    const line = vh * (mobile ? 0.74 : 0.66);
    let idx = 0;
    const n = t.steps.length;
    for (let k = 0; k < n; k++) {
      const card = cards.current[k];
      const step = steps.current[k];
      if (!card || !step) continue;
      const r = card.getBoundingClientRect();
      const pos = mobile ? r.top : r.top + r.height / 2;
      const h = step.offsetHeight || vh;
      const p = clamp((line - pos) / (h * (k < n - 1 ? 0.85 : 0.4)), 0, 1);
      const bar = bars.current[k];
      if (bar) bar.style.transform = `scaleX(${p})`;
      if (pos <= line) idx = k;
    }
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  }, [t.steps.length]);

  // Se arma (descarga videos y escucha el scroll) solo cerca de la pantalla
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          setNear(true);
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
          update();
        } else {
          setNear(false);
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [update]);

  // Reproduce solo el video del paso activo
  useEffect(() => {
    videos.current.forEach((v, k) => {
      if (!v) return;
      if (k === active && near && armed && !reduce) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
    if (near && !seen.current.has(active)) {
      seen.current.add(active);
      trackEvent("story_step", { story: id, step: active + 1 });
    }
  }, [active, near, armed, reduce, id]);

  const last = t.steps.length - 1;

  return (
    <section ref={root} id={id} aria-labelledby={`${id}-title`} className="on-dark section-dark relative pt-24 md:pt-36">
      <div className="container-x mb-10 md:mb-14">
        <Eyebrow num={num}>{t.eyebrow}</Eyebrow>
        <h2 id={`${id}-title`} className="display mt-5 max-w-[16ch] text-[2.5rem] md:text-[3.6rem] xl:text-[4rem]">
          <Em text={t.title} />
        </h2>
        <p className="lead mt-5 max-w-[46ch]">{t.lead}</p>
      </div>

      <div className="story-body mx-auto w-full max-w-[1320px] pb-0 lg:px-8 lg:pb-36">
        <div className="story-stage">
          <div className="story-frame" role="img" aria-label={t.frameLabel}>
            <div className="story-bars" aria-hidden>
              {t.steps.map((s, k) => (
                <span key={s.kicker}>
                  <i ref={(el) => void (bars.current[k] = el)} />
                </span>
              ))}
            </div>
            {t.steps.map((s, k) => (
              <video
                key={s.video}
                ref={(el) => void (videos.current[k] = el)}
                className="story-video"
                data-on={k === active}
                src={armed ? s.video : undefined}
                poster={s.poster}
                muted
                loop
                playsInline
                // Se precarga el paso activo y el siguiente; el resto, hasta que se acerca
                preload={k === active || k === active + 1 ? "auto" : "none"}
                aria-hidden
              />
            ))}
          </div>
        </div>

        <div className="story-steps">
          {t.steps.map((s, k) => (
            <div key={s.kicker} ref={(el) => void (steps.current[k] = el)} className="story-step" data-on={k === active}>
              <div ref={(el) => void (cards.current[k] = el)} className="story-card">
                <span className="story-kicker tabular-nums">{s.kicker}</span>
                <h3 className="display mt-3 text-[1.65rem] text-white md:text-[2.4rem]">{s.title}</h3>
                <p className="mt-2 text-[1.0625rem] font-light leading-relaxed text-[#b3c3cd]">{s.text}</p>
                {k === last && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="btn btn-gold btn-glow w-full sm:w-auto"
                      onClick={() => openLead({ kind: ctaKind, origin: `${origin}-${id}` })}
                    >
                      {t.cta}
                      <ArrowRight className="nudge size-4" weight="bold" aria-hidden />
                    </button>
                    {waHref && t.ctaWa && (
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-wa w-full sm:w-auto"
                        onClick={() => trackEvent("whatsapp_click", { origin: `${origin}-${id}` })}
                      >
                        <WhatsappLogo className="wiggle size-5" weight="fill" aria-hidden />
                        {t.ctaWa}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
