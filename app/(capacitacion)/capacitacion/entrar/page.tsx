import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFrame } from "@/components/cap/Shell";
import { LoginForm } from "@/components/cap/AuthForms";
import { getMe } from "@/lib/cap/server";

export const metadata: Metadata = { title: "Entrar" };

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getMe().catch(() => null)) redirect("/capacitacion");
  const { next } = await searchParams;
  return (
    <AuthFrame kicker="Acceso asesores" title="Entra a tu capacitación">
      <LoginForm next={next} />
    </AuthFrame>
  );
}
