import { Box, Button, Drawer, Typography } from '@mui/material';
import { format, subDays } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import CheckboxFilterSection from './CheckboxFilterSection';
import DateFilter from './DateFilter';

export default function ContextFilterDrawer({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    // The source of truth for the applied filters
    const [appliedFilters, setAppliedFilters] = useState({
        dateRange: '30',
        startDate: '',
        endDate: format(new Date(), 'yyyy-MM-dd'),
        regions: [],
        badGuys: [],
    });

    // Temporary state that holds changes made while the drawer is open
    const [tempFilters, setTempFilters] = useState({ ...appliedFilters });

    // Options for checkboxes
    const regionOptions = ['North', 'South', 'East', 'West'];
    const badGuyOptions = [
        'Hales',
        'Cinderella Stepmother',
        'Bertie',
        'Bertie 2.0',
        'Bertie 3.0',
        'Bertie 4.0',
        'Bertie 5.0',
        'Bertie 6.0',
    ];

    // Track the previous state when the drawer opens
    const prevFiltersRef = useRef({ ...appliedFilters });

    // When the drawer opens, save the current appliedFilters to prevFiltersRef
    useEffect(() => {
        if (isOpen) {
            prevFiltersRef.current = { ...appliedFilters }; // Save applied filters before editing
            setTempFilters({ ...appliedFilters }); // Set tempFilters to the appliedFilters when opening
        }
    }, [isOpen, appliedFilters]);

    const updateDateRange = (range: string) => {
        setTempFilters((prev) => ({
            ...prev,
            dateRange: range,
        }));

        const today = new Date();
        let fromDate = today;
        if (range === '30') fromDate = subDays(today, 30);
        else if (range === '90') fromDate = subDays(today, 90);
        else if (range === '365') fromDate = subDays(today, 365);

        setTempFilters((prev) => ({
            ...prev,
            endDate: format(today, 'yyyy-MM-dd'),
            startDate: format(fromDate, 'yyyy-MM-dd'),
        }));
    };

    const toggleCheckbox = (
        list: string[],
        setList: (v: string[]) => void,
        value: string
    ) => {
        setTempFilters((prev) => ({
            ...prev,
            [setList]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
        }));
    };

    const handleSelectAll = (
        list: string[],
        setList: (v: string[]) => void,
        options: string[]
    ) => {
        const allSelected = list.length === options.length;
        setTempFilters((prev) => ({
            ...prev,
            [setList]: allSelected ? [] : [...options],
        }));
    };

    const resetFilters = () => {
        setTempFilters({ ...appliedFilters }); // Reset tempFilters to appliedFilters
    };

    // Cancel button logic - revert state to previous values
    const handleCancel = () => {
        setTempFilters({ ...prevFiltersRef.current }); // Restore to the previous filters when canceling
        onClose();
    };

    const handleApply = () => {
        setAppliedFilters({ ...tempFilters }); // Apply changes and save to appliedFilters
        console.log('Applying Filters:', tempFilters);
        onClose(); // Close the drawer
    };

    return (
        <Drawer
            open={isOpen}
            onClose={onClose}
            sx={{
                width: '24rem',
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: '24rem',
                    padding: '1.5rem',
                    overflowY: 'auto',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '1rem' }}>
                    Filter Context
                </Typography>

                <DateFilter
                    dateRange={tempFilters.dateRange}
                    startDate={tempFilters.startDate}
                    endDate={tempFilters.endDate}
                    onRangeChange={updateDateRange}
                    onStartChange={(value) =>
                        setTempFilters((prev) => ({ ...prev, startDate: value }))
                    }
                    onEndChange={(value) =>
                        setTempFilters((prev) => ({ ...prev, endDate: value }))
                    }
                    sx={{ marginBottom: '1.5rem' }}
                />

                <CheckboxFilterSection
                    title="Regions"
                    options={regionOptions}
                    selected={tempFilters.regions}
                    onSelectAll={() =>
                        handleSelectAll(tempFilters.regions, setTempFilters, regionOptions)
                    }
                    onToggle={(val) => toggleCheckbox(tempFilters.regions, setTempFilters, val)}
                />

                <CheckboxFilterSection
                    title="Bad Buy Reasons"
                    options={badGuyOptions}
                    selected={tempFilters.badGuys}
                    onSelectAll={() =>
                        handleSelectAll(tempFilters.badGuys, setTempFilters, badGuyOptions)
                    }
                    onToggle={(val) => toggleCheckbox(tempFilters.badGuys, setTempFilters, val)}
                />

                {/* Footer with buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginTop: '1rem' }}>
                    <Button variant="contained" color="warning" onClick={resetFilters}>
                        Reset
                    </Button>
                    <Box>
                        <Button variant="contained" color="secondary" onClick={handleCancel} sx={{ marginRight: '0.5rem' }}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleApply}
                        >
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
}
