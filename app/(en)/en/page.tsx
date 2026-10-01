import { Home } from "@/components/Home";
import { home } from "@/lib/i18n/home";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(home.en, "home", "en");

export default function Page() {
  return <Home t={home.en} lang="en" />;
}
