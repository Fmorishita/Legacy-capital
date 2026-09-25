import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { allowIndex } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return allowIndex
    ? { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${site.url}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
