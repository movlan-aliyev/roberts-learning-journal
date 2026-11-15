"use client";
import type { ReactNode } from "react";

type FlagData = {
  name: string;
  ratio: string;
  svg: ReactNode;
  capital: string;
  region: string;
  feature: string;
};

const FLAGS: Record<string, FlagData> = {
  thailand: {
    name: "Thailand", capital: "Bangkok", region: "Southeast Asia",
    ratio: "2:3", feature: "Wide blue center stripe (monarchy)",
    svg: (
      <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flag of Thailand">
        <rect width="900" height="100" y="0" fill="#A51931" />
        <rect width="900" height="100" y="100" fill="#F4F5F8" />
        <rect width="900" height="200" y="200" fill="#2D2A4A" />
        <rect width="900" height="100" y="400" fill="#F4F5F8" />
        <rect width="900" height="100" y="500" fill="#A51931" />
      </svg>
    ),
  },
  vietnam: {
    name: "Vietnam", capital: "Hanoi", region: "Southeast Asia",
    ratio: "2:3", feature: "Yellow five-pointed star on red",
    svg: (
      <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flag of Vietnam">
        <rect width="900" height="600" fill="#DA251D" />
        <polygon fill="#FFFF00" points="450,120 490,280 660,280 520,370 570,530 450,430 330,530 380,370 240,280 410,280" />
      </svg>
    ),
  },
  indonesia: {
    name: "Indonesia", capital: "Jakarta", region: "Southeast Asia",
    ratio: "2:3", feature: "Red over white (wider than Monaco)",
    svg: (
      <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flag of Indonesia">
        <rect width="900" height="300" fill="#CE1126" />
        <rect width="900" height="300" y="300" fill="#FFFFFF" />
      </svg>
    ),
  },
  philippines: {
    name: "Philippines", capital: "Manila", region: "Southeast Asia",
    ratio: "1:2", feature: "Sun with 8 rays + 3 stars in white triangle",
    svg: (
      <svg viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flag of the Philippines">
        <rect width="1200" height="300" fill="#0038A8" />
        <rect width="1200" height="300" y="300" fill="#CE1126" />
        <polygon fill="#FFFFFF" points="0,0 520,300 0,600" />
        <circle cx="175" cy="300" r="55" fill="#FCD116" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          return (
            <line key={i} x1={175} y1={300} x2={175 + Math.cos(rad) * 90} y2={300 + Math.sin(rad) * 90} stroke="#FCD116" strokeWidth="8" strokeLinecap="round" />
          );
        })}
        <circle cx="80" cy="160" r="18" fill="#FCD116" />
        <circle cx="80" cy="440" r="18" fill="#FCD116" />
        <circle cx="340" cy="300" r="18" fill="#FCD116" />
      </svg>
    ),
  },
  malaysia: {
    name: "Malaysia", capital: "Kuala Lumpur", region: "Southeast Asia",
    ratio: "1:2", feature: "14 stripes + yellow crescent and 14-point star",
    svg: (
      <svg viewBox="0 0 1400 700" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flag of Malaysia">
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} width="1400" height="50" y={i * 50} fill={i % 2 === 0 ? "#CC0001" : "#FFFFFF"} />
        ))}
        <rect width="700" height="350" fill="#010066" />
        <circle cx="280" cy="175" r="100" fill="#FFCC00" />
        <circle cx="310" cy="175" r="85" fill="#010066" />
        <polygon fill="#FFCC00" points="420,175 445,210 485,195 470,235 510,250 470,265 485,305 445,290 420,325 395,290 355,305 370,265 330,250 370,235 355,195 395,210" />
      </svg>
    ),
  },
  singapore: {
    name: "Singapore", capital: "Singapore", region: "Southeast Asia",
    ratio: "2:3", feature: "Crescent + five stars on red over white",
    svg: (
      <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flag of Singapore">
        <rect width="900" height="300" fill="#EF3340" />
        <rect width="900" height="300" y="300" fill="#FFFFFF" />
        <circle cx="180" cy="150" r="70" fill="#FFFFFF" />
        <circle cx="210" cy="150" r="60" fill="#EF3340" />
        {[0, 72, 144, 216, 288].map((a, i) => {
          const rad = ((a - 90) * Math.PI) / 180;
          const cx = 290 + Math.cos(rad) * 35;
          const cy = 150 + Math.sin(rad) * 35;
          return (
            <polygon key={i} fill="#FFFFFF" points={`${cx},${cy - 12} ${cx + 3.5},${cy - 4} ${cx + 12},${cy - 4} ${cx + 5.5},${cy + 2} ${cx + 7.5},${cy + 11} ${cx},${cy + 5} ${cx - 7.5},${cy + 11} ${cx - 5.5},${cy + 2} ${cx - 12},${cy - 4} ${cx - 3.5},${cy - 4}`} />
          );
        })}
      </svg>
    ),
  },
  cambodia: {
    name: "Cambodia", capital: "Phnom Penh", region: "Southeast Asia",
    ratio: "2:3", feature: "Angkor Wat depicted in white on red band",
    svg: (
      <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flag of Cambodia">
        <rect width="900" height="150" fill="#032EA1" />
        <rect width="900" height="300" y="150" fill="#E00025" />
        <rect width="900" height="150" y="450" fill="#032EA1" />
        <rect x="360" y="280" width="180" height="100" fill="#FFFFFF" />
        <polygon fill="#FFFFFF" points="450,180 470,280 430,280" />
        <polygon fill="#FFFFFF" points="390,220 405,280 375,280" />
        <polygon fill="#FFFFFF" points="510,220 525,280 495,280" />
        <rect x="340" y="360" width="220" height="20" fill="#FFFFFF" />
      </svg>
    ),
  },
  myanmar: {
    name: "Myanmar", capital: "Naypyidaw", region: "Southeast Asia",
    ratio: "2:3", feature: "Large white star on yellow-green-red stripes",
    svg: (
      <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flag of Myanmar">
        <rect width="900" height="200" fill="#FECB00" />
        <rect width="900" height="200" y="200" fill="#34B233" />
        <rect width="900" height="200" y="400" fill="#EA2839" />
        <polygon fill="#FFFFFF" points="450,150 490,290 640,290 520,380 560,520 450,430 340,520 380,380 260,290 410,290" />
      </svg>
    ),
  },
  laos: {
    name: "Laos", capital: "Vientiane", region: "Southeast Asia",
    ratio: "2:3", feature: "White circle (full moon) on blue band",
    svg: (
      <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flag of Laos">
        <rect width="900" height="150" fill="#CE1126" />
        <rect width="900" height="300" y="150" fill="#002868" />
        <rect width="900" height="150" y="450" fill="#CE1126" />
        <circle cx="450" cy="300" r="90" fill="#FFFFFF" />
      </svg>
    ),
  },
  brunei: {
    name: "Brunei", capital: "Bandar Seri Begawan", region: "Southeast Asia",
    ratio: "1:2", feature: "Yellow field with black/white diagonals and red crest",
    svg: (
      <svg viewBox="0 0 1400 700" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flag of Brunei">
        <rect width="1400" height="700" fill="#F7E017" />
        <polygon fill="#FFFFFF" points="0,80 1400,380 1400,480 0,180" />
        <polygon fill="#000000" points="0,180 1400,480 1400,580 0,280" />
        <circle cx="700" cy="320" r="80" fill="#DC1414" />
        <rect x="660" y="220" width="80" height="40" fill="#DC1414" />
        <rect x="680" y="180" width="40" height="50" fill="#DC1414" />
      </svg>
    ),
  },
};

