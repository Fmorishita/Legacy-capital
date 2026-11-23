import type { Metadata } from "next";
import { es } from "@/lib/i18n/es";
import { vsl } from "@/lib/i18n/vsl";
import { href } from "@/lib/projects";
import { LeadProvider } from "@/components/lead/LeadProvider";
import { VslLanding } from "@/components/vsl/VslLanding";

const t = vsl.doctores;

// Landing de pauta (Meta Ads): fuera de buscadores para no competir con /preventa
export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  robots: { index: false, follow: false },
  openGraph: { title: t.meta.title, description: t.meta.description, images: ["/media/video/vsl-demo-doctor.jpg"] },
};

export default function Page() {
  const privacyHref = href("privacy", "es");
  return (
    <LeadProvider
      t={{ form: es.form, dialog: es.dialog, a11y: es.a11y, quickForm: es.quickForm }}
      lang="es"
      privacyHref={privacyHref}
      project="preventa"
    >
      <VslLanding t={t} persona="doctores" privacyHref={privacyHref} />
    </LeadProvider>
  );
}
