export interface City {
    guid: string;
    isActive: string;
    address: string;
    latitude: number;
    longitude: number;
    tags: string[]
}

export interface GeoCoordinates{
    latitude: number;
    longitude: number;
}