export type NavItem = { to: string; label: string };

export type SitePromo = {
  enabled: boolean;
  text: string; // short text
  ctaLabel: string;
  ctaTo: string;
};

export type SiteConfig = {
  brandName: string;
  tagline: string;
  nav: NavItem[];
  promo: SitePromo;
};

export const defaultSiteConfig: SiteConfig = {
  brandName: 'AshabaMusic',
  tagline: 'Culture • Soul • Live',
  nav: [
    { to: '/music', label: 'Music' },
    { to: '/store', label: 'Store' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/videos', label: 'Videos' },
    { to: '/bookings', label: 'Bookings' },
    { to: '/social', label: 'Links' },
  ],
  promo: {
    enabled: true,
    text: 'Upcoming Album • Mental Break (February)',
    ctaLabel: 'View Album',
    ctaTo: '/albums/mental-break',
  },
};
