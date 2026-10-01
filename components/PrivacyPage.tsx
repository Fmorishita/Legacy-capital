import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import type { PrivacyDoc } from "@/lib/legal/privacy";
import { Logo } from "@/components/ui/Logo";

export function PrivacyPage({ doc, backHref, backLabel }: { doc: PrivacyDoc; backHref: string; backLabel: string }) {
  return (
    <>
      <header className="border-b border-line">
        <div className="container-x flex h-[4.5rem] items-center justify-between">
          <Link href={backHref} aria-label={backLabel}>
            <Logo />
          </Link>
          <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden />
            {backLabel}
          </Link>
        </div>
      </header>
      <main className="container-x py-16 md:py-24">
        <article className="mx-auto max-w-3xl">
          <h1 className="display text-5xl leading-[1.05] md:text-6xl">{doc.title}</h1>
          <p className="mt-4 text-sm text-ink-soft">{doc.updated}</p>
          <p className="mt-8 text-lg leading-relaxed">{doc.intro}</p>
          {doc.sections.map((s) => (
            <section key={s.heading} className="mt-12 border-t border-line pt-8">
              <h2 className="display text-3xl">{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-4 grid gap-2.5">
                  {s.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3 leading-relaxed text-ink-soft">
                      <span className="mt-3 h-px w-3 shrink-0 bg-gold" aria-hidden />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </main>
    </>
  );
}
