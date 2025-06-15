import { DatePicker } from '@mui/lab';
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { endOfMonth, endOfQuarter, endOfYear, startOfMonth, startOfQuarter, startOfYear } from 'date-fns';
import React, { useState } from 'react';

const DateFilter = ({ tempFilters, setTempFilters }: any) => {
    const [selectedOption, setSelectedOption] = useState('Entire History');
    const [startDate, setStartDate] = useState(tempFilters.startDate);
    const [endDate, setEndDate] = useState(tempFilters.endDate);

    const handleDateChange = (value: any, isStart: boolean) => {
        if (isStart) {
            setStartDate(value);
            setTempFilters({ ...tempFilters, startDate: value });
        } else {
            setEndDate(value);
            setTempFilters({ ...tempFilters, endDate: value });
        }
    };

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.value;
        setSelectedOption(selected);
        if (selected === 'Entire History') {
            setStartDate(null);
            setEndDate(null);
            setTempFilters({ ...tempFilters, startDate: null, endDate: null });
        }
    };

    const handleApplyFilter = () => {
        if (selectedOption === 'Filter by Month') {
            const firstDayOfMonth = startOfMonth(startDate);
            const lastDayOfMonth = endOfMonth(startDate);
            setTempFilters({ ...tempFilters, startDate: firstDayOfMonth, endDate: lastDayOfMonth });
        }
        if (selectedOption === 'Filter by Quarter') {
            const firstDayOfQuarter = startOfQuarter(startDate);
            const lastDayOfQuarter = endOfQuarter(startDate);
            setTempFilters({ ...tempFilters, startDate: firstDayOfQuarter, endDate: lastDayOfQuarter });
        }
        if (selectedOption === 'Filter by Year') {
            const firstDayOfYear = startOfYear(startDate);
            const lastDayOfYear = endOfYear(startDate);
            setTempFilters({ ...tempFilters, startDate: firstDayOfYear, endDate: lastDayOfYear });
        }
        if (selectedOption === 'CustomRange') {
            setTempFilters({ ...tempFilters, startDate, endDate });
        }
    };

    return (
        <div>
            <FormControl component="fieldset">
                <FormLabel component="legend">Select Filter</FormLabel>
                <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                    <FormControlLabel value="Entire History" control={<Radio />} label="Entire History" />
                    <FormControlLabel value="Filter by Month" control={<Radio />} label="Filter by Month" />
                    <FormControlLabel value="Filter by Quarter" control={<Radio />} label="Filter by Quarter" />
                    <FormControlLabel value="Filter by Year" control={<Radio />} label="Filter by Year" />
                    <FormControlLabel value="CustomRange" control={<Radio />} label="Custom Range" />
                </RadioGroup>
            </FormControl>

            {selectedOption !== 'Entire History' && selectedOption !== 'CustomRange' && (
                <DatePicker
                    views={['year', 'month']}
                    label="Select Date"
                    value={startDate}
                    onChange={(newValue) => handleDateChange(newValue, true)}
                    renderInput={(props) => <TextField {...props} />}
                />
            )}

            {selectedOption === 'CustomRange' && (
                <div>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => handleDateChange(newValue, true)}
                        renderInput={(props) => <TextField {...props} />}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => handleDateChange(newValue, false)}
                        renderInput={(props) => <TextField {...props} />}
                    />
                </div>
            )}

            <Button onClick={handleApplyFilter}>Apply Filter</Button>
        </div>
    );
};

export default DateFilter;
