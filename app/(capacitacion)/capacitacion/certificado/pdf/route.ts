import { NextResponse, type NextRequest } from "next/server";
import { CapError, withSession } from "@/lib/cap/server";
import { certificatePdf } from "@/lib/cap/certificate";
import { site } from "@/lib/site";
import type { Certificado } from "@/lib/cap/types";

export async function GET(req: NextRequest) {
  let cert: Certificado;
  try {
    cert = await withSession<Certificado>("certificate");
  } catch (e) {
    if (e instanceof CapError && e.code === "sin_sesion") return NextResponse.redirect(new URL("/capacitacion/entrar", req.url));
    throw e;
  }
  if (!cert.elegible) return NextResponse.redirect(new URL("/capacitacion/certificado", req.url));

  const logo = await withSession<{ base64: string }>("image", { nombre: "logo_lockup.png" }).catch(() => null);
  const pdf = await certificatePdf({
    nombre: cert.nombre,
    folio: cert.folio,
    emitido_at: cert.emitido_at,
    verifyUrl: `${site.url}/certificados/${cert.folio}`,
    logo: logo ? Buffer.from(logo.base64, "base64") : undefined,
  });
  return new Response(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Certificado-${cert.folio}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
