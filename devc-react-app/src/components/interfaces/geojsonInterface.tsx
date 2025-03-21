interface GeoJson {
    features: {
        type: string;
        id: number;
        geometry: {
            type: string;
            coordinates: number[][][] | number[][][][]; // Handle both Polygon & MultiPolygon
        };
        properties: {
            FID: number;
            COUNTRY: string;
            ISO: string;
            COUNTRYAFF: string;
            AFF_ISO: string;
            Shape__Area: number;
            Shape__Length: number;
            Incidents?: number;
        };
    }[];
}

export default GeoJson;