import { City, GeoCoordinates } from "./city.model";

export const cityMapper = (city: any): City => ({
    guid: city.guid,
    address: city.address,
    isActive: city.isActive,
    latitude: city.latitude,
    longitude: city.longitude,
    tags: city.tags
  });

export const cityToGeoCoordinates = (city: any): GeoCoordinates => ({
    latitude: city.latitude,
    longitude: city.longitude
})
export const haversine = (coord1: GeoCoordinates, coord2: GeoCoordinates): number => {
    const earthRadius = 6371; 

    const { latitude: lat1, longitude: lon1 } = coord1;
    const { latitude: lat2, longitude: lon2 } = coord2;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    
    const roundedDistance: number = parseFloat(distance.toFixed(2));
    return roundedDistance
};

const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};