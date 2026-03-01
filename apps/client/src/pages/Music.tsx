import * as React from "react";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAudio } from '@/app/AudioContext';
import { toast } from 'sonner';
import { Loader2, Play, Pause } from 'lucide-react';
import { api } from '@/lib/api';
import CheckoutDialog from '@/components/CheckoutDialog';

type StatusFilter = "ALL" | "UPCOMING" | "RELEASED";

interface ApiSong {
  id: string;
  title: string;
  price: number;
  albumId: string | null;
  albumTitle: string | null;
  coverImageUrl: string | null;
  previewUrl: string | null;
  isReleased: boolean;
  isUpcoming: boolean;
}

interface Album {
  id: string;
  title: string;
  isUpcoming: boolean;
  tracks: ApiSong[];
  description: string;
}

export default function Music() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("ALL");
  const [songs, setSongs] = React.useState<ApiSong[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [checkoutSongs, setCheckoutSongs] = React.useState<Array<{ id: string; title: string; price: number }>>([]);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);

  // Fetch songs from API
  React.useEffect(() => {
    api.get('/music')
      .then(({ data }) => setSongs(data))
      .catch(() => toast.error('Failed to load music'))
      .finally(() => setLoading(false));
  }, []);

  // Group songs into albums
  const albums = React.useMemo<Album[]>(() => {
    const map = new Map<string, Album>();
    songs.forEach((s) => {
      const key = s.albumId || `single-${s.id}`;
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          title: s.albumTitle || s.title,
          isUpcoming: s.isUpcoming,
          tracks: [],
          description: '',
        });
      }
      map.get(key)!.tracks.push(s);
    });
    return Array.from(map.values());
  }, [songs]);

  const upcoming = React.useMemo(() => albums.find((a) => a.isUpcoming), [albums]);

  // Audio preview
  const { currentSongId, isPlaying, isLoading: audioLoading, toggle } = useAudio();

  const handleBuy = (song: ApiSong) => {
    setCheckoutSongs([{ id: song.id, title: song.title, price: Number(song.price) }]);
    setCheckoutOpen(true);
  };

  const filteredAlbums = React.useMemo(() => {
    const query = q.trim().toLowerCase();

    return albums.filter((a) => {
      const matchesQuery =
        !query ||
        a.title.toLowerCase().includes(query) ||
        a.tracks.some((t) => t.title.toLowerCase().includes(query));

      const matchesStatus =
        status === "ALL" ||
        (status === "UPCOMING" && a.isUpcoming) ||
        (status === "RELEASED" && !a.isUpcoming);

      return matchesQuery && matchesStatus;
    });
  }, [q, status, albums]);

  // Singles derived from all songs
  const singles = React.useMemo(() => {
    const query = q.trim().toLowerCase();

    return songs
      .filter((s) => {
        const matchesQuery = !query || s.title.toLowerCase().includes(query) || (s.albumTitle || '').toLowerCase().includes(query);
        const matchesStatus =
          status === "ALL" ||
          (status === "UPCOMING" && s.isUpcoming) ||
          (status === "RELEASED" && !s.isUpcoming);
        return matchesQuery && matchesStatus;
      })
      .slice(0, 10);
  }, [q, status, songs]);

  return (
    <Container>
      <div className="py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow="Music"
            title="Albums & Singles"
            subtitle="Search albums and tracks, listen to previews, and support by purchasing downloads."
          />

          {upcoming?.id && (
            <div className="rounded-3xl border bg-muted/30 p-4 md:max-w-sm">
              <div className="text-xs font-bold text-muted-foreground">
                Upcoming
              </div>
              <div className="mt-1 font-extrabold text-foreground truncate">
                {upcoming.title}
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
              placeholder="Search albums or tracks..."
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

        {/* Loading state */}
        {loading && (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Singles */}
        {!loading && (
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
                <Link to="/store">Buy & Support</Link>
              </Button>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Preview and buy individual tracks.
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
                    key={s.id}
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
                        {s.albumId && (
                          <Link
                            to={`/albums/${s.albumId}`}
                            className="mt-1 inline-block text-xs text-muted-foreground hover:text-foreground"
                          >
                            From: {s.albumTitle}
                          </Link>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <div className="text-sm font-extrabold text-foreground">
                          UGX {Number(s.price).toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="rounded-2xl min-w-[100px]"
                            onClick={() => {
                              const previewSrc = s.previewUrl || `/songs/${s.title.toLowerCase().replace(/ /g, '_')}.mp3`;
                              toggle(s.id, previewSrc);
                            }}
                          >
                            {currentSongId === s.id && audioLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : currentSongId === s.id && isPlaying ? (
                              <Pause className="h-4 w-4 mr-2" />
                            ) : (
                              <Play className="h-4 w-4 mr-2" />
                            )}
                            {currentSongId === s.id && isPlaying ? "Pause" : "Preview"}
                          </Button>
                          <Button
                            className="flex-1 rounded-2xl"
                            onClick={() => handleBuy(s)}
                          >
                            Buy (UGX {Number(s.price || 5000).toLocaleString()})
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
        )}

        {/* Albums */}
        {!loading && (
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
                        </div>

                        <div className="h-12 w-12 rounded-2xl bg-muted grid place-items-center font-black text-foreground/80">
                          &#9835;
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="h-2 w-24 rounded-full bg-gradient-to-r from-[hsl(var(--brand-green))] via-[hsl(var(--brand-yellow))] to-[hsl(var(--brand-red))]" />
                        <Button
                          variant="link"
                          className="px-0 font-extrabold text-primary"
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-3xl border bg-muted/30 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm font-extrabold text-foreground">
                Support the music — buy and download tracks
              </div>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Purchase tracks directly with Mobile Money or card. Downloads
                are delivered instantly to your email.
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

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        songs={checkoutSongs}
      />
    </Container>
  );
}
