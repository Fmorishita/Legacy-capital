import type { ShowcaseCopy } from "@/lib/i18n/showcase";

type Loc = ShowcaseCopy["location"];

/** Etiqueta con nombre y tiempo en auto */
function Tag({ x, y, name, time, anchor = "start" }: { x: number; y: number; name: string; time?: string; anchor?: "start" | "end" }) {
  const w = Math.max(name.length * 6.6, time ? time.length * 6.4 : 0) + 22;
  const h = time ? 38 : 24;
  const left = anchor === "start" ? x : x - w;
  return (
    <g>
      <rect x={left} y={y - 13} width={w} height={h} rx={9} fill="#0a1a2e" fillOpacity={0.88} stroke="rgb(255 255 255 / 0.16)" />
      <text x={left + 11} y={y + 3} fontSize={12} fontWeight={600} fill="#f5f0e6">
        {name}
      </text>
      {time && (
        <text x={left + 11} y={y + 18} fontSize={11.5} fontWeight={600} fill="#ddbb84">
          {time}
        </text>
      )}
    </g>
  );
}

/**
 * Mapa esquemático (no a escala) de la zona norte de Ensenada: la carretera escénica que baja de Tijuana
 * por la costa, El Sauzal (donde están las casas), Ensenada centro y el camino al Valle de Guadalupe.
 */
export function AreaMap({ t }: { t: Loc }) {
  const [caseta, valle, tijuana, frontera, mexicali] = t.places;
  return (
    <svg viewBox="0 0 360 460" role="img" aria-label={t.mapAlt} className="h-auto w-full font-sans">
      <defs>
        <radialGradient id="pin-glow">
          <stop offset="0" stopColor="#ddbb84" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ddbb84" stopOpacity="0" />
        </radialGradient>
        <pattern id="waves" width="22" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 6 q5.5 -5 11 0 t11 0" fill="none" stroke="rgb(255 255 255 / 0.05)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Tierra y mar */}
      <rect width="360" height="460" fill="#132b3e" />
      <path
        d="M0 0 H128 C138 60 124 110 132 160 C140 210 150 250 150 292 C150 322 158 346 190 360 C222 372 248 378 250 405 C252 428 236 446 226 460 H0 Z"
        fill="#0b1e30"
      />
      <path
        d="M0 0 H128 C138 60 124 110 132 160 C140 210 150 250 150 292 C150 322 158 346 190 360 C222 372 248 378 250 405 C252 428 236 446 226 460 H0 Z"
        fill="url(#waves)"
      />
      <path
        d="M128 0 C138 60 124 110 132 160 C140 210 150 250 150 292 C150 322 158 346 190 360 C222 372 248 378 250 405 C252 428 236 446 226 460"
        fill="none"
        stroke="#ddbb84"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <text x="26" y="236" fontSize="12" letterSpacing="3" fill="rgb(255 255 255 / 0.35)" transform="rotate(-90 26 236)">
        {t.map.ocean.toUpperCase()}
      </text>

      {/* Carretera escénica: Tijuana → El Sauzal → Ensenada */}
      <path d="M158 0 C164 70 150 120 158 170 C166 220 172 262 172 300 C172 322 186 340 212 352 C236 362 258 372 262 392" fill="none" stroke="#f5f0e6" strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round" />
      <text x="170" y="120" fontSize="10.5" fill="rgb(245 240 230 / 0.6)" transform="rotate(84 170 120)">
        {t.map.scenic}
      </text>

      {/* Camino al Valle de Guadalupe (y a Mexicali) */}
      <path d="M176 318 C214 300 244 262 268 232 C290 204 312 150 332 92" fill="none" stroke="#f5f0e6" strokeOpacity="0.55" strokeWidth="2.4" strokeDasharray="7 6" strokeLinecap="round" />
      <text x="214" y="300" fontSize="10.5" fill="rgb(245 240 230 / 0.55)" transform="rotate(-42 214 300)">
        {t.map.valleyRoad}
      </text>

      {/* Puntos */}
      <circle cx="158" cy="6" r="5" fill="#f5f0e6" />
      <circle cx="167" cy="262" r="4.5" fill="#f5f0e6" />
      <circle cx="270" cy="230" r="5" fill="#f5f0e6" />
      <circle cx="262" cy="392" r="5" fill="#f5f0e6" />

      {/* Aquí: El Sauzal */}
      <circle cx="176" cy="318" r="34" fill="url(#pin-glow)" />
      <circle cx="176" cy="318" r="9" fill="#ddbb84" stroke="#0a1a2e" strokeWidth="3" />

      <Tag x={140} y={24} name={frontera.name} time={frontera.time} />
      <Tag x={174} y={78} name={tijuana.name} time={tijuana.time} />
      <Tag x={352} y={130} name={mexicali.name} time={mexicali.time} anchor="end" />
      <Tag x={352} y={182} name={valle.name} time={valle.time} anchor="end" />
      <Tag x={158} y={250} name={caseta.name} time={caseta.time} anchor="end" />
      <Tag x={256} y={424} name={t.map.center} anchor="end" />

      {/* Etiqueta principal */}
      <g>
        <rect x={10} y={334} width={156} height={44} rx={12} fill="#ddbb84" />
        <path d="M150 334 L170 324 L160 340 Z" fill="#ddbb84" />
        <text x={22} y={352} fontSize={12.5} fontWeight={700} fill="#0a1a2e">
          {t.map.here}
        </text>
        <text x={22} y={368} fontSize={11} fontWeight={600} fill="#0a1a2e" fillOpacity={0.75}>
          {t.pin}
        </text>
      </g>
    </svg>
  );
}
