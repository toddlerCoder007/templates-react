import * as turf from '@turf/turf';
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

const countCountries = (coordinates: { lat: number; lon: number }[]) => {
    const countryCounts: { [country: string]: number } = {};
    for (const { lat, lon } of coordinates) {
        const country = findCountry(lat, lon);
        countryCounts[country] = (countryCounts[country] || 0) + 1;
    }

    return countryCounts;
};

const hslToRgba = (h: number, s: number, l: number, a: number): [number, number, number, number] => {
    s /= 100;
    l /= 100;

    const k = (n: number) => (n + h / 30) % 12;
    const f = (n: number) => l - s * Math.max(Math.min(k(n) - 3, 9 - k(n), 1), -1);

    const r = Math.min(255, Math.max(0, Math.round(f(0) * 255)));
    const g = Math.min(255, Math.max(0, Math.round(f(8) * 255)));
    const b = Math.min(255, Math.max(0, Math.round(f(4) * 255)));

    return [r, g, b, a]; // Alpha stays unchanged
};


const generateHeatmapColors = (countryCounts: { [country: string]: number }) => {
    const maxCount = Math.max(...Object.values(countryCounts), 1); // Avoid division by zero

    const countryColors: { [country: string]: [number, number, number, number] } = {};

    for (const feature of geoJson.features) {
        const country = feature.properties.COUNTRY;
        const count = countryCounts[country] || 0;

        if (count === 0) {
            countryColors[country] = [211, 211, 211, 0.3]; // Light gray for zero occurrences
        } else {
            // Scale Hue from 60° (yellow) to 0° (red) based on count
            const hue = 60 - (count / maxCount) * 60;
            const opacity = 0.3 + (count / maxCount) * 0.7;

            countryColors[country] = hslToRgba(hue, 100, 50, opacity);
        }
    }

    return countryColors;
};

export { countCountries, findCountry, generateHeatmapColors };
