import { useAudio } from "@/app/AudioContext";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
  Loader2,
  Music,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const {
    currentSongId,
    trackMeta,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    pause,
    toggle,
    stop,
    seek,
    setVolume,
  } = useAudio();

  if (!currentSongId) return null;

  const handlePlayPause = () => {
    // toggle with empty url — if already loaded it won't reset src
    toggle(currentSongId, "");
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-5xl flex items-center gap-3 px-4 py-2 sm:py-3">
        {/* Cover / icon */}
        <div className="shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
          {trackMeta?.coverUrl ? (
            <img
              src={trackMeta.coverUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <Music className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        {/* Track info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">
              {trackMeta?.title ?? "Unknown"}
            </span>
            {trackMeta?.artist && (
              <span className="hidden sm:inline truncate text-xs text-muted-foreground">
                {trackMeta.artist}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] tabular-nums text-muted-foreground w-8 text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={([v]) => {
                if (duration > 0) seek((v / 100) * duration);
              }}
              className="flex-1"
            />
            <span className="text-[10px] tabular-nums text-muted-foreground w-8">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Play / Pause */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          {/* Volume (desktop only) */}
          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
              aria-label={volume === 0 ? "Unmute" : "Mute"}
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={([v]) => setVolume(v / 100)}
              className={cn("w-20")}
            />
          </div>

          {/* Close */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={stop}
            aria-label="Close player"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
