export interface FieldType {
    _id: string;
    name: string;
    description: string;
    exampleValue: string;
};


export interface Field {
    _id?: string;
    name: string;
    filtered: boolean;
    type: FieldType;
    options: string[];
};
export interface Report {
    id: string;
    name: string;
    fields: Field[];
}


export interface FilterOption {
    id: string;
    name: string;
    type: 'select' | 'input' | 'checkbox' | 'range';
    options?: string[];
    mandatory?: boolean;
}

export interface FilterState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectedFilters: Record<string, any>;
    mandatoryFilters: string[];
}


export interface Subcategory {
    _id: string;
    name: string;
    report?: Report[];
}

export interface Category {
    _id: string;
    name: string;
    subcategory: Subcategory[];
}

export interface Report {
    _id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    data_status: string;
}

export interface Department {
    _id: string;
    name: string;
    category: Category[];
}

export interface FilterSidebarProps {
    departments: Department[];
    selectedFilters: {
        departments: string[];
        categories: string[];
        subcategories: string[];
    };
    onFilterChange: (
        filterType: "departments" | "categories" | "subcategories",
        id: string
    ) => void;
    onResetFilters?: () => void;
}

export interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}