import testCoordinates from './assets/testCoordinates';
import generateHeatmapColors from './components/Algo/findCountry';
import HeatmapMap from './components/Base/heatmap';

export default function Base() {
    console.log("Test Coordinates:", testCoordinates);

    // const countryOccurrences = useMemo(() => {
    //     const result = countCountries(testCoordinates);
    //     console.log("Country Occurrences:", result);
    //     return result;
    // }, []);

    // const countryColors = useMemo(() => {
    //     const result = generateHeatmapColors(countryOccurrences);
    //     console.log("Generated Country Colors:", result);
    //     return result;
    // }, [countryOccurrences]);

    
const countryCounts: { [country: string]: number } = {
    "USA": Math.floor(Math.random() * 100),
    "Canada": Math.floor(Math.random() * 100),
    "Germany": Math.floor(Math.random() * 100),
    "France": Math.floor(Math.random() * 100),
    "Japan": Math.floor(Math.random() * 100),
    "Australia": Math.floor(Math.random() * 100),
    "Brazil": Math.floor(Math.random() * 100),
    "India": Math.floor(Math.random() * 100),
    "South Africa": Math.floor(Math.random() * 100),
    "UK": Math.floor(Math.random() * 100),
    "Singapore": Math.floor(Math.random() * 100),
    "Malaysia": Math.floor(Math.random() * 100),
    "Thailand": Math.floor(Math.random() * 100),
    "Indonesia": Math.floor(Math.random() * 100),
};

const countryColors = (() => {
    return generateHeatmapColors(countryCounts);
})();

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