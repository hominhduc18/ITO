import {ServiceEntity} from "../entities/ServiceEntity.ts";
import {ServiceOrder} from "../entities/ServiceOrder.ts";
import {ServiceCategory} from "../entities/ServiceCategory.ts";
import type {ServiceOrderEntity} from "../entities/ServiceOrderEntity.ts";
import type  {ServiceOderStatus} from "../entities/ServiceOderStatus.ts";

export interface IServiceRepository {
    getAllServices(): Promise<ServiceEntity[]>;
    getServiceById(id: string): Promise<ServiceEntity | null>;
    getServicesByCategory(category: ServiceCategory): Promise<ServiceEntity[]>;

    // Service Order methods
    getAllOrders(): Promise<ServiceOrderEntity[]>;
    getOrderById(id: string): Promise<ServiceOrderEntity | null>;
    getOrdersByPatientId(patientId: string): Promise<ServiceOrderEntity[]>;
    getOrdersByStatus(status: ServiceOderStatus): Promise<ServiceOrderEntity[]>;

    // Command methods
    createOrder(order: ServiceOrderEntity): Promise<ServiceOrderEntity>;
    updateOrder(id: string, order: Partial<ServiceOrderEntity>): Promise<ServiceOrderEntity>;
    deleteOrder(id: string): Promise<void>;

    // Specific operations
    updateOrderStatus(id: string, status: ServiceOderStatus, result?: string): Promise<ServiceOrderEntity>;
    completeOrder(id: string, result: string): Promise<ServiceOrderEntity>;
    cancelOrder(id: string): Promise<ServiceOrderEntity>;

}