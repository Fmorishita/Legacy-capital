import { CapError, withSession } from "@/lib/cap/server";

// Archivos entregados en tareas: solo los ve su autor o el administrador.
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("No encontrado", { status: 404 });
  try {
    const f = await withSession<{ nombre: string; tipo: string; base64: string }>("file", { archivo: id });
    const inline = f.tipo === "application/pdf" || f.tipo.startsWith("image/");
    return new Response(Buffer.from(f.base64, "base64"), {
      headers: {
        "Content-Type": f.tipo,
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(f.nombre)}`,
        "Cache-Control": "private, no-store",
        "Content-Security-Policy": "sandbox",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (e) {
    const code = e instanceof CapError ? e.code : "servidor";
    return new Response(null, { status: code === "sin_sesion" ? 401 : code === "no_encontrado" ? 404 : 500 });
  }
}
