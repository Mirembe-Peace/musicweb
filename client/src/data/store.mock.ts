/**
 * Store data types (frontend-first, backend-ready).
 * You can later move these to src/data/store.mock.ts and import them.
 */

export type StoreCategory = 'song' | 'album' | 'merch';

export type VariantValue = {
  value: string; // e.g. "MP3", "WAV", "L", "Red"
  priceDeltaUGX?: number; // optional modifier
};

export type StoreVariant = {
  name: string; // e.g. "Format", "Size", "Color"
  values: VariantValue[];
  required?: boolean; // default true for merch, optional for others
};

export type StoreItem = {
  id: string;
  category: StoreCategory;
  title: string;
  subtitle?: string;
  priceUGX: number;
  images?: string[]; // [primary, ...more]
  tags?: string[];
  variants?: StoreVariant[]; // NEW
};

export type CartLine = {
  key: string; // item.id + selected variants signature
  item: StoreItem;
  qty: number;
  selected: Record<string, string>; // variantName => value
  unitPriceUGX: number; // base + deltas
};

export const storeItems: StoreItem[] = [
  // Songs (format variants)
  {
    id: "song-humura",
    category: "song",
    title: "Humura",
    subtitle: "Single",
    priceUGX: 5000,
    images: ["/image_47.jpg"],
    tags: ["Digital"],
    variants: [
      {
        name: "Format",
        values: [{ value: "MP3" }, { value: "WAV", priceDeltaUGX: 2000 }],
        required: true,
      },
    ],
  },
  {
    id: "song-mwana-wangye",
    category: "song",
    title: "Mwana Wangye",
    subtitle: "Single",
    priceUGX: 5000,
    images: ["/Copy of Album Cover .jpg"],
    tags: ["Digital"],
    variants: [
      {
        name: "Format",
        values: [{ value: "MP3" }, { value: "WAV", priceDeltaUGX: 2000 }],
        required: true,
      },
    ],
  },
  {
    id: "song-webare-yesu",
    category: "song",
    title: "Webare Yesu",
    subtitle: "Ashaba with Happy Kyazze",
    priceUGX: 5000,
    images: ["/image_51.png"],
    tags: ["Digital"],
    variants: [
      {
        name: "Format",
        values: [{ value: "MP3" }, { value: "WAV", priceDeltaUGX: 2000 }],
        required: true,
      },
    ],
  },
  {
    id: "song-in-His-Image",
    category: "song",
    title: "In His Image",
    subtitle: "Single",
    priceUGX: 5000,
    images: ["/Copy of Album Cover .jpg"],
    tags: ["Digital"],
    variants: [
      {
        name: "Format",
        values: [{ value: "MP3" }, { value: "WAV", priceDeltaUGX: 2000 }],
        required: true,
      },
    ],
  },
  {
    id: "song-tinyem",
    category: "song",
    title: "Tinyem Na Aza",
    subtitle: "Arthur Cee ft Ashaba Music",
    priceUGX: 5000,
    images: ["image_12.jpg"],
    tags: ["Digital"],
    variants: [
      {
        name: "Format",
        values: [{ value: "MP3" }, { value: "WAV", priceDeltaUGX: 2000 }],
        required: true,
      },
    ],
  },
  {
    id: "song-abaana-bangye",
    category: "song",
    title: "Abaana Bangye",
    subtitle: "Single",
    priceUGX: 5000,
    images: ["/Copy of Album Cover .jpg"],
    tags: ["Digital"],
    variants: [
      {
        name: "Format",
        values: [{ value: "MP3" }, { value: "WAV", priceDeltaUGX: 2000 }],
        required: true,
      },
    ],
  },
  {
    id: "song-Yobu",
    category: "song",
    title: "Yobu",
    subtitle: "Single",
    priceUGX: 5000,
    images: ["/Copy of Album Cover .jpg"],
    tags: ["Digital"],
    variants: [
      {
        name: "Format",
        values: [{ value: "MP3" }, { value: "WAV", priceDeltaUGX: 2000 }],
        required: true,
      },
    ],
  },
  {
    id: "song-nvudde wala",
    category: "song",
    title: "Nvudde Wala",
    subtitle: "Single",
    priceUGX: 5000,
    images: ["/image_49.jpg"],
    tags: ["Digital"],
    variants: [
      {
        name: "Format",
        values: [{ value: "MP3" }, { value: "WAV", priceDeltaUGX: 2000 }],
        required: true,
      },
    ],
  },
  {
    id: "song-he's-here-he's-there",
    category: "song",
    title: "He's Here, He's There",
    subtitle: "Single",
    priceUGX: 5000,
    images: ["/Copy of Album Cover .jpg"],
    tags: ["Digital"],
    variants: [
      {
        name: "Format",
        values: [{ value: "MP3" }, { value: "WAV", priceDeltaUGX: 2000 }],
        required: true,
      },
    ],
  },
  {
    id: "song-we-live-to-love-remix-with-amani",
    category: "song",
    title: "We Live to Love (Remix with Amani)",
    subtitle: "Single",
    priceUGX: 5000,
    images: ["/Copy of Album Cover .jpg"],
    tags: ["Digital"],
    variants: [
      {
        name: "Format",
        values: [{ value: "MP3" }, { value: "WAV", priceDeltaUGX: 2000 }],
        required: true,
      },
    ],
  },
  {
    id: "song-marry-me",
    category: "song",
    title: "Marry Me",
    subtitle: "Single",
    priceUGX: 5000,
    images: ["/image_48.jpg"],
    tags: ["Digital"],
    variants: [
      {
        name: "Format",
        values: [{ value: "MP3" }, { value: "WAV", priceDeltaUGX: 2000 }],
        required: true,
      },
    ],
  },
  {
    id: "song-munwani-wangye",
    category: "song",
    title: "Munwani Wangye",
    subtitle: "Single",
    priceUGX: 5000,
    images: ["/image_53.jpg"],
    tags: ["Digital"],
    variants: [
      {
        name: "Format",
        values: [{ value: "MP3" }, { value: "WAV", priceDeltaUGX: 2000 }],
        required: true,
      },
    ],
  },
  {
    id: "song-you-say",
    category: "song",
    title: "You Say",
    subtitle: "Single",
    priceUGX: 5000,
    images: ["/image_53.jpg"],
    tags: ["Digital"],
    variants: [
      {
        name: "Format",
        values: [{ value: "MP3" }, { value: "WAV", priceDeltaUGX: 2000 }],
        required: true,
      },
    ],
  },

  // Albums (format variants + preorder)
  {
    id: "album-mental-break",
    category: "album",
    title: "Mental Break",
    subtitle: "Album (Upcoming)",
    priceUGX: 20000,
    images: ["/image_53.jpg"],
    tags: ["Pre-order", "Digital"],
    variants: [
      {
        name: "Format",
        values: [{ value: "MP3" }, { value: "WAV", priceDeltaUGX: 5000 }],
        required: true,
      },
    ],
  },

  // Merch (size + color)
  {
    id: "merch-tee",
    category: "merch",
    title: "Ashaba Brand T-Shirt",
    subtitle: "Merch",
    priceUGX: 45000,
    images: ["/ashaba.png", "/ashaba.png", "/ashaba.png"],
    tags: ["Official"],
    variants: [
      {
        name: "Size",
        values: [
          { value: "S" },
          { value: "M" },
          { value: "L" },
          { value: "XL", priceDeltaUGX: 2000 },
        ],
        required: true,
      },
      {
        name: "Color",
        values: [{ value: "Black" }, { value: "White" }, { value: "Green" }],
        required: true,
      },
    ],
  },
  {
    id: "merch-cap",
    category: "merch",
    title: "Ashaba Cap",
    subtitle: "Merch",
    priceUGX: 30000,
    images: ["/ashaba.png", "/ashaba.png", "/ashaba.png"],
    tags: ["Official"],
    variants: [
      {
        name: "Color",
        values: [{ value: "Black" }, { value: "Red" }, { value: "Green" }],
        required: true,
      },
    ],
  },
];
