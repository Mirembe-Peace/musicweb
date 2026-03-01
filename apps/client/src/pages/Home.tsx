import { Link } from "react-router-dom";
import { Music, CalendarDays, ImageIcon, Star, ArrowRight } from "lucide-react";
import ConcertPopup from "@/components/ConcertPopup";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import { albums } from "@/data/mock";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const upcoming = albums.find((a) => a.isUpcoming);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Container>
          <div className="py-12 md:py-16 lg:py-20 grid gap-10 lg:grid-cols-2 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-bold text-foreground/80">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--brand-red))]" />
                Live performances • Bookings open
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-foreground">
                Culture-forward music, made to be felt.
              </h1>

              <p className="mt-4 max-w-xl text-sm md:text-base text-muted-foreground">
                Discover albums, singles, live sessions, and stories — then support the art
                by purchasing and downloading tracks.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/music">Explore Music</Link>
                </Button>

                <Button asChild size="lg" variant="secondary">
                  <Link to="/bookings">Book Ashaba</Link>
                </Button>

                <Button asChild variant="ghost" className="text-muted-foreground/50 hover:text-primary">
                  <Link to="/admin/login">Admin Login</Link>
                </Button>
              </div>

              {/* quick trust row */}
              <div className="mt-7 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="rounded-full">
                  Albums & Singles
                </Badge>
                <Badge variant="secondary" className="rounded-full">
                  Band / Acoustic / Full Set
                </Badge>
                <Badge variant="secondary" className="rounded-full">
                  Uganda • East Africa
                </Badge>
              </div>
            </div>

            {/* Right: Featured card */}
            <Card className="rounded-xl border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-muted-foreground">Featured</div>
                    <div className="mt-1 text-2xl font-black tracking-tight text-foreground">
                      {upcoming?.title ?? "Upcoming Album"}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Release: {upcoming?.releaseMonth ?? "Soon"}
                    </div>
                  </div>

                  <div className="h-12 w-12 rounded-xl grid place-items-center bg-secondary text-secondary-foreground">
                    <Star className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {upcoming?.description ??
                    "A new body of work is coming. Stay tuned for the release."}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to={`/albums/${upcoming?.id ?? ""}`}>View Album</Link>
                  </Button>

                  <Button asChild variant="secondary">
                    <Link to="/store">Buy & Support</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Experience */}
      <section className="py-10 md:py-12">
        <Container>
          <SectionTitle
            eyebrow="Experience"
            title="Music, visuals, and live energy"
            subtitle="Stream samples, buy downloads, and explore performances through photos and videos."
          />

          <div className="grid gap-5 md:grid-cols-3">
            <FeatureCard
              title="Albums & Singles"
              text="Showcase releases, play samples, and purchase downloads."
              to="/music"
            />
            <FeatureCard
              title="Bookings"
              text="Receive and manage booking requests for events and shows."
              to="/bookings"
            />
            <FeatureCard
              title="Gallery"
              text="Photos and behind-the-scenes moments that celebrate culture."
              to="/gallery"
            />
          </div>
        </Container>
      </section>

      {/* CTA section */}
      <section className="py-10 md:py-12">
        <Container>
          <div className="rounded-xl border bg-muted/30 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="text-sm font-extrabold text-foreground">
                  Ready to bring the culture to your event?
                </div>
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                  Request a booking and we’ll confirm availability, performance options, and pricing.
                </p>
              </div>

              <div className="flex gap-3">
                <Button asChild>
                  <Link to="/bookings">Request Booking</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/store">Support the Music</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <ConcertPopup />
    </div>
  );
}

function FeatureCard({
  title,
  text,
  to,
}: Readonly<{
  title: string;
  text: string;
  to: string;
}>) {
  return (
    <Card className="rounded-xl border bg-card shadow-sm transition hover:-translate-y-0.5">
      <CardContent className="p-6">
        <div className="text-lg font-black text-foreground">{title}</div>

        <p className="mt-3 text-sm text-muted-foreground">{text}</p>

        <div className="mt-5">
          <Button asChild variant="link" className="px-0 font-extrabold text-primary">
            <Link to={to}>
              Explore <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}