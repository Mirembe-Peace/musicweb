import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import { albums } from "@/data/mock";
import { initiatePayment } from "@/services/PaymentService";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AlbumDetails() {
  const { id } = useParams();
  const album = useMemo(() => albums.find((a) => a.id === id), [id]);

  const handleBuy = async (title: string, amount: number) => {
    try {
      await initiatePayment({
        amount,
        description: `Purchase: ${title}`,
        email: "customer@example.com", // This should come from a user profile or form
        callbackUrl: window.location.origin + "/payment-success",
      });
    } catch (error) {
      toast.error("Failed to initiate payment");
    }
  };

  if (!album) {
    return (
      <Container>
        <div className="py-12">
          <Card className="rounded-3xl border bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="font-black text-xl text-foreground">Album not found</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Please go back and try again.
              </p>

              <div className="mt-5">
                <Button asChild variant="secondary" className="rounded-2xl">
                  <Link to="/music">Back to Music</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <SectionTitle
            eyebrow={album.isUpcoming ? `Upcoming • ${album.releaseMonth}` : "Released"}
            title={album.title}
            subtitle={album.description}
          />

          <div className="flex flex-wrap gap-2 md:mt-2">
            {album.isUpcoming ? (
              <Badge className="rounded-full" variant="secondary">
                Coming soon
              </Badge>
            ) : (
              <Badge className="rounded-full" variant="secondary">
                Available
              </Badge>
            )}

            <Badge className="rounded-full" variant="secondary">
              {album.tracks.length} tracks
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Tracklist */}
          <Card className="lg:col-span-3 rounded-3xl border bg-card shadow-sm overflow-hidden">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-black text-foreground">Tracklist</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Samples and secure downloads will be enabled after payments + NestJS backend
                    are connected.
                  </p>
                </div>

                <Button
                  variant="secondary"
                  className="rounded-2xl"
                  onClick={() => handleBuy(album.title, 50000)} // Example album price
                >
                  Buy Album
                </Button>
              </div>

              <div className="mt-4 h-2 w-full rounded-full bg-gradient-to-r from-[hsl(var(--brand-green))] via-[hsl(var(--brand-yellow))] to-[hsl(var(--brand-red))]" />
            </CardHeader>

            <Separator />

            <CardContent className="p-0">
              <div className="divide-y">
                {album.tracks.map((t, idx) => (
                  <div
                    key={t.id}
                    className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-foreground truncate">
                        {idx + 1}. {t.title}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Sample: coming soon
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-sm font-extrabold text-foreground">
                        UGX {t.priceUGX.toLocaleString()}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="rounded-2xl"
                          disabled
                          title="Preview will be enabled soon"
                        >
                          Preview
                        </Button>
                        <Button
                          className="rounded-2xl"
                          onClick={() => handleBuy(t.title, t.priceUGX)}
                        >
                          Buy
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="rounded-3xl border bg-card shadow-sm">
              <CardContent className="p-6">
                <div className="font-black text-lg text-foreground">Support the music</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Buying tracks helps fund recordings, live sessions, and new releases.
                </p>

                <div className="mt-4 flex gap-2">
                  <Button asChild variant="secondary" className="rounded-2xl w-full">
                    <Link to="/store">Go to Store</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border bg-muted/30 shadow-sm">
              <CardContent className="p-6">
                <div className="font-black text-lg text-foreground">Bookings</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Want this album live at your event? Request a booking and we’ll respond with
                  availability.
                </p>

                <div className="mt-4">
                  <Button asChild className="rounded-2xl w-full">
                    <Link to="/bookings">Request Booking</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}