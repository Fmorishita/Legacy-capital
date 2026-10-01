import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFrame } from "@/components/cap/Shell";
import { RegisterForm } from "@/components/cap/AuthForms";
import { Alert } from "@/components/cap/Alert";
import { capRpc, getMe } from "@/lib/cap/server";

export const metadata: Metadata = { title: "Registro" };

export default async function RegistroPage() {
  if (await getMe().catch(() => null)) redirect("/capacitacion");
  const cfg = await capRpc<{ modo_registro: "codigo" | "aprobacion" | "ambos" }>("public_config").catch(() => null);
  return (
    <AuthFrame kicker="Acceso asesores" title="Crea tu cuenta">
      {cfg ? (
        <RegisterForm modo={cfg.modo_registro} />
      ) : (
        <Alert>El registro no está disponible en este momento. Intenta más tarde.</Alert>
      )}
    </AuthFrame>
  );
}
