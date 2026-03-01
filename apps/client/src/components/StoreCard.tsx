import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Music, Disc, Package } from "lucide-react";
import type { StoreCategory, StoreItem } from "@/data/store.mock";
function formatUGX(n: number) {
    return `UGX ${n.toLocaleString()}`;
  }
  
  function categoryLabel(cat: StoreCategory) {
    if (cat === "song") return "Song";
    if (cat === "album") return "Album";
    return "Merch";
  }
  
function StoreCard({
  item,
  onAdd,
  onView,
}: Readonly<{
  item: StoreItem;
  onAdd: () => void;
  onView: () => void;
}>) {
  const primary = item.images?.[0];

  return (
    <Card className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <CardContent className="p-6">
        {/* Image */}
        <button type="button" onClick={onView} className="w-full text-left">
          <div className="mb-4 overflow-hidden rounded-xl border bg-muted">
            <div className="aspect-16/10">
              {primary ? (
                <img src={primary} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="h-full w-full grid place-items-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>
          </div>
        </button>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                {categoryLabel(item.category)}
              </Badge>
              {item.tags?.slice(0, 2).map((t) => (
                <Badge key={t} variant="secondary" className="rounded-full">
                  {t}
                </Badge>
              ))}
              {item.variants?.length ? (
                <Badge variant="secondary" className="rounded-full">
                  Variants
                </Badge>
              ) : null}
            </div>

            <div className="mt-3 text-xl font-black tracking-tight text-foreground truncate">
              {item.title}
            </div>

            {item.subtitle && (
              <div className="mt-1 text-sm text-muted-foreground">{item.subtitle}</div>
            )}
          </div>

          <div className="h-12 w-12 rounded-xl bg-muted grid place-items-center text-foreground/80">
            {item.category === "song" ? <Music className="h-5 w-5" /> : item.category === "album" ? <Disc className="h-5 w-5" /> : <Package className="h-5 w-5" />}
          </div>
        </div>

        <Separator className="my-5" />

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-muted-foreground">From</div>
            <div className="text-lg font-black text-foreground">{formatUGX(item.priceUGX)}</div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={onView}>
              View
            </Button>
            <Button onClick={onAdd}>
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default StoreCard;