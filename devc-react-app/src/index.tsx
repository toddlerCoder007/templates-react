import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import { useState } from 'react';
import HeatmapMap from './components/Base/heatmap';
import ContextFilter from './components/ContextFilter/ContextFilterDrawer';

export default function Base() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Toggle drawer visibility
    const toggleDrawer = () => {
        setIsDrawerOpen(prevState => !prevState);
    };

    return (
        <>
            {/* MUI AppBar with Toolbar */}
            <AppBar position="sticky">
                <Toolbar>
                    {/* Hamburger Menu Button inside the Toolbar */}
                    <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                        <MenuIcon /> {/* MUI Hamburger Icon */}
                    </IconButton>

                    {/* Title */}
                    <h1 style={{ marginLeft: '16px' }}>Heatmap Dashboard</h1>
                </Toolbar>
            </AppBar>

            {/* Map Container */}
            <div className="heatmap-map-container" style={{ height: 'calc(100vh - 64px)' }}> {/* Adjust for AppBar height */}
                <HeatmapMap />
            </div>

            {/* Context Filter Drawer */}
            <ContextFilter isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        </>
    );
}
