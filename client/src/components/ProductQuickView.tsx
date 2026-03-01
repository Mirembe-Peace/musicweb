import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { StoreItem } from "@/data/store.mock";
import ProductGallery from "./ProductGallery";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

function formatUGX(n: number) {
  return `UGX ${n.toLocaleString()}`;
}

function computeUnitPrice(item: StoreItem, selected: Record<string, string>) {
    let price = item.priceUGX;
    for (const v of item.variants || []) {
      const chosen = selected[v.name];
      const vv = v.values.find((x) => x.value === chosen);
      if (vv?.priceDeltaUGX) price += vv.priceDeltaUGX;
    }
    return price;
  }

export default function ProductQuickView({
    open,
    onOpenChange,
    item,
    selected,
    onChangeSelected,
    onAdd,
  }: Readonly<{
    open: boolean;
    onOpenChange: (v: boolean) => void;
    item: StoreItem | null;
    selected: Record<string, string>;
    onChangeSelected: (next: Record<string, string>) => void;
    onAdd: () => void;
  }>) {
    if (!item) return null;
  
    const images = item.images?.length ? item.images : ["/images/placeholder.jpg"];
    const unit = computeUnitPrice(item, selected);
  
    // validate required variants selected
    const missingRequired = (item.variants || []).some((v) => (v.required ?? true) && !selected[v.name]);
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl rounded-3xl p-0 overflow-hidden">
          <div className="p-5">
            <DialogHeader>
              <DialogTitle className="text-xl font-black">{item.title}</DialogTitle>
            </DialogHeader>
  
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                {item.category.toUpperCase()}
              </Badge>
              {item.subtitle && (
                <Badge variant="secondary" className="rounded-full">
                  {item.subtitle}
                </Badge>
              )}
              {item.tags?.slice(0, 3).map((t) => (
                <Badge key={t} variant="secondary" className="rounded-full">
                  {t}
                </Badge>
              ))}
  
              <div className="ml-auto font-black text-foreground">{formatUGX(unit)}</div>
            </div>
          </div>
  
          <Separator />
  
          <div className="p-5 grid gap-5 md:grid-cols-2">
            <ProductGallery images={images} title={item.title} />
  
            <div className="space-y-4">
              {!!item.variants?.length && (
                <div className="rounded-3xl border bg-muted/30 p-4">
                  <div className="font-black text-foreground">Choose options</div>
                  <div className="mt-3 grid gap-3">
                    {item.variants.map((v) => (
                      <div key={v.name}>
                        <div className="text-xs font-bold text-muted-foreground">
                          {v.name} {(v.required ?? true) ? "*" : ""}
                        </div>
  
                        <Select
                          value={selected[v.name] ?? ""}
                          onValueChange={(val) => onChangeSelected({ ...selected, [v.name]: val })}
                        >
                          <SelectTrigger className="mt-2 rounded-2xl">
                            <SelectValue placeholder={`Select ${v.name}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {v.values.map((vv) => (
                              <SelectItem key={vv.value} value={vv.value}>
                                {vv.value}
                                {vv.priceDeltaUGX ? ` (+${formatUGX(vv.priceDeltaUGX)})` : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
  
              <div className="rounded-3xl border bg-card p-4">
                <div className="text-xs font-bold text-muted-foreground">Price</div>
                <div className="mt-1 text-2xl font-black text-foreground">{formatUGX(unit)}</div>
  
                <Button
                  className="mt-4 w-full rounded-2xl"
                  onClick={onAdd}
                  disabled={missingRequired}
                  title={missingRequired ? "Please select required options" : "Add to cart"}
                >
                  Add to cart
                </Button>
  
                <div className="mt-4 h-2 w-full rounded-full bg-linear-to-r from-[hsl(var(--brand-green))] via-[hsl(var(--brand-yellow))] to-[hsl(var(--brand-red))]" />
              </div>
  
              <div className="rounded-3xl border bg-muted/30 p-4">
                <div className="font-black text-foreground">Delivery</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.category === "merch"
                    ? "Merch: we’ll confirm delivery details after payment."
                    : "Digital: after payment, you’ll receive a secure download link."}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
