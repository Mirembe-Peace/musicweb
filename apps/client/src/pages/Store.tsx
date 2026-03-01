import * as React from "react";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { storeItems, type CartLine, type StoreCategory, type StoreItem } from "@/data/store.mock";
import CartDrawer from "@/components/CartDrawer";
import StoreCard from "@/components/StoreCard";
import ProductQuickView from "@/components/ProductQuickView";
//import PaymentModal from "@/components/PaymentModal";


function buildDefaultSelection(item: StoreItem): Record<string, string> {
  const selected: Record<string, string> = {};
  (item.variants || []).forEach((v) => {
    const first = v.values?.[0]?.value;
    if (first) selected[v.name] = first;
  });
  return selected;
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

function cartKey(itemId: string, selected: Record<string, string>) {
  const parts = Object.keys(selected)
    .sort(
      (a, b) => a.localeCompare(b)
    )
    .map((k) => `${k}:${selected[k]}`);
  return `${itemId}__${parts.join("|")}`;
}

export default function Store() {
  const [q, setQ] = React.useState("");
  const [tab, setTab] = React.useState<"all" | StoreCategory>("all");

  const [cartOpen, setCartOpen] = React.useState(false);
  const [cart, setCart] = React.useState<CartLine[]>([]);

  // Quick view modal
  const [quickOpen, setQuickOpen] = React.useState(false);
  const [quickItem, setQuickItem] = React.useState<StoreItem | null>(null);
  const [quickSelected, setQuickSelected] = React.useState<Record<string, string>>({});

  const items = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return storeItems.filter((p) => {
      const matchesTab = tab === "all" ? true : p.category === tab;
      const matchesQuery =
        !query ||
        p.title.toLowerCase().includes(query) ||
        (p.subtitle || "").toLowerCase().includes(query) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(query));

      return matchesTab && matchesQuery;
    });
  }, [q, tab]);

  const cartCount = React.useMemo(() => cart.reduce((a, c) => a + c.qty, 0), [cart]);
  const subtotal = React.useMemo(() => cart.reduce((a, c) => a + c.qty * c.unitPriceUGX, 0), [cart]);

  function openQuick(item: StoreItem) {
    setQuickItem(item);
    setQuickSelected(buildDefaultSelection(item));
    setQuickOpen(true);
  }

  function addToCart(item: StoreItem, selected?: Record<string, string>) {
    const sel = selected ?? buildDefaultSelection(item);
    const key = cartKey(item.id, sel);
    const unit = computeUnitPrice(item, sel);

    setCart((prev) => {
      const idx = prev.findIndex((x) => x.key === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { key, item, qty: 1, selected: sel, unitPriceUGX: unit }];
    });

    toast.success("Added to cart", { description: item.title });
  }

  function inc(key: string) {
    setCart((prev) => prev.map((x) => (x.key === key ? { ...x, qty: x.qty + 1 } : x)));
  }

  function dec(key: string) {
    setCart((prev) => prev.map((x) => (x.key === key ? { ...x, qty: Math.max(1, x.qty - 1) } : x)));
  }

  function remove(key: string) {
    setCart((prev) => prev.filter((x) => x.key !== key));
  }

  function clearCart() {
    setCart([]);
    toast.message("Cart cleared");
  }

  return (
    <Container>
      <div className="py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow="Store"
            title="Buy music & merch"
            subtitle="Guests can add multiple items to cart and checkout together. Variants supported (format, size, color)."
          />

          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button>
                Cart
                {cartCount > 0 && (
                  <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-2 text-xs font-black text-secondary-foreground">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-lg p-0">
              <CartDrawer
                cart={cart}
                subtotal={subtotal}
                onInc={inc}
                onDec={dec}
                onRemove={remove}
                onClear={clearCart}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Controls */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search songs, albums or merch…"
            />
          </div>

          <div className="flex justify-start md:justify-end">
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as never)}
              className="w-full md:w-auto"
            >
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="all">
                  All
                </TabsTrigger>
                <TabsTrigger value="song">
                  Songs
                </TabsTrigger>
                <TabsTrigger value="album">
                  Albums
                </TabsTrigger>
                <TabsTrigger value="merch">
                  Merch
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <StoreCard
              key={p.id}
              item={p}
              onView={() => openQuick(p)}
              onAdd={() => {
                // If product has variants, force selection via quick view
                if (p.variants?.length) openQuick(p);
                else addToCart(p);
              }}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 rounded-xl border bg-muted/30 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm font-extrabold text-foreground">
                Buying supports the music
              </div>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
               Cart Details 
              </p>
            </div>

            <div className="flex gap-3">
            <Button
              variant="secondary"
              disabled={cartCount === 0}
              title={cartCount === 0 ? "Add items first" : "Open cart"}
              onClick={() => setCartOpen(true)}
            >
              Checkout
            </Button>

              
            </div>
          </div>
        </div>

        {/* Quick View */}
        <ProductQuickView
          open={quickOpen}
          onOpenChange={setQuickOpen}
          item={quickItem}
          selected={quickSelected}
          onChangeSelected={setQuickSelected}
          onAdd={() => {
            if (!quickItem) return;
            addToCart(quickItem, quickSelected);
            setQuickOpen(false);
          }}
        />
      </div>
    </Container>
  );
}
