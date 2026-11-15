"use client";
import { useState, type ReactNode } from "react";

interface Tab { id: string; label: string; content: ReactNode; }

export function Tabs({ tabs, defaultTab }: { tabs: Tab[]; defaultTab?: string }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);

  return (
    <div>
      <div className="flex border-b border-border dark:border-border-dark mb-4 overflow-x-auto" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
              active === tab.id
                ? "border-teal text-teal"
                : "border-transparent text-muted hover:text-ink dark:hover:text-ink-light"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tabs.find(t => t.id === active)?.content}
      </div>
    </div>
  );
}
