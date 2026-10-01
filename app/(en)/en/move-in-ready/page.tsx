import { Vinedos } from "@/components/Vinedos";
import { vinedos } from "@/lib/i18n/vinedos";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(vinedos.en, "vinedos", "en");

export default function Page() {
  return <Vinedos t={vinedos.en} lang="en" />;
}
