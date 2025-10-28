import {ServiceOrderEntity} from "../../../domain/entities/ServiceOrderEntity.ts";
export const mockServiceOrders: ServiceOrderEntity[] = [
    {
        id: "SO001",
        patientId: "BN001",
        patientName: "Nguyễn Văn An",
        serviceId: "XN001",
        serviceName: "Xét nghiệm máu tổng quát",
        category: "XN",
        orderDate: new Date(Date.now() - 60 * 60000),
        status: "completed",
        orderedBy: "BS. Trần Thị B",
        notes: "Xét nghiệm trước phẫu thuật",
        result: "Các chỉ số bình thường",
        completedDate: new Date(Date.now() - 30 * 60000)
    },
    {
        id: "SO002",
        patientId: "BN002",
        patientName: "Trần Thị Mai",
        serviceId: "CDHA003",
        serviceName: "Siêu âm bụng tổng quát",
        category: "CDHA",
        orderDate: new Date(Date.now() - 45 * 60000),
        status: "in-progress",
        orderedBy: "BS. Lê Văn C",
        notes: "Đau bụng, cần kiểm tra gan mật"
    },
    {
        id: "SO003",
        patientId: "BN003",
        patientName: "Phạm Minh Tuấn",
        serviceId: "CDHA001",
        serviceName: "X-quang phổi",
        category: "X_Quang",
        orderDate: new Date(Date.now() - 50 * 60000),
        status: "pending",
        orderedBy: "BS. Nguyễn Thị L",
        notes: "Ho kéo dài, cần chụp X-quang"
    },

];

export const getCategoryName = (category: string): string => {
    switch (category) {
        case "XN":
            return "Xét nghiệm";
        case "CDHA":
            return "Chẩn đoán hình ảnh";
        case "MRI":
            return "MRI";
        case "X_Quang":
            return "X_Quang";
        default:
            return "Khác";
    }
};