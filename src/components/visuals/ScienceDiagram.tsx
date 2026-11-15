"use client";

/** Rayleigh scattering diagram for the sky-is-blue post. */
export function RayleighDiagram() {
  return (
    <div className="my-6 rounded-xl border border-border dark:border-border-dark overflow-hidden bg-[#0a1628]">
      <svg viewBox="0 0 600 280" className="w-full h-auto" role="img" aria-label="Diagram of Rayleigh scattering: sunlight enters atmosphere, blue light scatters more">
        <circle cx="60" cy="140" r="28" fill="#F5C542" />
        <text x="60" y="190" textAnchor="middle" fill="#F5C542" fontSize="12" fontFamily="system-ui">Sun</text>

        <line x1="95" y1="140" x2="200" y2="140" stroke="#ffffff" strokeWidth="3" />
        <text x="145" y="125" textAnchor="middle" fill="#ccc" fontSize="10">White light</text>

        <path d="M200,40 Q320,140 200,240" fill="none" stroke="#4a7a9b" strokeWidth="40" opacity="0.5" />
        <text x="280" y="50" fill="#8ab4c8" fontSize="11">Atmosphere</text>

        <line x1="240" y1="120" x2="320" y2="60" stroke="#4da6ff" strokeWidth="2" />
        <line x1="250" y1="140" x2="380" y2="100" stroke="#4da6ff" strokeWidth="2.5" />
        <line x1="240" y1="160" x2="340" y2="220" stroke="#4da6ff" strokeWidth="2" />
        <text x="360" y="95" fill="#4da6ff" fontSize="11">Blue scatters</text>

        <line x1="260" y1="140" x2="480" y2="140" stroke="#ff6b4a" strokeWidth="2.5" />
        <text x="420" y="160" fill="#ff6b4a" fontSize="11">Red continues</text>

        <circle cx="520" cy="140" r="14" fill="#e8e6e0" />
        <circle cx="520" cy="140" r="6" fill="#102033" />
        <text x="520" y="175" textAnchor="middle" fill="#aaa" fontSize="10">Observer</text>
      </svg>
      <p className="text-xs text-muted px-3 py-2 bg-[#0f1e32] border-t border-white/10">
        Shorter wavelengths (blue) scatter about 5.5x more than red -- Rayleigh scattering.
      </p>
    </div>
  );
}
