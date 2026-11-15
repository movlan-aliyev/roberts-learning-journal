"use client";

const PALETTES = [
  { bg: "#102033", accent: "#B28B4B", text: "#F7F5EF" },
  { bg: "#167D8D", accent: "#F7F5EF", text: "#FFFFFF" },
  { bg: "#6c3483", accent: "#B28B4B", text: "#F7F5EF" },
  { bg: "#c0392b", accent: "#F7F5EF", text: "#FFFFFF" },
  { bg: "#1a6b4a", accent: "#B28B4B", text: "#F7F5EF" },
  { bg: "#2c3e50", accent: "#167D8D", text: "#F7F5EF" },
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

interface BookCoverProps {
  title: string;
  creator?: string;
  year?: string;
  type?: "book" | "film";
  className?: string;
}

export function BookCover({ title, creator, year, type = "book", className = "" }: BookCoverProps) {
  const p = PALETTES[hash(title) % PALETTES.length];
  return (
    <div
      className={`relative rounded-lg overflow-hidden shadow-md flex flex-col justify-between p-4 ${className}`}
      style={{ background: p.bg, color: p.text, aspectRatio: type === "film" ? "2/3" : "2/3", minHeight: 160 }}
      aria-hidden={!title}
    >
      <div className="absolute inset-y-0 left-0 w-1.5 opacity-40" style={{ background: p.accent }} />
      <div>
        <div className="text-[10px] uppercase tracking-widest opacity-70 mb-2">
          {type === "film" ? "Film" : "Book"}
        </div>
        <h3 className="font-serif text-sm sm:text-base font-bold leading-snug line-clamp-4">{title || "Untitled"}</h3>
      </div>
      <div className="mt-3 pt-2 border-t border-white/20">
        {creator && <p className="text-xs opacity-80 line-clamp-1">{creator}</p>}
        {year && <p className="text-[10px] opacity-60 mt-0.5">{year}</p>}
      </div>
      <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full opacity-20" style={{ background: p.accent }} />
    </div>
  );
}
