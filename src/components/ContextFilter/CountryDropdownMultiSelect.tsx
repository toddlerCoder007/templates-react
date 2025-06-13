import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  Autocomplete,
  Box,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { IFilterSectionProps } from "../../interfaces/FilterSectionProps.interface";
import { allCountries } from "../../utils/CountriesRegionList.util";

export const CountryDropdownMultiSelect: React.FC<IFilterSectionProps> = ({
  filters,
  setFilters,
}: IFilterSectionProps) => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const handleCountryChange = (newCountries: string[]) => {
    const newRegions = [
      ...new Set(
        allCountries
          .filter((c) => newCountries.includes(c.name))
          .map((c) => c.region),
      ),
    ];

    setFilters((prev) => ({
      ...prev,
      regions: newRegions,
      countries: newCountries,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "hsl(220, 14%, 96%)",
        paddingBottom: 2,
        paddingLeft: 2,
        paddingRight: 2,
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Typography sx={{ fontSize: "10px", color: "#121212" }}>
        Countries
      </Typography>
      <Autocomplete
        data-testid="country-dropdown"
        multiple
        limitTags={2}
        renderTags={(value, getTagProps) => {
          const tags = value.slice(0, 2).map((option, index) => (
            <Chip label={option} {...getTagProps({ index })} key={option} />
          ));
          if (value.length > 2) {
            tags.push(
              <Chip
                key="more"
                label={`+${value.length - 2} more`}
                style={{ marginLeft: 4 }}
                disabled
              />
            );
          }
          return tags;
        }}
        onChange={(_, value) => handleCountryChange(value)}
        options={allCountries.map((c) => c.name)}
        value={filters.countries}
        getOptionLabel={(option) => option}
        disableCloseOnSelect
        renderOption={(props, option, { selected }) => {
          const { ...optionProps } = props;
          return (
            <li {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                checked={selected}
              />
              {option}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              "& .MuiInputBase-root": {
                height: "50px",
                padding: "2px",
                overflow: "hidden",
              },
              "& .MuiAutocomplete-inputRoot": {
                flexWrap: "nowrap",
              },
            }}
          />
        )}
        slotProps={{
          paper: {
            sx: {
              "& .MuiAutocomplete-listbox": {
                fontSize: "14px",
              },
            },
          },
        }}
        sx={{
          maxWidth: "100%",
        }}
      />
    </Box>
  );
};
