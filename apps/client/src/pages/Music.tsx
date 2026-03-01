import * as React from "react";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import { albums } from "@/data/mock";
import { Link } from "react-router-dom";


import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAudio } from '@/app/AudioContext';
import { initiatePayment } from '@/services/PaymentService';
import { toast } from 'sonner';
import { Loader2, Play, Pause } from 'lucide-react';

type StatusFilter = "ALL" | "UPCOMING" | "RELEASED";

type SingleRow = {
  id: string;
  title: string;
  priceUGX: number;
  albumId: string;
  albumTitle: string;
  albumIsUpcoming: boolean;
};

export default function Music() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("ALL");

  const upcoming = React.useMemo(() => albums.find((a) => a.isUpcoming), []);


  // audio preview
  const { currentSongId, isPlaying, isLoading, toggle } = useAudio();

  const handleBuy = async (title: string, amount: number) => {
    try {
      await initiatePayment({
        amount,
        description: `Purchase: ${title}`,
        email: "customer@example.com",
        callbackUrl: window.location.origin + "/payment-success",
      });
    } catch (error) {
      toast.error("Failed to initiate payment");
    }
  };

  
  const filteredAlbums = React.useMemo(() => {
    const query = q.trim().toLowerCase();

    return albums.filter((a) => {
      const matchesQuery =
        !query ||
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.tracks.some((t) => t.title.toLowerCase().includes(query));

      const matchesStatus =
        status === "ALL" ||
        (status === "UPCOMING" && a.isUpcoming) ||
        (status === "RELEASED" && !a.isUpcoming);

      return matchesQuery && matchesStatus;
    });
  }, [q, status]);

  // “Singles” derived from tracks for now:
  // Later: replace with API singles endpoint.
  const singles = React.useMemo<SingleRow[]>(() => {
    const query = q.trim().toLowerCase();

    const rows: SingleRow[] = albums.flatMap((a) =>
      a.tracks.map((t) => ({
        id: t.id,
        title: t.title,
        priceUGX: t.priceUGX,
        albumId: a.id,
        albumTitle: a.title,
        albumIsUpcoming: a.isUpcoming ?? false,
      }))
    ) || [];

    return rows
      .filter((r) => {
        const matchesQuery = !query || r.title.toLowerCase().includes(query) || r.albumTitle.toLowerCase().includes(query);

        const matchesStatus =
          status === "ALL" ||
          (status === "UPCOMING" && r.albumIsUpcoming) ||
          (status === "RELEASED" && !r.albumIsUpcoming);

        return matchesQuery && matchesStatus;
      })
      .slice(0, 10); // show top 10 for now (mobile-friendly)
  }, [q, status]);

  return (
    <Container>
      <div className="py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow="Music"
            title="Albums & Singles"
            subtitle="Search albums and tracks, listen to previews (soon), and support by purchasing downloads."
          />

          {upcoming?.id && (
            <div className="rounded-3xl border bg-muted/30 p-4 md:max-w-sm">
              <div className="text-xs font-bold text-muted-foreground">
                Upcoming
              </div>
              <div className="mt-1 font-extrabold text-foreground truncate">
                {upcoming.title} • {upcoming.releaseMonth}
              </div>
              <div className="mt-3">
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="rounded-2xl"
                >
                  <Link to={`/albums/${upcoming.id}`}>View details</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search albums or tracks…"
              className="rounded-2xl"
            />
          </div>

          <div>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as StatusFilter)}
            >
              <SelectTrigger className="rounded-2xl">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="RELEASED">Released</SelectItem>
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Singles */}
        <div className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="text-lg font-black text-foreground">Singles</div>
              <Badge variant="secondary" className="rounded-full">
                Top picks
              </Badge>
            </div>

            <Button
              asChild
              variant="link"
              className="px-0 font-extrabold text-primary"
            >
              <Link to="/store">Buy & Support →</Link>
            </Button>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Preview and buy individual tracks (payments & secure downloads
            coming soon).
          </p>

          <div className="mt-4 grid gap-3">
            {singles.length === 0 ? (
              <Card className="rounded-3xl border bg-card shadow-sm">
                <CardContent className="p-6 text-sm text-muted-foreground">
                  No singles match your search.
                </CardContent>
              </Card>
            ) : (
              singles.map((s, idx) => (
                <Card
                  key={`${s.albumId}-${s.id}`}
                  className="rounded-3xl border bg-card shadow-sm"
                >
                  <CardContent className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-muted-foreground">
                        #{idx + 1}
                      </div>
                      <div className="font-black text-foreground truncate">
                        {s.title}
                      </div>
                      <Link
                        to={`/albums/${s.albumId}`}
                        className="mt-1 inline-block text-xs text-muted-foreground hover:text-foreground"
                      >
                        From: {s.albumTitle} →
                      </Link>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-sm font-extrabold text-foreground">
                        UGX {s.priceUGX.toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="rounded-2xl min-w-[100px]"
                          onClick={() => toggle(s.id, `/songs/${s.title.toLowerCase().replace(/ /g, '_')}.mp3`)} // Fallback URL for now
                        >
                          {currentSongId === s.id && isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : currentSongId === s.id && isPlaying ? (
                            <Pause className="h-4 w-4 mr-2 capitalize" />
                          ) : (
                            <Play className="h-4 w-4 mr-2" />
                          )}
                          {currentSongId === s.id && isPlaying ? "Pause" : "Preview"}
                        </Button>
                        <Button 
                    className="flex-1 rounded-2xl"
                    onClick={() => handleBuy(s.title, s.priceUGX || 5000)}
                  >
                    Buy (UGX {(s.priceUGX || 5000).toLocaleString()})
                  </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="mt-5 h-2 w-full rounded-full bg-gradient-to-r from-[hsl(var(--brand-green))] via-[hsl(var(--brand-yellow))] to-[hsl(var(--brand-red))]" />
        </div>

        {/* Albums */}
        <div className="mt-10">
          <div className="flex items-center gap-2">
            <div className="text-lg font-black text-foreground">Albums</div>
            <Badge variant="secondary" className="rounded-full">
              {filteredAlbums.length}
            </Badge>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {filteredAlbums.map((a) => (
              <Link key={a.id} to={`/albums/${a.id}`} className="block">
                <Card className="rounded-3xl border bg-card shadow-sm transition hover:-translate-y-0.5">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="rounded-full">
                            {a.isUpcoming ? "Upcoming" : "Released"}
                          </Badge>
                          <Badge variant="secondary" className="rounded-full">
                            {a.tracks.length} tracks
                          </Badge>
                        </div>

                        <div className="mt-3 text-2xl font-black tracking-tight text-foreground truncate">
                          {a.title}
                        </div>

                        <div className="mt-1 text-sm text-muted-foreground">
                          {a.isUpcoming
                            ? `Release: ${a.releaseMonth}`
                            : a.releaseMonth}
                        </div>
                      </div>

                      <div className="h-12 w-12 rounded-2xl bg-muted grid place-items-center font-black text-foreground/80">
                        ♫
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                      {a.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="h-2 w-24 rounded-full bg-gradient-to-r from-[hsl(var(--brand-green))] via-[hsl(var(--brand-yellow))] to-[hsl(var(--brand-red))]" />
                      <Button
                        variant="link"
                        className="px-0 font-extrabold text-primary"
                      >
                        View →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-3xl border bg-muted/30 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm font-extrabold text-foreground">
                Support the music — buy and download tracks
              </div>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Payments and secure downloads will be enabled shortly. The UI is
                ready for Mobile Money and card checkout flows.
              </p>
            </div>

            <div className="flex gap-3">
              <Button asChild className="rounded-2xl">
                <Link to="/store">Go to Store</Link>
              </Button>
              <Button asChild variant="secondary" className="rounded-2xl">
                <Link to="/bookings">Book Ashaba</Link>
              </Button>
            </div>
          </div>

          <div className="mt-6 h-2 w-full rounded-full bg-linear-to-r from-[hsl(var(--brand-green))] via-[hsl(var(--brand-yellow))] to-[hsl(var(--brand-red))]" />
        </div>
      </div>
    </Container>
  );
}