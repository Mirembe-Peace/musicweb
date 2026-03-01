import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function TipDialog() {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const presets = [2000, 5000, 10000, 20000];

  const handleSend = async () => {
    const tipAmount = Number(amount);
    if (!tipAmount || tipAmount < 500) {
      toast.error("Minimum tip is UGX 500");
      return;
    }
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/payments/tip", {
        amount: tipAmount,
        email,
        phoneNumber: phone || undefined,
        callbackUrl: window.location.origin + "/payment-success",
      });

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to initiate tip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="hidden sm:inline-flex rounded-2xl bg-[hsl(var(--brand-red))] hover:bg-[hsl(var(--brand-red))]/90 text-white"
        >
          Send Tip
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-black">Send a Tip</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <Label className="text-sm font-bold">Quick amounts (UGX)</Label>
            <div className="mt-2 flex gap-2 flex-wrap">
              {presets.map((p) => (
                <Button
                  key={p}
                  variant={Number(amount) === p ? "default" : "outline"}
                  size="sm"
                  className="rounded-2xl"
                  onClick={() => setAmount(String(p))}
                >
                  {p.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="tip-amount">Amount (UGX)</Label>
            <Input
              id="tip-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="rounded-2xl"
            />
          </div>

          <div>
            <Label htmlFor="tip-email">Email</Label>
            <Input
              id="tip-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="rounded-2xl"
            />
          </div>

          <div>
            <Label htmlFor="tip-phone">Phone (optional)</Label>
            <Input
              id="tip-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="256..."
              className="rounded-2xl"
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={loading}
            className="w-full rounded-2xl"
          >
            {loading ? "Processing..." : `Send UGX ${Number(amount || 0).toLocaleString()}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
