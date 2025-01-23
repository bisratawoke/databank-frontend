
export interface Report {
  _id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  fields: string[];
  data: string[];
}

export interface SubCategory {
  _id: string;
  name: string;
  report: Report[];
}

export interface Category {
  _id: string;
  name: string;
  subcategory: SubCategory[];
}

export interface Department {
  _id: string;
  name: string;
  category: Category[];
}
