import * as React from "react";
import type { VideoItem } from "@/data/videos.mock";
import { toThumbnailUrl } from "@/lib/video";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import InlineVideoPlayer, { type InlineVideoPlayerHandle } from "@/components/InlineVideoPlayer";

export default function VideoCard({
  item,
  isActive,
  onPlay,
  onCopy,
  onExpand,
  playerRef,
}: Readonly<{
  item: VideoItem;
  isActive: boolean;
  onPlay: () => void;
  onCopy: () => void;
  onExpand: () => void;
  playerRef: React.RefObject<InlineVideoPlayerHandle | null>;
}>) {
  const thumb = toThumbnailUrl(item.url);

  return (
    <Card className="rounded-3xl border bg-card shadow-sm overflow-hidden transition hover:-translate-y-0.5">
      {/* Thumbnail or inline player */}
      <div className="relative">
        <div className="aspect-video bg-muted">
          {isActive ? (
            <InlineVideoPlayer
              ref={playerRef as any}
              url={item.url}
              className="h-full w-full"
            />
          ) : thumb ? (
            <img src={thumb} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="h-full w-full grid place-items-center">
              <div className="rounded-2xl border bg-background/70 px-4 py-2 text-sm font-extrabold">
                {item.platform === "vimeo" ? "Vimeo video" : "Video"}
              </div>
            </div>
          )}
        </div>

        {/* Click-to-play overlay (only when not active) */}
        {!isActive && (
          <button
            type="button"
            onClick={onPlay}
            className="absolute inset-0 grid place-items-center"
            aria-label="Play video"
          >
            <div className="relative">
              <span className="absolute inset-0 -m-5 rounded-full bg-[hsl(var(--brand-red))]/20 animate-ping" />
              <span className="absolute inset-0 -m-8 rounded-full bg-[hsl(var(--brand-red))]/10 animate-ping [animation-delay:250ms]" />
              <div className="relative h-14 w-14 rounded-2xl bg-[hsl(var(--brand-red))] grid place-items-center shadow-sm">
                <span className="text-white text-2xl leading-none">▶</span>
              </div>
            </div>
          </button>
        )}

        {/* small chip */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur px-3 py-1 text-xs font-bold">
          <span className="h-2 w-2 rounded-full bg-primary" />
          {isActive ? "Playing" : "Play"}
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-black text-foreground truncate">{item.title}</div>
            {item.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
          <div className="h-10 w-10 rounded-2xl bg-muted grid place-items-center font-black text-foreground/80">
            ▶
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              {item.platform === "youtube" ? "YouTube" : "Vimeo"}
            </Badge>
            {item.dateLabel && (
              <Badge variant="secondary" className="rounded-full">
                {item.dateLabel}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-2xl"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCopy();
              }}
            >
              Copy
            </Button>

            {/* Expand appears when playing inline */}
            {isActive && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-2xl"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onExpand();
                }}
                title="Cinematic view"
              >
                ⤢
              </Button>
            )}

            <div className="h-2 w-10 rounded-full bg-linear-to-r from-[hsl(var(--brand-green))] via-[hsl(var(--brand-yellow))] to-[hsl(var(--brand-red))]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}