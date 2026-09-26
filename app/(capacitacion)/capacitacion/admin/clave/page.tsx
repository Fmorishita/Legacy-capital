import { requireAdmin, withSession } from "@/lib/cap/server";

export default async function ClavePage() {
  await requireAdmin();
  const { html } = await withSession<{ html: string }>("admin_clave");
  return (
    <div className="mx-auto max-w-[46rem]">
      <p className="rounded-xl bg-warn-bg px-4 py-3 text-sm text-warn">
        Confidencial: respuestas del examen final y de los casos prácticos. Úsala solo para calificar; no la compartas con los
        asesores.
      </p>
      <div className="manual mt-8" dangerouslySetInnerHTML={{ __html: html ?? "" }} />
    </div>
  );
}
