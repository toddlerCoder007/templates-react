import {
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { regionToCountries } from "./regionToCountries";

const allCountries = Object.values(regionToCountries).flat();

const RegionCountrySelector: React.FC = () => {
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

    const handleRegionChange = (region: string, checked: boolean) => {
        const regionCountries = regionToCountries[region];
        setSelectedRegions(prev =>
            checked ? [...prev, region] : prev.filter(r => r !== region)
        );

        setSelectedCountries(prev => {
            return checked
                ? Array.from(new Set([...prev, ...regionCountries]))
                : prev.filter(c => !regionCountries.includes(c));
        });
    };

    useEffect(() => {
        const updatedRegions = Object.entries(regionToCountries)
            .filter(([region, countries]) =>
                countries.every(country => selectedCountries.includes(country))
            )
            .map(([region]) => region);

        setSelectedRegions(updatedRegions);
    }, [selectedCountries]);

    return (
        <div>
            <h3>Regions</h3>
            {Object.keys(regionToCountries).map(region => {
                const countries = regionToCountries[region];
                const allSelected = countries.every(c =>
                    selectedCountries.includes(c)
                );
                const someSelected =
                    countries.some(c => selectedCountries.includes(c)) && !allSelected;

                return (
                    <FormControlLabel
                        key={region}
                        control={
                            <Checkbox
                                checked={allSelected}
                                indeterminate={someSelected}
                                onChange={e => handleRegionChange(region, e.target.checked)}
                            />
                        }
                        label={region}
                    />
                );
            })}

            <h3>Countries</h3>
            <FormControl sx={{ width: 300 }}>
                <InputLabel>Countries</InputLabel>
                <Select
                    multiple
                    value={selectedCountries}
                    onChange={e =>
                        setSelectedCountries(
                            typeof e.target.value === "string"
                                ? e.target.value.split(",")
                                : e.target.value
                        )
                    }
                    input={<OutlinedInput label="Countries" />}
                    renderValue={selected => selected.join(", ")}
                >
                    {allCountries.map(country => (
                        <MenuItem key={country} value={country}>
                            <Checkbox checked={selectedCountries.includes(country)} />
                            <ListItemText primary={country} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default RegionCountrySelector;
