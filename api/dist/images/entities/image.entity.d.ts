export declare enum ImageType {
    ARTIST = "ARTIST",
    GALLERY = "GALLERY"
}
export declare class ArtistImage {
    id: string;
    url: string;
    type: ImageType;
    description: string;
}
