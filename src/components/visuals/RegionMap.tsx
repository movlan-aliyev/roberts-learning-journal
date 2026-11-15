"use client";

import { useEffect, useRef } from "react";

const SEA_MARKERS: { id: string; name: string; capital: string; lat: number; lng: number }[] = [
  { id: "myanmar", name: "Myanmar", capital: "Naypyidaw", lat: 19.7633, lng: 96.0785 },
  { id: "laos", name: "Laos", capital: "Vientiane", lat: 17.9757, lng: 102.6331 },
  { id: "vietnam", name: "Vietnam", capital: "Hanoi", lat: 21.0285, lng: 105.8542 },
  { id: "thailand", name: "Thailand", capital: "Bangkok", lat: 13.7563, lng: 100.5018 },
  { id: "cambodia", name: "Cambodia", capital: "Phnom Penh", lat: 11.5564, lng: 104.9282 },
  { id: "malaysia", name: "Malaysia", capital: "Kuala Lumpur", lat: 3.139, lng: 101.6869 },
  { id: "singapore", name: "Singapore", capital: "Singapore", lat: 1.3521, lng: 103.8198 },
  { id: "brunei", name: "Brunei", capital: "Bandar Seri Begawan", lat: 4.9031, lng: 114.9398 },
  { id: "indonesia", name: "Indonesia", capital: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { id: "philippines", name: "Philippines", capital: "Manila", lat: 14.5995, lng: 120.9842 },
];

export function RegionMapSEA({ highlight }: { highlight?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current) return;

      const markerIcon = L.divIcon({
        className: "",
        html: '<div style="width:12px;height:12px;background:#167D8D;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      const map = L.map(containerRef.current, {
        center: [8, 115],
        zoom: 4,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      SEA_MARKERS.forEach((m) => {
        const isHi = highlight === m.id;
        const marker = L.marker([m.lat, m.lng], {
          icon: isHi
            ? L.divIcon({
                className: "",
                html: '<div style="width:16px;height:16px;background:#c0392b;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              })
            : markerIcon,
        }).addTo(map);
        marker.bindPopup(`<strong>${m.name}</strong><br/>Capital: ${m.capital}`);
        if (isHi) marker.openPopup();
      });

      mapRef.current = map;
      setTimeout(() => map.invalidateSize(), 120);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [highlight]);

  return (
    <div className="my-6 rounded-xl border border-border dark:border-border-dark overflow-hidden">
      <div ref={containerRef} className="w-full h-[360px] sm:h-[420px] z-0 bg-[#c5dde8]" />
      <p className="text-xs text-muted px-3 py-2 border-t border-border dark:border-border-dark bg-white/80">
        Real map (OpenStreetMap) -- capitals of the ten Southeast Asian countries. Click a marker for details.
      </p>
    </div>
  );
}

export function RealMap({
  center = [20, 0] as [number, number],
  zoom = 2,
  markers = [] as { name: string; lat: number; lng: number; note?: string }[],
  heightClass = "h-[360px]",
  caption,
}: {
  center?: [number, number];
  zoom?: number;
  markers?: { name: string; lat: number; lng: number; note?: string }[];
  heightClass?: string;
  caption?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);
  const markersKey = JSON.stringify(markers);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !containerRef.current) return;

      const markerIcon = L.divIcon({
        className: "",
        html: '<div style="width:12px;height:12px;background:#167D8D;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      const map = L.map(containerRef.current, {
        center,
        zoom,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      const parsed = JSON.parse(markersKey) as { name: string; lat: number; lng: number; note?: string }[];
      parsed.forEach((m) => {
        L.marker([m.lat, m.lng], { icon: markerIcon })
          .addTo(map)
          .bindPopup(`<strong>${m.name}</strong>${m.note ? `<br/>${m.note}` : ""}`);
      });

      mapRef.current = map;
      setTimeout(() => map.invalidateSize(), 120);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [center, zoom, markersKey]);

  return (
    <div className="my-6 rounded-xl border border-border dark:border-border-dark overflow-hidden">
      <div ref={containerRef} className={`w-full ${heightClass} z-0 bg-[#c5dde8]`} />
      {caption && (
        <p className="text-xs text-muted px-3 py-2 border-t border-border dark:border-border-dark bg-white/80">
          {caption}
        </p>
      )}
    </div>
  );
}
