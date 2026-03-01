export type VideoPlatform = 'youtube' | 'vimeo';

export type VideoItem = {
  id: string;
  title: string;
  url: string;
  platform: VideoPlatform;
  dateLabel?: string;
  description?: string;
  tags?: string[];
};

export const videos: VideoItem[] = [
  {
    id: 'humura-official',
    title: 'Humura (Official Video)',
    url: 'https://www.youtube.com/watch?v=hjQ9h0s65_Q',
    platform: 'youtube',
    tags: ['Official Video'],
  },
  {
    id: 'munywani-wangye-lyrics',
    title: 'Munywani Wangye (My Friend) — Official Lyrics Video',
    url: 'https://www.youtube.com/watch?v=WEil9vu8pXM',
    platform: 'youtube',
    tags: ['Lyrics Video'],
  },
  {
    id: 'yobu-lyrics',
    title: 'Yobu — Official Lyrics Video',
    url: 'https://www.youtube.com/watch?v=EHgI8ac17pM',
    platform: 'youtube',
    tags: ['Lyrics Video'],
  },
  {
    id: 'magic-lyrics',
    title: 'Magic — Official Lyrics Video',
    url: 'https://www.youtube.com/watch?v=Ic4rrNC0UZ8',
    platform: 'youtube',
    tags: ['Lyrics Video'],
  },
  {
    id: 'exhausted-lyrics',
    title: 'Exhausted — Official Lyrics Video',
    url: 'https://www.youtube.com/watch?v=Uzpfr5QgbtA',
    platform: 'youtube',
    tags: ['Lyrics Video'],
  },
  {
    id: 'we-live-to-love-audio',
    title: 'We Live to Love (Official Audio)',
    url: 'https://www.youtube.com/watch?v=YFqA8TOzCR0',
    platform: 'youtube',
    tags: ['Official Audio'],
  },
  {
    id: 'you-say-lyrics',
    title: 'You Say — Official Lyrics Video (Off Mental Break EP)',
    url: 'https://www.youtube.com/watch?v=3pakagpCg_0',
    platform: 'youtube',
    tags: ['Lyrics Video', 'Mental Break EP'],
  },
  {
    id: 'humura-remix-visualizer',
    title: 'Humura (Remix) ft. Himbi King — Visualizer/Lyrics',
    url: 'https://www.youtube.com/watch?v=nK0tz6uzD0I',
    platform: 'youtube',
    tags: ['Visualizer', 'Remix'],
  },
  {
    id: 'live-12-keys-band',
    title: 'Live with 12 Keys Band (Mbarara)',
    url: 'https://www.youtube.com/watch?v=rUpNBZCORok',
    platform: 'youtube',
    tags: ['Live'],
  },
  {
    id: 'tusin-marry-me-collab',
    title: 'Marry Me — Tusin ft. Ashaba Music (Official 4K Video)',
    url: 'https://www.youtube.com/watch?v=5IAG26lO-hg',
    platform: 'youtube',
    tags: ['Collab', '4K'],
  },
];
