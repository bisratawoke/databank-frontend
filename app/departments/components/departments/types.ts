
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