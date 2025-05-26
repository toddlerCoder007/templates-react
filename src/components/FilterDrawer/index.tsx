import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    Typography,
} from '@mui/material';
import { DatePicker, Radio, RadioChangeEvent, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { defaultFilterValues, FilterState, useFilterContext } from '../../contexts/FilterContext';

const { RangePicker } = DatePicker;

interface FilterDrawerProps {
    open: boolean;
    onClose: () => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ open, onClose }) => {
    const { appliedFilter, setAppliedFilter } = useFilterContext();

    const [localFilter, setLocalFilter] = useState<FilterState>(appliedFilter);
    const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
    const [resetDialogOpen, setResetDialogOpen] = useState(false);

    useEffect(() => {
        if (open) {
            setLocalFilter(appliedFilter);
        }
    }, [open, appliedFilter]);

    const hasUnsavedChanges = JSON.stringify(localFilter) !== JSON.stringify(appliedFilter);
    const isDefaultFilter = JSON.stringify(localFilter) === JSON.stringify(defaultFilterValues);

    const handleDrawerClose = () => {
        if (hasUnsavedChanges) {
            setDiscardDialogOpen(true);
        } else {
            onClose();
        }
    };

    const handleReset = () => {
        if (!isDefaultFilter) {
            setResetDialogOpen(true);
        }
    };

    const confirmReset = () => {
        setLocalFilter(defaultFilterValues);
        setResetDialogOpen(false);
    };

    const confirmDiscard = () => {
        setLocalFilter(appliedFilter);
        setDiscardDialogOpen(false);
        onClose();
    };

    const applyFilter = () => {
        setAppliedFilter(localFilter);
        onClose();
    };

    const onFilterTypeChange = (e: RadioChangeEvent) => {
        setLocalFilter({
            ...localFilter,
            filterType: e.target.value,
            dateValue: null,
        });
    };

    const renderPicker = () => {
        switch (localFilter.filterType) {
            case 'month':
                return <DatePicker
                    picker="month"
                    value={localFilter.dateValue}
                    onChange={(date) => setLocalFilter({ ...localFilter, dateValue: date })}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                // dropdownStyle={{ zIndex: 1600 }} 
                />;
            case 'quarter':
                return <DatePicker picker="quarter" value={localFilter.dateValue} onChange={(date) => setLocalFilter({ ...localFilter, dateValue: date })} getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement} />;
            case 'year':
                return <DatePicker picker="year" value={localFilter.dateValue} onChange={(date) => setLocalFilter({ ...localFilter, dateValue: date })} getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement} />;
            case 'custom':
                return <RangePicker value={localFilter.dateValue} onChange={(dates) => setLocalFilter({ ...localFilter, dateValue: dates })} getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement} />;
            default:
                return <DatePicker disabled placeholder="Date Picker disabled (Entire history)" />;
        }
    };

    return (
        <>
            <Drawer anchor="right" open={open} onClose={handleDrawerClose}>
                <Box sx={{ width: 350, p: 3 }}>
                    <Typography variant="h6" gutterBottom>Filter by Date</Typography>
                    <Space direction="vertical" size="middle">
                        <Radio.Group onChange={onFilterTypeChange} value={localFilter.filterType}>
                            <Radio value="all">Entire History</Radio>
                            <Radio value="month">By Month</Radio>
                            <Radio value="quarter">By Quarter</Radio>
                            <Radio value="year">By Year</Radio>
                            <Radio value="custom">Custom Range</Radio>
                        </Radio.Group>
                        {renderPicker()}
                    </Space>

                    <Box mt={4} display="flex" justifyContent="space-between">
                        <Button variant="outlined" color="error" onClick={handleReset}>
                            Reset to Default
                        </Button>
                        <Button variant="contained" onClick={applyFilter}>
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Drawer>

            {/* Discard Confirmation Dialog */}
            <Dialog open={discardDialogOpen} onClose={() => setDiscardDialogOpen(false)}>
                <DialogTitle>Discard Changes?</DialogTitle>
                <DialogContent>
                    <Typography>You have unsaved changes. Do you want to discard them?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDiscardDialogOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={confirmDiscard} variant="contained">Discard</Button>
                </DialogActions>
            </Dialog>

            {/* Reset Confirmation Dialog */}
            <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
                <DialogTitle>Reset Filter?</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to reset all filters to default?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmReset} variant="contained" color="warning">Reset</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FilterDrawer;
