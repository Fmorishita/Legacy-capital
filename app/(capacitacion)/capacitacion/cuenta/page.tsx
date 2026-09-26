import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Shell } from "@/components/cap/Shell";
import { PasswordForm } from "@/components/cap/AuthForms";
import { requireUser } from "@/lib/cap/server";

export const metadata: Metadata = { title: "Mi cuenta" };

export default async function CuentaPage() {
  const me = await requireUser({ allowTempPassword: true });
  return (
    <Shell me={me}>
      <main className="cap-wrap max-w-xl py-10">
        {!me.debe_cambiar && (
          <Link href="/capacitacion" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
            <ArrowLeft className="size-4" aria-hidden /> Mi avance
          </Link>
        )}
        <p className="cap-kicker mt-6">Mi cuenta</p>
        <h1 className="cap-title mt-2 text-4xl">{me.nombre}</h1>
        <p className="mt-2 text-sm text-muted">{me.correo}</p>
        <section className="cap-card mt-8 p-6 sm:p-8">
          <h2 className="cap-title text-2xl">Cambiar contraseña</h2>
          <div className="mt-6">
            <PasswordForm forced={me.debe_cambiar} />
          </div>
        </section>
        <p className="mt-6 text-xs leading-relaxed text-muted">
          ¿Tu nombre tiene un error? Pídele al administrador que lo corrija antes de emitir tu certificado.
        </p>
      </main>
    </Shell>
  );
}
