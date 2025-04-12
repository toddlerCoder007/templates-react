// import HeatmapMap from './components/Base/heatmap';
import ContextFilter from './components/ContextFilter/ContextFilterDrawer';

export default function Base() {
    return (
        // <HeatmapMap />
        <ContextFilter isOpen={true} onClose={() => { }} />
    );
}