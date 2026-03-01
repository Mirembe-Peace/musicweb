import * as React from "react";
import { Button } from "@/components/ui/button";

export default function ProductGallery({
  images,
  title,
}: Readonly<{
  images: string[];
  title: string;
}>) {
  const safe = images?.length ? images : ["/images/placeholder.jpg"];
  const [active, setActive] = React.useState(0);

  const main = safe[Math.min(active, safe.length - 1)];

  return (
    <div className="grid gap-3 md:grid-cols-[96px_1fr]">
      {/* Thumbnails */}
      <div className="order-2 md:order-1">
        <div className="flex md:flex-col gap-2 overflow-auto md:overflow-visible">
          {safe.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setActive(idx)}
              className={[
                "relative shrink-0 rounded-2xl border overflow-hidden",
                "h-16 w-16 md:h-20 md:w-20",
                idx === active ? "ring-2 ring-ring" : "opacity-90 hover:opacity-100",
              ].join(" ")}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={src}
                alt={`${title} image ${idx + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main image */}
      <div className="order-1 md:order-2">
        <div className="relative overflow-hidden rounded-3xl border bg-muted">
          <div className="aspect-square md:aspect-4/3">
            <img
              src={main}
              alt={title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Cultural accent */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-r from-[hsl(var(--brand-green))] via-[hsl(var(--brand-yellow))] to-[hsl(var(--brand-red))]" />

          {/* Next/Prev for mobile quick taps */}
          {safe.length > 1 && (
            <div className="absolute inset-x-3 top-3 flex justify-between">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="rounded-2xl"
                onClick={() => setActive((p) => (p - 1 + safe.length) % safe.length)}
              >
                ←
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="rounded-2xl"
                onClick={() => setActive((p) => (p + 1) % safe.length)}
              >
                →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}