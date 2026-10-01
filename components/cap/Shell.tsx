import Link from "next/link";
import Image from "next/image";
import { SignOut, GearSix, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { logoutAction } from "@/lib/cap/actions";
import type { Me } from "@/lib/cap/server";

export function Brand({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image src="/brand/crest-64.png" alt="" width={64} height={64} className="size-9" priority />
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-[1.15rem] font-medium tracking-wide ${tone === "light" ? "text-cream" : "text-navy"}`}>
          Legacy Capital
        </span>
        <span className={`mt-1 text-[0.58rem] font-semibold tracking-[0.28em] ${tone === "light" ? "text-gold" : "text-gold-dk"}`}>
          CAPACITACIÓN
        </span>
      </span>
    </span>
  );
}

/** Encabezado de las páginas con sesión. */
export function Shell({ me, children, wide = false }: { me: Me; children: React.ReactNode; wide?: boolean }) {
  const first = me.nombre.split(/\s+/)[0];
  return (
    <>
      <header className="sticky top-0 z-40 bg-navy text-cream shadow-[0_1px_0_rgb(197_165_100/0.35)]">
        <div className={`cap-wrap flex h-16 items-center justify-between gap-3 ${wide ? "max-w-[90rem]" : ""}`}>
          <Link href="/capacitacion" aria-label="Mi avance" className="shrink-0">
            <Brand />
          </Link>
          <nav className="flex items-center gap-1 text-sm" aria-label="Cuenta">
            {me.rol === "admin" && (
              <Link
                href="/capacitacion/admin"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-cream/85 transition hover:bg-white/10 hover:text-cream"
              >
                <GearSix className="size-4" aria-hidden />
                <span className="hidden sm:inline">Administración</span>
              </Link>
            )}
            <Link
              href="/capacitacion/cuenta"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-cream/85 transition hover:bg-white/10 hover:text-cream"
              title="Mi cuenta"
            >
              <UserCircle className="size-5" aria-hidden />
              <span className="hidden max-w-[10rem] truncate md:inline">{first}</span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-cream/70 transition hover:bg-white/10 hover:text-cream"
                title="Cerrar sesión"
              >
                <SignOut className="size-4" aria-hidden />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </form>
          </nav>
        </div>
      </header>
      {children}
      <footer className="mt-20 border-t border-line py-8 text-center text-xs text-muted">
        Material confidencial para asesores de Legacy Capital Real Estate. No lo compartas ni lo reproduzcas.
      </footer>
    </>
  );
}

/** Tarjeta centrada para entrar, registrarse y cambiar contraseña. */
export function AuthFrame({ title, kicker, children }: { title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-navy-3 lg:block">
        <Image src="/img/hero-roof.jpg" alt="" fill sizes="50vw" className="object-cover opacity-45" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-3 via-navy-3/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-cream">
          <p className="cap-kicker !text-gold">Programa para asesores</p>
          <p className="mt-4 max-w-md font-serif text-4xl leading-tight">Curso de Ventas Inmobiliarias</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/75">
            14 módulos, casos prácticos y una evaluación final. Al aprobar recibes tu certificado Legacy Capital.
          </p>
          <p className="mt-8 font-serif text-lg italic text-gold">Building wealth for generations.</p>
        </div>
      </div>
      <div className="flex flex-col px-4 py-8 sm:px-8">
        <div className="lg:hidden">
          <Brand tone="dark" />
        </div>
        <div className="m-auto w-full max-w-md py-10">
          {kicker && <p className="cap-kicker">{kicker}</p>}
          <h1 className="cap-title mt-2 text-[2.2rem]">{title}</h1>
          <div className="mt-8">{children}</div>
        </div>
        <p className="text-center text-xs text-muted">
          <Link href="/" className="underline-offset-4 hover:underline">
            legacycapitalmx.vercel.app
          </Link>
        </p>
      </div>
    </main>
  );
}
