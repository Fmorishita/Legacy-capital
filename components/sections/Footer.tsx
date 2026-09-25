import Link from "next/link";
import { WhatsappLogo, Phone, MapPin } from "@phosphor-icons/react/dist/ssr";
import type { Dict } from "@/lib/i18n/es";
import { site, waLink } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";

export function Footer({
  t,
  nav,
  waGeneric,
  privacyHref,
  navLabel,
}: {
  t: Dict["footer"];
  nav: Dict["nav"];
  waGeneric: string;
  privacyHref: string;
  navLabel: string;
}) {
  return (
    <footer className="bg-navy-900 pb-28 text-cream-100 dark:bg-navy-950 lg:pb-12">
      <div className="container-x border-t border-cream-100/15 pt-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo tone="light" />
            <p className="display mt-6 text-2xl italic text-gold-300">{t.tagline}</p>
            <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-cream-100/70">{t.about}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream-100/60">{t.contact}</p>
            <ul className="mt-5 grid gap-3 text-sm">
              <li>
                <a href={waLink(waGeneric)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gold-300">
                  <WhatsappLogo className="size-4" weight="fill" aria-hidden /> WhatsApp {site.advisor.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={site.advisor.phoneHref} className="inline-flex items-center gap-2 hover:text-gold-300">
                  <Phone className="size-4" aria-hidden /> {site.advisor.phoneDisplay}
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-cream-100/80">
                <MapPin className="size-4" aria-hidden /> {site.city}
              </li>
            </ul>
          </div>
          <nav aria-label={navLabel}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream-100/60">{t.explore}</p>
            <ul className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {nav.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-cream-100/80 hover:text-gold-300">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href={privacyHref} className="text-cream-100/80 hover:text-gold-300">
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link href={nav.switchLang.href} className="text-cream-100/80 hover:text-gold-300">
                  {nav.switchLang.label}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-14 border-t border-cream-100/15 pt-8 text-xs leading-relaxed text-cream-100/55">{t.disclaimer}</p>
        <p className="mt-4 text-xs text-cream-100/55">
          © {new Date().getFullYear()} {site.name}. {t.rights}
        </p>
      </div>
    </footer>
  );
}
