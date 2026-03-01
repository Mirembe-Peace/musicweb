export type GalleryCategory = 'photo' | 'poster' | 'bts' | 'live' | 'culture';

export type GalleryItem = {
  id: string;
  title: string;
  category: GalleryCategory;
  dateLabel?: string;
  images: string[]; // allow single or multiple images per entry
  description?: string;
  tags?: string[];
};

export const galleryItems: GalleryItem[] = [
  {
    id: "g-1",
    title: "Stage Moments — Kampala",
    category: "live",
    dateLabel: "2025",
    images: ["/image_24.JPG", "/image_22.JPG"],
    tags: ["performance", "crowd"],
  },
  {
    id: "g-2",
    title: "Cultural Look",
    category: "culture",
    dateLabel: "2025",
    images: [
      "/image_12.jpg",
      "/image_18.jpg",
      "/image_17.jpg",
      "/image_12.jpg",
      "/image_19.jpg",
    ],
    tags: ["heritage", "style"],
  },
  {
    id: "g-3",
    title: "Behind the Scenes",
    category: "bts",
    dateLabel: "2024",
    images: [
      "/image_21.JPG",
      "/image_33.JPG",
      "/image_34.JPG",
      "/image_35.JPG",
    ],
  },
  {
    id: "g-4",
    title: "Album Poster — Mental Break",
    category: "poster",
    dateLabel: "Feb 2026",
    images: [
      "/image_50.png",
      "/image_51.png",
      "/image_47.jpg",      
      "/image_49.jpg",
      "/image_48.jpg",
      "/image_52.jpg"
    ],
    tags: ["poster", "release"],
  },
  {
    id: "g-5",
    title: "Portrait Set",
    category: "photo",
    dateLabel: "2025",
    images: ["/image_41.jpg", "/image_43.jpg", "/image_45.jpg"],
  },
  {
    id: "g-6",
    title: "Events",
    category: "photo",
    dateLabel: "2025",
    images: ["/image_26.JPG", "/image_43.jpg", "/image_45.jpg"],
  },
];
