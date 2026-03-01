import * as React from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Ticket {
  id: string;
  concertId: string;
  buyerName: string;
  buyerEmail: string;
  ticketCode: string;
  status: string;
  purchasedAt: string | null;
  createdAt: string;
}

export default function AdminTickets() {
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [verifyCode, setVerifyCode] = React.useState("");
  const [verifyResult, setVerifyResult] = React.useState<any>(null);
  const [verifying, setVerifying] = React.useState(false);

  const fetchTickets = async () => {
    try {
      const { data } = await api.get("/tickets");
      setTickets(data);
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTickets();
  }, []);

  const handleVerify = async () => {
    if (!verifyCode.trim()) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const { data } = await api.get(`/tickets/verify/${verifyCode.trim()}`);
      setVerifyResult(data);
    } catch {
      toast.error("Ticket not found");
    } finally {
      setVerifying(false);
    }
  };

  const handleMarkUsed = async (ticketCode: string) => {
    try {
      await api.post(`/tickets/mark-used/${ticketCode}`);
      toast.success("Ticket marked as used");
      setVerifyResult(null);
      setVerifyCode("");
      fetchTickets();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to mark ticket");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "USED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Tickets</h2>
        <p className="text-sm text-muted-foreground">
          Verify and manage concert tickets
        </p>
      </div>

      {/* Verify section */}
      <Card>
        <CardContent className="p-6">
          <div className="font-bold text-sm mb-3">Verify Ticket</div>
          <div className="flex gap-3">
            <Input
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="Enter ticket code (e.g. TKT-ABCD1234)"
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            />
            <Button
              onClick={handleVerify}
              disabled={verifying}
            >
              {verifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
          </div>

          {verifyResult && (
            <div className="mt-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-black">{verifyResult.buyerName}</div>
                  {verifyResult.concert && (
                    <div className="text-sm text-muted-foreground">
                      {verifyResult.concert.title} &bull;{" "}
                      {verifyResult.concert.dateTime}
                    </div>
                  )}
                </div>
                <Badge className={statusColor(verifyResult.status)}>
                  {verifyResult.status}
                </Badge>
              </div>

              {verifyResult.valid && (
                <Button
                  onClick={() => handleMarkUsed(verifyCode.trim())}
                  className="mt-3 w-full"
                  variant="default"
                >
                  Mark as Used
                </Button>
              )}

              {!verifyResult.valid && (
                <p className="mt-3 text-sm text-destructive font-semibold">
                  This ticket is not valid for entry (status:{" "}
                  {verifyResult.status})
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tickets list */}
      <div>
        <div className="font-medium text-xs text-muted-foreground mb-2">
          All Tickets ({tickets.length})
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tickets.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No tickets yet
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {tickets.map((t) => (
              <Card key={t.id}>
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-bold truncate">{t.buyerName}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.buyerEmail} &bull; {t.ticketCode}
                    </div>
                    {t.purchasedAt && (
                      <div className="text-xs text-muted-foreground">
                        Purchased:{" "}
                        {new Date(t.purchasedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <Badge className={statusColor(t.status)}>{t.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
