
export interface Department {
    _id: string;
    name: string;
    category: Category[];
}

export interface Category {
    _id: string;
    name: string;
    subcategory: SubCategory[];
}

export interface SubCategory {
    _id: string;
    name: string;
    report: Report[];
}

export interface Report {
    _id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    fields: Field[];
    data: DataItem[];
    status: string;
}

export interface Field {
    _id: string;
    name: string;
    type: {
        _id: string;
        name: string;
        description: string;
        exampleValue: string;
    };
    filtered: boolean;
    required: boolean;
    description: string;
    defaultValue: string;
}

export interface DataItem {
    _id: string;
    field: Field;
    value: string;
}

export interface SelectedItemsState {
    [fieldId: string]: {
        type: "discrete";
        selectedValues: Set<string>;
    };
}