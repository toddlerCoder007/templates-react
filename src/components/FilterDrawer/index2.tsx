import { Box, Button, Drawer, Typography } from '@mui/material';
import { useState } from 'react';
import DateFilter from '../DateTime/dateTime2';
const FilterDrawer = () => {
    const [tempFilters, setTempFilters] = useState({
        startDate: null,
        endDate: null,
    });
    const [appliedFilters, setAppliedFilters] = useState({
        startDate: null,
        endDate: null,
    });
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleApplyFilter = () => {
        setAppliedFilters({ ...tempFilters });
        setDrawerOpen(false); // Close drawer after applying
    };

    const handleToggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleToggleDrawer}>
                Open Filter Drawer
            </Button>

            <Drawer anchor="right" open={drawerOpen} onClose={handleToggleDrawer}>
                <Box sx={{ width: 250, padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Date Filter
                    </Typography>

                    <DateFilter tempFilters={tempFilters} setTempFilters={setTempFilters} />

                    <Box mt={2}>
                        <Button variant="contained" color="primary" onClick={handleApplyFilter}>
                            Apply
                        </Button>
                    </Box>

                    <Box mt={3}>
                        <Typography variant="body1" color="textSecondary">
                            <strong>Selected Filter:</strong>
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {`Start Date: ${appliedFilters.startDate ? appliedFilters.startDate.toLocaleDateString() : 'Not Set'}`}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {`End Date: ${appliedFilters.endDate ? appliedFilters.endDate.toLocaleDateString() : 'Not Set'}`}
                        </Typography>
                    </Box>
                </Box>
            </Drawer>
        </div>
    );
};

export default FilterDrawer;
