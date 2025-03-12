import { useMemo } from 'react';
import { countCountries, generateHeatmapColors } from './components/Algo/findCountry';
import HeatmapMap from './components/Base/heatmap';
import testCoordinates from './components/Base/testCoordinates';

export default function Base() {
    console.log("Test Coordinates:", testCoordinates);

    const countryOccurrences = useMemo(() => {
        const result = countCountries(testCoordinates);
        console.log("Country Occurrences:", result);
        return result;
    }, []);

    const countryColors = useMemo(() => {
        const result = generateHeatmapColors(countryOccurrences);
        console.log("Generated Country Colors:", result);
        return result;
    }, [countryOccurrences]);

    // const countryColors: { [country: string]: [number, number, number, number] } = {
    //     "Singapore": [0, 0, 0, 0.5],  // 🔴 Red
    //     "Malaysia": [0, 0, 255, 0.5],  // 🔵 Blue
    //     "Indonesia": [0, 255, 0, 0.5],  // 🟢 Green
    //     "Thailand": [255, 165, 0, 0.5],  // 🟠 Orange
    //     "Philippines": [75, 0, 130, 0.5]  // 🟣 Purple
    // };

    return (
        <div>
            {/* <h1>Debugging Heatmap</h1> */}
            {/* <pre>{JSON.stringify(countryColors, null, 2)}</pre> */}
            <HeatmapMap countryColors={countryColors} />
        </div>
    );
}