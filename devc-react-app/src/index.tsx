import CountryFinder from './components/Algo/findCountry';
// import HeatmapMap from './components/Base/heatmap';
import testCoordinates from './components/Base/testCoordinates';

export default function Base() {

    return (
        <>
            {/* <HeatmapMap /> */}
            <div>
                <h1>Country Finder Test</h1>
                {testCoordinates.map(({ lat, lon }, index) => (
                    <CountryFinder key={index} lat={lat} lon={lon} />
                ))}
            </div>
        </>
    );
}
