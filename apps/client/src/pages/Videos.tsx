import * as React from "react";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";

import { videos as mockVideos, type VideoItem } from "@/data/videos.mock";
import { detectPlatform, toEmbedUrl } from "@/lib/video";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";

import { toast } from "sonner";
import VideoCard from "@/components/VideoCard";
import type { InlineVideoPlayerHandle } from "@/components/InlineVideoPlayer";

type PlatformFilter = "ALL" | "youtube" | "vimeo";

export default function Videos() {
  const [q, setQ] = React.useState("");
  const [platform, setPlatform] = React.useState<PlatformFilter>("ALL");

  // inline playback
  const [activeInlineId, setActiveInlineId] = React.useState<string | null>(null);

  // cinematic modal
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<VideoItem | null>(null);
  const [startAt, setStartAt] = React.useState(0);

  // keep one ref per currently-playing card
  const playerRef = React.useRef<InlineVideoPlayerHandle | null>(null);

  const items = React.useMemo(() => {
    const normalized = mockVideos.map((v) => ({
      ...v,
      platform: (v.platform || detectPlatform(v.url)) as any,
    }));

    const query = q.trim().toLowerCase();

    return normalized.filter((v) => {
      const matchesQuery =
        !query ||
        v.title.toLowerCase().includes(query) ||
        (v.description || "").toLowerCase().includes(query);

      const matchesPlatform = platform === "ALL" || v.platform === platform;

      return matchesQuery && matchesPlatform;
    });
  }, [q, platform]);

  function playInline(v: VideoItem) {
    setOpen(false);
    setActive(null);
    setStartAt(0);

    // start playing inline inside the card viewbox
    setActiveInlineId(v.id);
  }

  async function expandFromInline(v: VideoItem) {
    // read current time from inline player, pause it, then open modal from that time
    const t = await playerRef.current?.getCurrentTime?.();
    const seconds = Math.max(0, Math.floor(t ?? 0));

    await playerRef.current?.pause?.();

    setActive(v);
    setStartAt(seconds);
    setOpen(true);
  }

  const embedUrl = React.useMemo(() => {
    if (!active) return null;
    return toEmbedUrl(active.url, { autoplay: true, start: startAt });
  }, [active, startAt]);

  return (
    <Container>
      <div className="py-10">
        <SectionTitle
          eyebrow="Videos"
          title="Performances & visuals"
          subtitle="First tap plays inline. Use Expand for cinematic view — it continues where you left off."
        />

        {/* Controls */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search videos…"
            />
          </div>
          <div>
            <Select value={platform} onValueChange={(v) => setPlatform(v as PlatformFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All platforms</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="vimeo">Vimeo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 ? (
            <Card className="sm:col-span-2 lg:col-span-3 rounded-xl border bg-card shadow-sm">
              <CardContent className="p-6 text-sm text-muted-foreground">
                No videos match your search.
              </CardContent>
            </Card>
          ) : (
            items.map((v) => (
              <VideoCard
                key={v.id}
                item={v}
                isActive={activeInlineId === v.id}
                playerRef={activeInlineId === v.id ? playerRef : ({ current: null } as any)}
                onPlay={() => playInline(v)}
                onCopy={() => copyLink(v.url)}
                onExpand={() => expandFromInline(v)}
              />
            ))
          )}
        </div>

        {/* Cinematic Modal */}
        <Dialog
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            if (!val) {
              setActive(null);
              setStartAt(0);
            }
          }}
        >
          <DialogContent className="p-0 overflow-hidden sm:max-w-5xl">
            <div className="p-5">
              <DialogHeader>
                <DialogTitle className="text-lg font-black">{active?.title}</DialogTitle>
              </DialogHeader>

              {active?.description && (
                <p className="mt-2 text-sm text-muted-foreground">{active.description}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {active?.platform && (
                  <Badge variant="secondary" className="rounded-full">
                    {active.platform === "youtube" ? "YouTube" : "Vimeo"}
                  </Badge>
                )}

                <div className="ml-auto flex flex-wrap gap-2">
                  {active?.url && (
                    <Button variant="secondary" onClick={() => copyLink(active.url)}>
                      Copy link
                    </Button>
                  )}
                  {active?.url && (
                    <Button asChild>
                      <a href={active.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="bg-black flex-1">
              {embedUrl ? (
                <div className="relative w-full aspect-video">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={embedUrl}
                    title={active?.title || "Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="p-6 text-sm text-muted-foreground bg-card">
                  This video link can’t be embedded. Use “Open” to watch it.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
}

function copyLink(url: string) {
  navigator.clipboard
    .writeText(url)
    .then(() => toast.success("Link copied"))
    .catch(() => toast.error("Failed to copy link"));
}