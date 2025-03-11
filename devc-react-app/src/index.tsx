import * as turf from '@turf/turf';
import { useEffect, useState, useMemo } from "react";
import geoJsonData from "../src/assets/geo.json";
import testCoordinates from './components/Base/testCoordinates';

export default function Base() {

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
    };

    const geoJson: GeoJson = geoJsonData as GeoJson;

    const findCountry = (lat: number, lon: number): string | null => {
        const point = turf.point([lon, lat]); // Turf expects [lon, lat]

        for (const feature of geoJson.features) {
            if (!feature.geometry || !feature.geometry.coordinates) {
                console.warn("Skipping invalid geometry:", feature);
                continue;
            }

            try {
                if (feature.geometry.type === "Polygon") {
                    const polygon = turf.polygon(feature.geometry.coordinates as number[][][]);
                    if (turf.booleanPointInPolygon(point, polygon)) {
                        return feature.properties.COUNTRY;
                    }
                }
                else if (feature.geometry.type === "MultiPolygon") {
                    for (const polygonCoords of feature.geometry.coordinates as number[][][][]) {
                        const polygon = turf.polygon(polygonCoords);
                        if (turf.booleanPointInPolygon(point, polygon)) {
                            return feature.properties.COUNTRY;
                        }
                    }
                }
            } catch (error) {
                console.error("Error processing polygon:", error);
            }
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
            console.log(`Find Country by Coordinates: Lat: ${lat}, Lon: ${lon}, Country: ${country}`);
        }, [lat, lon, country]);

        return (
            <div>
                {country ? `Country: ${country}` : 'Unknown country'}
                {'\nLat: '}{lat} {'Lon: '}{lon}
            </div>
        );
    };

    return (
        <>
            <div>
                <h1>Country Finder Test</h1>
                {testCoordinates.map(({ lat, lon }, index) => (
                    <CountryFinder key={index} lat={lat} lon={lon} />
                ))}
            </div>
        </>
    );
}
