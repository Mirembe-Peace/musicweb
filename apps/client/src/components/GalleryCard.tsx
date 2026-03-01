import type { GalleryCategory, GalleryItem } from "@/data/gallery.mock";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageIcon } from "lucide-react";

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

function safeFirstImage(item: GalleryItem) {
  return item.images?.[0] ?? "/ashaba.png";
}
export default function GalleryCard({ item, onOpen }: Readonly<{ item: GalleryItem; onOpen: () => void }>) {
    const img = safeFirstImage(item);
  
    // vary aspect ratio a bit to get a “masonry-ish” feel without a masonry lib
    // const ratio =
    //   item.category === "poster"
    //     ? "aspect-[3/4]"
    //     : item.category === "culture"
    //       ? "aspect-4/5"
    //       : "aspect-16/10";
  
    return (
      <Card className="rounded-xl border bg-card shadow-sm overflow-hidden transition hover:-translate-y-0.5">
        <button type="button" onClick={onOpen} className="w-full text-left">
          <div className="relative">
            <div className="aspect-16/10 w-full bg-muted overflow-hidden">
              <img
                src={img}
                alt={item.title}
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/70 via-black/20 to-transparent">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className="rounded-full bg-background/80 text-foreground border"
                    variant="secondary"
                  >
                    {categoryLabel(item.category)}
                  </Badge>
                  {item.images.length > 1 && (
                    <Badge
                      className="rounded-full bg-background/80 text-foreground border"
                      variant="secondary"
                    >
                      {item.images.length} photos
                    </Badge>
                  )}
                </div>
                <div className="mt-2 font-black text-white">{item.title}</div>
                {item.dateLabel && (
                  <div className="text-xs text-white/80 mt-1">
                    {item.dateLabel}
                  </div>
                )}
              </div>
            </div>
          </div>

          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {item.description ? (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Tap to view.</p>
                )}
              </div>
              <div className="h-10 w-10 rounded-xl bg-muted grid place-items-center text-foreground/80">
                <ImageIcon className="h-4 w-4" />
              </div>
            </div>

          </CardContent>
        </button>
      </Card>
    );
  }