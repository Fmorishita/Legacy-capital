import { Landing } from "@/components/Landing";
import { en } from "@/lib/i18n/en";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(en, "/en");

export default function Page() {
  return <Landing t={en} lang="en" />;
}
