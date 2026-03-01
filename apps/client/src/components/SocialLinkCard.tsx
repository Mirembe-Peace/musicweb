"use client";

import { cn } from "@/lib/utils";

type SocialLinkCardProps = {
  name: string;
  href: string;
  icon: string; // e.g. "/icons/instagram.svg"
  color: string; // brand color
};

export default function SocialLinkCard({
  name,
  href,
  icon,
  color,
}: Readonly<SocialLinkCardProps>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center gap-4 rounded-xl px-5 py-4",
        "border transition-all duration-200",
        "hover:shadow-md",
        "bg-card border-border text-card-foreground"
      )}
      style={{ borderLeft: `4px solid ${color}` }}
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-lg grid place-items-center">
        <img
          src={icon}
          alt={name}
          className={cn(
            "w-5 h-5 transition-opacity",
            // In light mode: keep original icon colors if any
            // In dark mode: ensure visibility for dark/black svgs by inverting
            "dark:[filter:invert(1)]"
          )}
        />
      </div>

      {/* Name */}
      <span className="flex-1 font-medium">{name}</span>

      {/* Brand dot */}
      <span
        className="w-2 h-2 rounded-full opacity-80 group-hover:opacity-100"
        style={{ backgroundColor: color }}
      />
    </a>
  );
}