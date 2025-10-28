import  {ServiceOrder} from "./ServiceOrder.ts";
import {ServiceCategory} from "./ServiceCategory.ts";
import type {ServiceOrderStatus} from "./ServiceOderStatus.ts";

export class ServiceOrderEntity implements ServiceOrder {
    constructor(
        public id: string,
        public patientId: string,
        public patientName: string,
        public serviceId: string,
        public serviceName: string,
        public category: ServiceCategory,
        public orderDate: Date,
        public status: ServiceOrderStatus,
        public orderedBy: string,
        public notes?: string,
        public result?: string,
        public completedDate?: Date
    ) {
    }

    isPending(): boolean {
        return this.status === "pending";
    }

    isInProgress(): boolean {
        return this.status === "in-progress";
    }

    isCompleted(): boolean {
        return this.status === "completed";
    }

    isCancelled(): boolean {
        return this.status === "cancelled";
    }

    canStart(): boolean {
        return this.status === "pending";
    }

    canComplete(): boolean {
        return this.status === "in-progress";
    }

    canCancel(): boolean {
        return this.status === "pending";
    }

    hasResult(): boolean {
        return !!this.result;
    }

    getDuration(): number | null {
        if (!this.completedDate) return null;
        return this.completedDate.getTime() - this.orderDate.getTime();
    }

    getStatusDisplay(): string {
        const statusMap: Record<ServiceOrderStatus, string> = {
            "pending": "Chờ thực hiện",
            "in-progress": "Đang thực hiện",
            "completed": "Hoàn thành",
            "cancelled": "Đã hủy"
        };
        return statusMap[this.status];
    }
}