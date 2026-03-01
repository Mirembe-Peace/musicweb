import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  songs: Array<{ id: string; title: string; price: number }>;
}

export default function CheckoutDialog({
  open,
  onOpenChange,
  songs,
}: CheckoutDialogProps) {
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const total = songs.reduce((sum, s) => sum + Number(s.price), 0);

  const handlePurchase = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/purchases/initiate", {
        songIds: songs.map((s) => s.id),
        email,
        phoneNumber: phone || undefined,
        callbackUrl: window.location.origin + "/payment-success",
      });

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to initiate purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-black">Buy Music</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="rounded-2xl border bg-muted/30 p-4">
            <div className="text-sm font-bold text-muted-foreground">
              Your order
            </div>
            {songs.map((s) => (
              <div
                key={s.id}
                className="mt-2 flex justify-between text-sm"
              >
                <span className="font-semibold truncate">{s.title}</span>
                <span>UGX {Number(s.price).toLocaleString()}</span>
              </div>
            ))}
            <div className="mt-3 border-t pt-2 flex justify-between font-black">
              <span>Total</span>
              <span>UGX {total.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="checkout-email">Email</Label>
            <Input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="rounded-2xl"
            />
          </div>

          <div>
            <Label htmlFor="checkout-phone">Phone (optional)</Label>
            <Input
              id="checkout-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="256..."
              className="rounded-2xl"
            />
          </div>

          <Button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full rounded-2xl"
          >
            {loading ? "Processing..." : `Pay UGX ${total.toLocaleString()}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
