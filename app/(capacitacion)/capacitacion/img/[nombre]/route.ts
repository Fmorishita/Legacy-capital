import { CapError, withSession } from "@/lib/cap/server";

// Imágenes del manual: viven en la base de datos y solo se sirven con sesión activa.
export async function GET(_: Request, { params }: { params: Promise<{ nombre: string }> }) {
  const { nombre } = await params;
  if (!/^[\w.-]{1,80}$/.test(nombre)) return new Response("No encontrado", { status: 404 });
  try {
    const img = await withSession<{ tipo: string; base64: string }>("image", { nombre });
    return new Response(Buffer.from(img.base64, "base64"), {
      headers: {
        "Content-Type": img.tipo,
        "Cache-Control": "private, max-age=604800",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (e) {
    const code = e instanceof CapError ? e.code : "servidor";
    return new Response(null, { status: code === "sin_sesion" ? 401 : code === "no_encontrado" ? 404 : 500 });
  }
}
