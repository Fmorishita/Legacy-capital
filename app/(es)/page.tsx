import { Landing } from "@/components/Landing";
import { es } from "@/lib/i18n/es";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(es, "/");

export default function Page() {
  return <Landing t={es} lang="es" />;
}
