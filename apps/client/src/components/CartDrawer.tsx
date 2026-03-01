import type { CartLine, StoreCategory } from "@/data/store.mock";
import { initiatePayment } from "@/lib/api";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import React from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";


function formatUGX(n: number) {
    return `UGX ${n.toLocaleString()}`;
  }
  
  function categoryLabel(cat: StoreCategory) {
    if (cat === "song") return "Song";
    if (cat === "album") return "Album";
    return "Merch";
  }
  
export default function CartDrawer({
  cart,
  subtotal,
  onInc,
  onDec,
  onRemove,
  onClear,
}: Readonly <{
  cart: CartLine[];
  subtotal: number;
  onInc: (key: string) => void;
  onDec: (key: string) => void;
  onRemove: (key: string) => void;
  onClear: () => void;
}>) {
  // guest checkout fields (UI-only)
  const [name, setName] = React.useState("");
  const [emailOrPhone, setEmailOrPhone] = React.useState("");
  const [note, setNote] = React.useState("");
  

 
const startPayment = async () => {
    if (!emailOrPhone.trim()) {
      alert("Please enter your email or phone number");
      return;
    }
    try {
      const data = await initiatePayment({
        amount: subtotal,
        currency: "UGX",
        description: `Store purchase (${cart.length} item(s))`,
        email: emailOrPhone.includes("@") ? emailOrPhone : "",
        phoneNumber: emailOrPhone.includes("@") ? "" : emailOrPhone,
        callbackUrl: `${window.location.origin}/payment-success`,
      });

      if (data.redirect_url) {
        globalThis.location.href = data.redirect_url;
      } else {
        alert("Failed to initiate payment");
      }
    } catch {
      alert("Error initiating payment. Please try again.");
    }
  };

  return (
    <div className="backdrop-blur-sm bg-white/30 dark:bg-black/30 text-white  flex h-full flex-col">
      <div className="p-5">
        <SheetHeader>
          <SheetTitle className="text-xl font-black">Your cart</SheetTitle>
        </SheetHeader>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {cart.length === 0 ? "Cart is empty" : `${cart.length} line(s)`}
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="rounded-2xl"
            onClick={onClear}
            disabled={cart.length === 0}
            title={cart.length === 0 ? "Nothing to clear" : "Clear cart"}
          >
            Clear
          </Button>
        </div>
      </div>

      <Separator />

      {/* Items */}
      <div className="flex-1 overflow-auto p-5 space-y-3">
        {cart.length === 0 ? (
          <div className="rounded-3xl border bg-muted/30 p-6 text-sm text-muted-foreground">
            Add songs, albums, or merch to start checkout.
          </div>
        ) : (
          cart.map((line) => (
            <div key={line.key} className="rounded-3xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-extrabold text-foreground truncate">
                    {line.item.title}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    {categoryLabel(line.item.category)} •{" "}
                    {formatUGX(line.unitPriceUGX)}
                  </div>

                  {/* Selected variants */}
                  {Object.keys(line.selected).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(line.selected).map(([k, v]) => (
                        <Badge
                          key={`${line.key}-${k}`}
                          variant="secondary"
                          className="rounded-full"
                        >
                          {k}: {v}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-2xl"
                  onClick={() => onRemove(line.key)}
                >
                  Remove
                </Button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-2xl"
                    onClick={() => onDec(line.key)}
                  >
                    −
                  </Button>
                  <div className="min-w-10 text-center font-black text-foreground">
                    {line.qty}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-2xl"
                    onClick={() => onInc(line.key)}
                  >
                    +
                  </Button>
                </div>

                <div className="font-black text-foreground">
                  {formatUGX(line.qty * line.unitPriceUGX)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Separator />

      {/* Summary + Guest checkout */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-muted-foreground">
            Subtotal
          </div>
          <div className="text-lg font-black text-foreground">
            {formatUGX(subtotal)}
          </div>
        </div>

        <div className="rounded-3xl border bg-muted/30 p-4">
          <div className="font-black text-foreground">Guest checkout</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Enter details so we can send your receipt + download link (music) or
            confirmation (merch).
          </p>

          <div className="mt-3 grid gap-3">
            <Input
              className="rounded-2xl"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="rounded-2xl"
              placeholder="Email or phone (for Mobile Money)"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
            <Input
              className="rounded-2xl"
              placeholder="Note (optional) e.g. T-shirt size notes"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <Button
          className="w-full rounded-2xl"
          disabled={cart.length === 0 || !emailOrPhone.trim()}
          onClick={startPayment}
        >
          Pay & Checkout
        </Button>

        <div className="h-2 w-full rounded-full bg-linear-to-r from-[hsl(var(--brand-green))] via-[hsl(var(--brand-yellow))] to-[hsl(var(--brand-red))]" />
      </div>
    </div>
  );
}