export type FlagId = keyof typeof FLAGS;

/** Flag ratios are stored as height:width (e.g. 2:3). CSS needs width/height. */
function cssAspect(ratio: string) {
  const [h, w] = ratio.split(":").map(Number);
  if (!h || !w) return "3 / 2";
  return `${w} / ${h}`;
}

export function FlagSvg({ id, className = "" }: { id: FlagId; className?: string }) {
  const flag = FLAGS[id];
  if (!flag) return null;
  return (
    <div
      className={`overflow-hidden rounded shadow-sm border border-border/50 bg-white leading-none ${className}`}
      style={{ aspectRatio: cssAspect(flag.ratio) }}
    >
      <div className="w-full h-full [&>svg]:block [&>svg]:w-full [&>svg]:h-full">
        {flag.svg}
      </div>
    </div>
  );
}

export function FlagCard({ id }: { id: FlagId }) {
  const flag = FLAGS[id];
  if (!flag) return null;
  return (
    <div className="bg-white dark:bg-[#222] rounded-xl border border-border dark:border-border-dark overflow-hidden">
      <FlagSvg id={id} className="w-full rounded-none border-0 shadow-none" />
      <div className="p-3">
        <h3 className="font-serif font-semibold text-base">{flag.name}</h3>
        <p className="text-xs text-muted mt-0.5">{flag.capital} - {flag.region}</p>
        <p className="text-sm mt-2 text-ink dark:text-ink-light">{flag.feature}</p>
        <p className="text-[10px] text-muted mt-1">Ratio {flag.ratio}</p>
      </div>
    </div>
  );
}

export function FlagGallery({ ids }: { ids: FlagId[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 my-6">
      {ids.map((id) => (
        <FlagCard key={id} id={id} />
      ))}
    </div>
  );
}

export const SEA_FLAGS: FlagId[] = [
  "thailand", "vietnam", "indonesia", "philippines", "malaysia",
  "singapore", "cambodia", "myanmar", "laos", "brunei",
];

export { FLAGS };
