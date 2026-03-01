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

interface TicketPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  concert: {
    id: string;
    title: string;
    dateTime: string;
    location: string;
    price: number;
  } | null;
}

export default function TicketPurchaseDialog({
  open,
  onOpenChange,
  concert,
}: TicketPurchaseDialogProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  if (!concert) return null;

  const handlePurchase = async () => {
    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/tickets/purchase", {
        concertId: concert.id,
        buyerName: name,
        buyerEmail: email,
        buyerPhone: phone || undefined,
        callbackUrl: window.location.origin + "/payment-success",
      });

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to initiate ticket purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-black">Buy Ticket</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="font-black text-lg">{concert.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {concert.dateTime} &bull; {concert.location}
            </div>
            <div className="mt-2 font-black text-primary">
              UGX {Number(concert.price).toLocaleString()}
            </div>
          </div>

          <div>
            <Label htmlFor="ticket-name">Full Name</Label>
            <Input
              id="ticket-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div>
            <Label htmlFor="ticket-email">Email</Label>
            <Input
              id="ticket-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="ticket-phone">Phone (optional)</Label>
            <Input
              id="ticket-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="256..."
            />
          </div>

          <Button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full"
          >
            {loading
              ? "Processing..."
              : `Pay UGX ${Number(concert.price).toLocaleString()}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
