export type Track = {
  id: string;
  title: string;
  priceUGX: number;
  durationSec?: number;
  sampleUrl?: string; // later: CDN preview
  fullUrl?: string; // later: secured download/stream
};

export type Album = {
  id: string;
  title: string;
  releaseMonth: string;
  coverUrl?: string;
  description: string;
  tracks: Track[];
  isUpcoming?: boolean;
};

export const albums: Album[] = [
  {
    id: 'mental-break',
    title: 'Mental Break',
    releaseMonth: 'February',
    description:
      'A soulful journey through healing, reflection, and hope — rooted in culture and lived experience.',
    tracks: [
      { id: 'mb-1', title: 'Intro (Breathe)', priceUGX: 3000 },
      { id: 'mb-2', title: 'Safe Place', priceUGX: 3000 },
      { id: 'mb-3', title: 'Nyonyozi (Reprise)', priceUGX: 3000 },
    ],
    isUpcoming: true,
  },
  {
    id: 'fireflies',
    title: 'Fireflies (Nyonyozi)',
    releaseMonth: 'Released',
    description:
      'Warm Afro-soul with live-band energy, storytelling, and bright melodies.',
    tracks: [
      { id: 'ff-1', title: 'We Live to Love', priceUGX: 3000 },
      { id: 'ff-2', title: 'Nvudde Wala', priceUGX: 3000 },
      { id: 'ff-3', title: 'Mwana Wangye', priceUGX: 3000 },
    ],
  },
];
