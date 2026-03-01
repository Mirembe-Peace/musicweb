import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Loader2, Music, DollarSign, Ticket, CalendarDays, CreditCard, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
    { label: "Total Songs", value: stats?.totalSongs ?? 0, link: "/admin/music", icon: Music },
    { label: "Revenue (UGX)", value: (stats?.totalRevenue ?? 0).toLocaleString(), link: null, icon: DollarSign },
    { label: "Tickets Sold", value: stats?.ticketsSold ?? 0, link: "/admin/tickets", icon: Ticket },
    { label: "Upcoming Concerts", value: stats?.upcomingConcerts ?? 0, link: "/admin/concerts", icon: CalendarDays },
    { label: "Total Payments", value: stats?.totalPayments ?? 0, link: null, icon: CreditCard },
    { label: "Total Bookings", value: stats?.totalBookings ?? 0, link: "/admin/bookings", icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Overview of your Ashaba Music platform
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {c.label}
              </span>
              <c.icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{c.value}</div>
            {c.link && (
              <Link to={c.link} className="mt-1 inline-block text-xs font-medium text-primary hover:underline">
                Manage &rarr;
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      {stats?.recentBookings && stats.recentBookings.length > 0 && (
        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2">Recent Bookings</div>
          <div className="rounded-lg border bg-card divide-y">
            {stats.recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{b.fullName}</div>
                  <div className="text-xs text-muted-foreground">
                    {b.eventType} &bull; {b.eventDate}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-2">Quick Actions</div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/music">Music</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/concerts">Concerts</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/tickets">Tickets</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/images">Images</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
