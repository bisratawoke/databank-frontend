import { useState, useCallback } from 'react';
import { produce } from 'immer';
import { FilterState, FilterOption } from '../types/types';


export const useFilterState = (initialConfig: FilterOption[] = []) => {
    const [filterConfig, setFilterConfig] = useState<FilterOption[]>(initialConfig);
    const [filterState, setFilterState] = useState<FilterState>({
        selectedFilters: {},
        mandatoryFilters: initialConfig
            .filter(f => f.mandatory)
            .map(f => f.id)
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFilter = useCallback((filterId: string, value: any) => {
        setFilterState(
            produce(draft => {
                draft.selectedFilters[filterId] = value;
            })
        );
    }, []);

    const isFilterComplete = useCallback(() => {
        return filterState.mandatoryFilters.every(
            filterId => filterState.selectedFilters[filterId] !== undefined
        );
    }, [filterState]);

    const resetFilters = useCallback(() => {
        setFilterState({
            selectedFilters: {},
            mandatoryFilters: filterConfig
                .filter(f => f.mandatory)
                .map(f => f.id)
        });
    }, [filterConfig]);

    return {
        filterConfig,
        filterState,
        updateFilter,
        isFilterComplete,
        resetFilters
    };
};