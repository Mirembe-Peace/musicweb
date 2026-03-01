

export function detectPlatform(url: string): 'youtube' | 'vimeo' | 'unknown' {
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('vimeo.com')) return 'vimeo';
  return 'unknown';
}

type EmbedOptions = {
  autoplay?: boolean;
  start?: number; // seconds
};

export function toEmbedUrl(
  url: string,
  opts: EmbedOptions = {},
): string | null {
  try {
    const platform = detectPlatform(url);
    const autoplay = opts.autoplay ? 1 : 0;
    const start = Math.max(0, Math.floor(opts.start ?? 0));

    if (platform === 'youtube') {
      const parsed = new URL(url);

      // extract id
      let id = '';
      if (parsed.hostname.includes('youtu.be'))
        id = parsed.pathname.replace('/', '');
      else id = parsed.searchParams.get('v') || '';

      if (!id) return null;

      // enablejsapi=1 is required for time tracking via postMessage/player api
      // start works via ?start=SECONDS
      const params = new URLSearchParams({
        autoplay: String(autoplay),
        start: String(start),
        rel: '0',
        modestbranding: '1',
        playsinline: '1',
        enablejsapi: '1',
      });

      return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
    }

    if (platform === 'vimeo') {
      const parsed = new URL(url);
      const parts = parsed.pathname.split('/').filter(Boolean);
      const id = parts[0];
      if (!id) return null;

      // Vimeo start time works well with #t=SECONDSs
      // autoplay via query string
      const qs = new URLSearchParams({
        autoplay: String(autoplay),
        title: '0',
        byline: '0',
        portrait: '0',
      });

      return `https://player.vimeo.com/video/${id}?${qs.toString()}#t=${start}s`;
    }

    return null;
  } catch {
    return null;
  }
}

export function toThumbnailUrl(url: string): string | null {
  // Vimeo thumbnails require API; we’ll use a nice fallback.
  // YouTube thumbnails are easy.
  const platform = detectPlatform(url);
  try {
    if (platform === 'youtube') {
      const parsed = new URL(url);
      let id = '';
      if (parsed.hostname.includes('youtu.be'))
        id = parsed.pathname.replace('/', '');
      else id = parsed.searchParams.get('v') || '';
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }
    return null;
  } catch {
    return null;
  }
}
