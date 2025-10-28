import type {ServiceCategory} from "./ServiceCategory.ts";

export interface Service {
    id: string;
    name: string;
    category: ServiceCategory;
    price: number;
    description?: string;
    Notes?: string;
}


