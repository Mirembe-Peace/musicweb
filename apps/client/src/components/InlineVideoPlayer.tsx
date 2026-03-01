import * as React from "react";
import Player from "@vimeo/player";
import { detectPlatform, toEmbedUrl } from "@/lib/video";

export type InlineVideoPlayerHandle = {
  getCurrentTime: () => Promise<number>;
  pause: () => Promise<void>;
};

async function loadYouTubeIframeAPI(): Promise<void> {
  const w = window as any;
  if (w.YT?.Player) return;

  if (!w.__ytApiLoading) {
    w.__ytApiLoading = new Promise<void>((resolve) => {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);

      (window as any).onYouTubeIframeAPIReady = () => resolve();
    });
  }

  await w.__ytApiLoading;
}

export default React.forwardRef<InlineVideoPlayerHandle, { url: string; className?: string }>(
  function InlineVideoPlayer({ url, className }, ref) {
    const platform = detectPlatform(url);

    // youtube
    const ytMountRef = React.useRef<HTMLDivElement | null>(null);
    const ytPlayerRef = React.useRef<any>(null);

    // vimeo
    const vimeoIframeRef = React.useRef<HTMLIFrameElement | null>(null);
    const vimeoPlayerRef = React.useRef<Player | null>(null);

    React.useImperativeHandle(ref, () => ({
      async getCurrentTime() {
        try {
          if (platform === "youtube" && ytPlayerRef.current?.getCurrentTime) {
            return Number(ytPlayerRef.current.getCurrentTime() || 0);
          }
          if (platform === "vimeo" && vimeoPlayerRef.current) {
            return Number((await vimeoPlayerRef.current.getCurrentTime()) || 0);
          }
        } catch {
          // Player not ready or destroyed — safe to ignore
        }
        return 0;
      },
      async pause() {
        try {
          if (platform === "youtube" && ytPlayerRef.current?.pauseVideo) {
            ytPlayerRef.current.pauseVideo();
            return;
          }
          if (platform === "vimeo" && vimeoPlayerRef.current) {
            await vimeoPlayerRef.current.pause();
          }
        } catch {
          // Player not ready or destroyed — safe to ignore
        }
      },
    }));

    // init youtube player
    React.useEffect(() => {
      let cancelled = false;

      async function init() {
        if (platform !== "youtube") return;
        await loadYouTubeIframeAPI();
        if (cancelled) return;

        const w = window as any;

        if (!ytMountRef.current) return;
        // clear mount
        ytMountRef.current.innerHTML = "";

        const div = document.createElement("div");
        ytMountRef.current.appendChild(div);

        const embed = toEmbedUrl(url, { autoplay: true, start: 0 });
        // We need videoId for API player (better than using iframe src here)
        // Extract from embed url path last segment:
        const videoId = (() => {
          try {
            const u = new URL(embed!);
            const parts = u.pathname.split("/").filter(Boolean);
            return parts.at(-1);
          } catch {
            return "";
          }
        })();

        if (!videoId) return;

        ytPlayerRef.current = new w.YT.Player(div, {
          videoId,
          playerVars: {
            autoplay: 1,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
          },
        });
      }

      init();

      return () => {
        cancelled = true;
        try {
          ytPlayerRef.current?.destroy?.();
        } catch {
          // Player cleanup — safe to ignore
        }
        ytPlayerRef.current = null;
      };
    }, [platform, url]);

    // init vimeo player
    React.useEffect(() => {
      let cancelled = false;

      async function init() {
        if (platform !== "vimeo") return;
        if (!vimeoIframeRef.current) return;

        vimeoPlayerRef.current = new Player(vimeoIframeRef.current);
        try {
          await vimeoPlayerRef.current.play();
        } catch {
          // Autoplay may be blocked by browser — safe to ignore
        }

        if (cancelled) return;
      }

      init();

      return () => {
        cancelled = true;
        try {
          vimeoPlayerRef.current?.destroy?.();
        } catch {
          // Player not ready or destroyed — safe to ignore
        }
        vimeoPlayerRef.current = null;
      };
    }, [platform, url]);

    if (platform === "youtube") {
      return <div ref={ytMountRef} className={className} />;
    }

    if (platform === "vimeo") {
      const embed = toEmbedUrl(url, { autoplay: true, start: 0 });
      return (
        <iframe
          ref={vimeoIframeRef}
          src={embed ?? undefined}
          className={className}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Vimeo video"
        />
      );
    }

    return (
      <div className={className}>
        <div className="h-full w-full grid place-items-center text-sm text-muted-foreground">
          Unsupported video link.
        </div>
      </div>
    );
  }
);