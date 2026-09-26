import type { NextConfig } from "next";

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
        source: "/(img|video|brand)/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
