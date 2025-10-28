import {Service} from "./Service.ts";
import type {ServiceCategory} from "./ServiceCategory.ts";

export class ServiceEntity implements Service {
    constructor(
        public id: string,
        public name: string,
        public category: ServiceCategory,
        public price: number,
        public description?: string,
        public Notes?: string
    ) {
    }

    isPaid():boolean{
        return this.price > 0;
    }
    getFormattedPrice(): string {
        return this.price.toLocaleString('vi-VN') + 'đ';
    }
    requiresNotes(): boolean {
        return !!this.Notes;
    }

    getCategoryName(): string {
        const categoryNames: Record<ServiceCategory, string> = {
            "XN": "Xét nghiệm",
            "CDHA": "Chẩn đoán hình ảnh",
            "MRI": "MRI",
            "X_Quang": "X_Quang",
            "SA":"Siêu Âm",
            "khac": "Khác"
        };
        return categoryNames[this.category] || "Khác";
    }

}