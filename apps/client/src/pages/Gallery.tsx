import * as React from "react";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import Masonry from "react-masonry-css";
import { galleryItems, type GalleryItem, type GalleryCategory } from "@/data/gallery.mock";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import GalleryCard from "@/components/GalleryCard";

type Filter = "ALL" | GalleryCategory;

function categoryLabel(c: GalleryCategory) {
  switch (c) {
    case "photo":
      return "Photos";
    case "poster":
      return "Posters";
    case "bts":
      return "Behind the Scenes";
    case "live":
      return "Live";
    case "culture":
      return "Culture";
  }
}


export default function Gallery() {
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("ALL");

  // lightbox
  const [open, setOpen] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState<GalleryItem | null>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);

  const items = React.useMemo(() => {
    const query = q.trim().toLowerCase();

    return galleryItems.filter((g) => {
      const matchesFilter = filter === "ALL" ? true : g.category === filter;

      const matchesQuery =
        !query ||
        g.title.toLowerCase().includes(query) ||
        (g.description || "").toLowerCase().includes(query) ||
        (g.tags || []).some((t) => t.toLowerCase().includes(query));

      return matchesFilter && matchesQuery;
    });
  }, [q, filter]);

  function openLightbox(item: GalleryItem, idx = 0) {
    setActiveItem(item);
    setActiveIdx(idx);
    setOpen(true);
  }

  function next() {
    if (!activeItem) return;
    setActiveIdx((p) => (p + 1) % activeItem.images.length);
  }

  function prev() {
    if (!activeItem) return;
    setActiveIdx((p) => (p - 1 + activeItem.images.length) % activeItem.images.length);
  }

  const activeSrc =
    activeItem?.images?.length ? activeItem.images[Math.min(activeIdx, activeItem.images.length - 1)] : null;

  return (
    <Container>
      <div className="py-10">
        <SectionTitle
          eyebrow="Gallery"
          title="Photos, posters & culture"
          subtitle="Explore visuals from performances, studio moments, and cultural storytelling."
        />

        {/* Controls */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search gallery…"
            />
          </div>

          <div>
            <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="photo">Photos</SelectItem>
                <SelectItem value="poster">Posters</SelectItem>
                <SelectItem value="bts">Behind the Scenes</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="culture">Culture</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
<div className="mt-6">
  {items.length === 0 ? (
    <Card className="rounded-xl border bg-card shadow-sm">
      <CardContent className="p-6 text-sm text-muted-foreground">
        No gallery items match your search.
      </CardContent>
    </Card>
  ) : (
    <Masonry
      breakpointCols={{ default: 3, 1024: 3, 768: 2, 640: 1 }}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {items.map((item) => (
        <GalleryCard key={item.id} item={item} onOpen={() => openLightbox(item, 0)} />
      ))}
    </Masonry>
  )}
</div>

        {/* Lightbox modal */}
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) {
              setActiveItem(null);
              setActiveIdx(0);
            }
          }}
        >
          <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
            <div className="p-5">
              <DialogHeader>
                <DialogTitle className="text-lg font-black">{activeItem?.title ?? "Preview"}</DialogTitle>
              </DialogHeader>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {activeItem?.category && (
                  <Badge variant="secondary" className="rounded-full">
                    {categoryLabel(activeItem.category)}
                  </Badge>
                )}
                {activeItem?.dateLabel && (
                  <Badge variant="secondary" className="rounded-full">
                    {activeItem.dateLabel}
                  </Badge>
                )}

                <div className="ml-auto flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={prev}
                    disabled={!activeItem || activeItem.images.length < 2}
                    title="Previous"
                  >
                    ←
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={next}
                    disabled={!activeItem || activeItem.images.length < 2}
                    title="Next"
                  >
                    →
                  </Button>
                </div>
              </div>

              {activeItem?.description && (
                <p className="mt-3 text-sm text-muted-foreground">{activeItem.description}</p>
              )}
            </div>

            <Separator />

            <div className="bg-black">
              {activeSrc ? (
                <div className="relative w-full h-[60vh]">
                  <img
                    src={activeSrc}
                    alt={activeItem?.title ?? "Gallery image"}
                    className="absolute inset-0 h-full w-full object-contain"
                    loading="eager"
                  />
                </div>
              ) : (
                <div className="p-6 text-sm text-muted-foreground bg-card">
                  This item has no image.
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {activeItem?.images?.length ? (
              <div className="p-4 bg-card">
                <div className="flex gap-2 overflow-auto">
                  {activeItem.images.map((src, idx) => (
                    <button
                      key={`${src}-${idx}`}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      className={[
                        "shrink-0 rounded-xl border overflow-hidden",
                        "h-16 w-16",
                        idx === activeIdx ? "ring-2 ring-ring" : "opacity-90 hover:opacity-100",
                      ].join(" ")}
                      aria-label={`Open image ${idx + 1}`}
                    >
                      <img src={src} alt={`Thumb ${idx + 1}`} className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
}

