import type { NextConfig } from "next";

/** [ruta, utm_source, utm_medium, utm_campaign] — ver README, sección "Links por canal". */
const SHORT_LINKS: [string, string, string, string][] = [
  ["/ig", "instagram", "bio", "legacy_capital"],
  ["/fran", "instagram", "bio", "fran_morishita"],
  ["/fb", "facebook", "pagina", "legacy_capital"],
  ["/wa", "whatsapp", "perfil", "fran_personal"],
];

const nextConfig: NextConfig = {
  experimental: {
    // 404 con marca para rutas inexistentes (el sitio tiene dos layouts raíz: es / en)
    globalNotFound: true,
    // Tareas de la capacitación con archivo adjunto (máx. 4 MB)
    serverActions: { bodySizeLimit: "5mb" },
  },
  // Tipografías del certificado PDF
  outputFileTracingIncludes: { "/capacitacion/certificado/pdf": ["./lib/cap/fonts/*.ttf"] },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    remotePatterns: [{ protocol: "https", hostname: "lpdqksuvccsocntditik.supabase.co" }],
  },
  poweredByHeader: false,
  async redirects() {
    // Links cortos para cada canal: llegan a la portada con UTM, y el lead (correo y Supabase), Clarity
    // y Vercel Analytics registran de dónde vino. Temporales (307) para poder cambiar los UTM después.
    const short = SHORT_LINKS.map(([path, source, medium, campaign]) => ({
      source: path,
      destination: `/?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`,
      permanent: false,
    }));
    // El dominio oficial es legacycapitalmx.com: los .vercel.app de producción redirigen ahí
    // (los previews de ramas, con otro host, no se tocan).
    const official = ["legacycapitalmx.vercel.app", "legacycapitalrealestate.vercel.app", "legacy-capital-rho.vercel.app"].map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://legacycapitalmx.com/:path*",
      permanent: true,
    }));
    return [...official, ...short];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Capacitación privada y verificación de certificados: fuera de buscadores
        source: "/(capacitacion|certificados)/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/capacitacion",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/(img|video|brand|media)/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
