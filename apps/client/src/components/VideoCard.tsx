import * as React from "react";
import type { VideoItem } from "@/data/videos.mock";
import { toThumbnailUrl } from "@/lib/video";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Copy, Maximize2 } from "lucide-react";

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
    <Card className="rounded-xl border bg-card shadow-sm overflow-hidden transition hover:-translate-y-0.5">
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
              <div className="rounded-xl border bg-background/70 px-4 py-2 text-sm font-extrabold">
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
            <div className="h-14 w-14 rounded-xl bg-destructive grid place-items-center shadow-md">
              <Play className="h-6 w-6 text-white fill-white" />
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
          <div className="h-10 w-10 rounded-xl bg-muted grid place-items-center text-foreground/80">
            <Play className="h-4 w-4" />
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCopy();
              }}
            >
              <Copy className="h-3.5 w-3.5 mr-1" />
              Copy
            </Button>

            {/* Expand appears when playing inline */}
            {isActive && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onExpand();
                }}
                title="Cinematic view"
              >
                <Maximize2 className="h-3.5 w-3.5 mr-1" />
                Expand
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}