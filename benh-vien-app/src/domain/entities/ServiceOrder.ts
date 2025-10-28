import type {ServiceCategory} from "./ServiceCategory.ts";
import {ServiceOrderStatus} from "./ServiceOderStatus.ts";


export interface ServiceOrder {
    id: string;
    patientId: string;
    patientName: string;
    serviceId: string;
    serviceName: string;
    category: ServiceCategory;
    orderDate: Date;
    status: ServiceOrderStatus;
    orderedBy: string;
    notes?: string;
    result?: string;
    completedDate?: Date;
}