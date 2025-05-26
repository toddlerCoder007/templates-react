import React, { createContext, useContext, useState } from 'react';

export type FilterType = 'all' | 'month' | 'quarter' | 'year' | 'custom';

export interface FilterState {
    filterType: FilterType;
    dateValue: any;
}

const defaultFilter: FilterState = {
    filterType: 'all',
    dateValue: null,
};

const FilterContext = createContext<{
    appliedFilter: FilterState;
    setAppliedFilter: (filter: FilterState) => void;
}>({
    appliedFilter: defaultFilter,
    setAppliedFilter: () => { },
});

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [appliedFilter, setAppliedFilter] = useState<FilterState>(defaultFilter);
    return (
        <FilterContext.Provider value={{ appliedFilter, setAppliedFilter }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilterContext = () => useContext(FilterContext);
export const defaultFilterValues = defaultFilter;
