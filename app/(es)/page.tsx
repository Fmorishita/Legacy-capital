import { Home } from "@/components/Home";
import { home } from "@/lib/i18n/home";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(home.es, "home", "es");

export default function Page() {
  return <Home t={home.es} lang="es" />;
}
