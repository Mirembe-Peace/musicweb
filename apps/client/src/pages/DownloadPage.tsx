import * as React from "react";
import { useParams, Link } from "react-router-dom";
import Container from "@/components/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface DownloadSong {
  id: string;
  title: string;
  audioUrl: string;
  coverImageUrl?: string;
}

export default function DownloadPage() {
  const { token } = useParams<{ token: string }>();
  const [songs, setSongs] = React.useState<DownloadSong[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expiresAt, setExpiresAt] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!token) return;

    api
      .get(`/purchases/download/${token}`)
      .then(({ data }) => {
        setSongs(data.songs);
        setExpiresAt(data.expiresAt);
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message || "Invalid or expired download link";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <Container>
        <div className="py-16 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-16 flex justify-center">
          <Card className="rounded-3xl max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="text-5xl">&#9888;</div>
              <div className="mt-4 font-black text-lg text-destructive">
                {error}
              </div>
              <Button
                asChild
                variant="outline"
                className="mt-6 rounded-2xl w-full"
              >
                <Link to="/music">Back to Music</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-10">
        <div className="font-black text-2xl">Your Downloads</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Click on each track to download.
          {expiresAt && (
            <>
              {" "}
              Link expires:{" "}
              {new Date(expiresAt).toLocaleDateString("en-UG", {
                dateStyle: "medium",
              })}
            </>
          )}
        </p>

        <div className="mt-6 grid gap-4">
          {songs.map((song) => (
            <Card key={song.id} className="rounded-3xl">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {song.coverImageUrl && (
                    <img
                      src={song.coverImageUrl}
                      alt={song.title}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                  )}
                  <div className="font-black truncate">{song.title}</div>
                </div>

                <Button asChild className="rounded-2xl shrink-0">
                  <a href={song.audioUrl} download target="_blank" rel="noreferrer">
                    Download
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Button asChild variant="outline" className="rounded-2xl">
            <Link to="/music">Back to Music</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
