import * as turf from '@turf/turf';
import { useEffect, useMemo } from "react";
import geoJsonData from "../../assets/geo.json";

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
        };
    }[];
}

const geoJson: GeoJson = geoJsonData as GeoJson;

const handlePolygon = (point: GeoJSON.Feature<GeoJSON.Point>, feature: GeoJson['features'][0]): string | null => {
    try {
        const polygon = turf.polygon([feature.geometry.coordinates[0] as number[][]]);
        if (turf.booleanPointInPolygon(point, polygon)) {
            return feature.properties.COUNTRY;
        }
    } catch (error) {
        console.error("Error processing Polygon:", error);
    }
    return null;
};

const handleMultiPolygon = (point: GeoJSON.Feature<GeoJSON.Point>, feature: GeoJson['features'][0]): string | null => {
    try {
        for (const polygonCoords of feature.geometry.coordinates as number[][][][]) {
            const polygon = turf.polygon(polygonCoords);
            if (turf.booleanPointInPolygon(point, polygon)) {
                return feature.properties.COUNTRY;
            }
        }
    } catch (error) {
        console.error("Error processing MultiPolygon:", error);
    }
    return null;
};

const findCountry = (lat: number, lon: number): string => {
    const point = turf.point([lon, lat]);

    for (const feature of geoJson.features) {
        if (!feature.geometry?.coordinates) {
            console.warn("Skipping invalid geometry:", feature);
            continue;
        }

        let country: string | null = null;
        if (feature.geometry.type === "Polygon") {
            country = handlePolygon(point, feature);
        } else if (feature.geometry.type === "MultiPolygon") {
            country = handleMultiPolygon(point, feature);
        }

        if (country) return country;
    }

    return "Unknown"; // If no country matches
};

interface CountryFinderProps {
    lat: number;
    lon: number;
}

const CountryFinder: React.FC<CountryFinderProps> = ({ lat, lon }) => {
    const country = useMemo(() => findCountry(lat, lon), [lat, lon]);

    useEffect(() => {
        console.log(`🔍 Searching for country at Lat: ${lat}, Lon: ${lon} → Found: ${country}`);
    }, [lat, lon, country]);

    return (
        <div>
            <strong>Country:</strong> {country} <br />
            <strong>Coordinates:</strong> [{lat}, {lon}]
        </div>
    );
};

export default CountryFinder;
