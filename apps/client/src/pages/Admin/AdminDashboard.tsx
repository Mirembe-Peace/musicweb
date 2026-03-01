import * as React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface Stats {
  totalSongs: number;
  totalPayments: number;
  totalRevenue: number;
  recentBookings: Array<{
    id: string;
    fullName: string;
    eventType: string;
    eventDate: string;
    createdAt: string;
  }>;
  upcomingConcerts: number;
  ticketsSold: number;
  totalBookings: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api
      .get("/stats")
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    { label: "Total Songs", value: stats?.totalSongs ?? 0, link: "/admin/music" },
    { label: "Revenue (UGX)", value: (stats?.totalRevenue ?? 0).toLocaleString(), link: null },
    { label: "Tickets Sold", value: stats?.ticketsSold ?? 0, link: "/admin/tickets" },
    { label: "Upcoming Concerts", value: stats?.upcomingConcerts ?? 0, link: "/admin/concerts" },
    { label: "Total Payments", value: stats?.totalPayments ?? 0, link: null },
    { label: "Total Bookings", value: stats?.totalBookings ?? 0, link: "/admin/bookings" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="font-black text-xl">Dashboard</div>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your Ashaba Music platform
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="rounded-3xl">
            <CardContent className="p-6">
              <div className="text-sm font-bold text-muted-foreground">
                {c.label}
              </div>
              <div className="mt-2 text-3xl font-black">{c.value}</div>
              {c.link && (
                <Button
                  asChild
                  variant="link"
                  className="mt-2 px-0 font-bold text-primary"
                >
                  <Link to={c.link}>Manage</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent bookings */}
      {stats?.recentBookings && stats.recentBookings.length > 0 && (
        <div>
          <div className="font-bold text-sm mb-3">Recent Bookings</div>
          <div className="grid gap-3">
            {stats.recentBookings.map((b) => (
              <Card key={b.id} className="rounded-3xl">
                <CardContent className="p-5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-bold truncate">{b.fullName}</div>
                    <div className="text-xs text-muted-foreground">
                      {b.eventType} &bull; {b.eventDate}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <div className="font-bold text-sm mb-3">Quick Actions</div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-2xl">
            <Link to="/admin/music">Manage Music</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link to="/admin/concerts">Manage Concerts</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link to="/admin/tickets">Manage Tickets</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link to="/admin/images">Manage Images</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
