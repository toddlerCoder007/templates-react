import { Button } from '@mui/material';
import { useState } from 'react';
import FilterDrawer from '../components/FilterDrawer';
import { FilterProvider } from '../contexts/FilterContext';

const PageWithFilter = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <FilterProvider>
            <Button variant="outlined" onClick={() => setDrawerOpen(true)}>
                Open Filter Drawer
            </Button>
            <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </FilterProvider>
    );
};

export default PageWithFilter;
