import HeatmapMapPolygon from './components/Base/heatmap';

export default function Base() {
    const countryColors: { [country: string]: [number, number, number, number] } = {
        "Singapore": [0, 0, 0, 0.5],  // 🔴 Red
        "Malaysia": [0, 0, 255, 0.5],  // 🔵 Blue
        "Indonesia": [0, 255, 0, 0.5],  // 🟢 Green
        "Thailand": [255, 165, 0, 0.5],  // 🟠 Orange
        "Philippines": [75, 0, 130, 0.5]  // 🟣 Purple
    };

    return (
        <HeatmapMapPolygon countryColors={countryColors}/>
    )
}