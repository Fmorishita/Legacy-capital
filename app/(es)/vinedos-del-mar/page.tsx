import { Vinedos } from "@/components/Vinedos";
import { vinedos } from "@/lib/i18n/vinedos";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(vinedos.es, "vinedos", "es");

export default function Page() {
  return <Vinedos t={vinedos.es} lang="es" />;
}
