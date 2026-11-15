"use client";
import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const padClasses = { none: "", sm: "p-3", md: "p-5", lg: "p-8" };

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, padding = "md", className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-white dark:bg-[#222] rounded-xl border border-border dark:border-border-dark ${hoverable ? "card-hover cursor-pointer" : ""} ${padClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";
