import * as React from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, MapPin, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Booking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  location: string;
  budgetUGX: number | null;
  message: string | null;
  createdAt: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api
      .get("/bookings")
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  const eventTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      WEDDING: "bg-pink-100 text-pink-800",
      CORPORATE: "bg-blue-100 text-blue-800",
      FESTIVAL: "bg-purple-100 text-purple-800",
      PRIVATE: "bg-green-100 text-green-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[type] || colors.OTHER;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Bookings</h2>
        <p className="text-sm text-muted-foreground">
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""} received
        </p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No booking requests yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-black text-lg flex items-center gap-2">
                      <User className="h-4 w-4 shrink-0" />
                      {b.fullName}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {b.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {b.phone}
                      </span>
                    </div>
                  </div>
                  <Badge className={eventTypeBadge(b.eventType)}>
                    {b.eventType}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />{" "}
                    {b.eventDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />{" "}
                    {b.location}
                  </span>
                  {b.budgetUGX && (
                    <span className="font-bold text-primary">
                      UGX {Number(b.budgetUGX).toLocaleString()}
                    </span>
                  )}
                </div>

                {b.message && (
                  <p className="text-sm text-muted-foreground border-t pt-2">
                    {b.message}
                  </p>
                )}

                <div className="text-xs text-muted-foreground">
                  Received: {formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
