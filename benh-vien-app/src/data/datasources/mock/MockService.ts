
import {ServiceEntity} from "../../../domain/entities/ServiceEntity.ts";
import type {ServiceCategory} from "../../../domain/entities/ServiceCategory.ts";



export const medicalServices: ServiceEntity[] = [
    // Xét nghiệm
    {
        id: "XN001",
        name: "Xét nghiệm máu tổng quát",
        category: "XN",
        price: 150000,
        description: "Công thức máu, số lượng hồng cầu, bạch cầu, tiểu cầu",
        Notes: "Nhịn ăn 8 tiếng trước khi xét nghiệm"
    },
    {
        id: "XN002",
        name: "Xét nghiệm sinh hóa máu",
        category: "XN",
        price: 200000,
        description: "Glucose, Cholesterol, Triglycerid, GOT, GPT",
        Notes: "Nhịn ăn 12 tiếng trước khi xét nghiệm"
    },
    {
        id: "XN003",
        name: "Xét nghiệm nước tiểu",
        category: "XN",
        price: 80000,
        description: "Phân tích nước tiểu 10 thông số"
    },
    {
        id: "XN004",
        name: "Xét nghiệm chức năng gan",
        category: "XN",
        price: 180000,
        description: "GOT, GPT, GGT, Bilirubin"
    },
    {
        id: "XN005",
        name: "Xét nghiệm chức năng thận",
        category: "XN",
        price: 180000,
        description: "Urea, Creatinin, Acid Uric"
    },
    {
        id: "XN006",
        name: "Xét nghiệm đường huyết",
        category: "XN",
        price: 50000,
        description: "Đo nồng độ glucose trong máu"
    },

    // Chẩn đoán hình ảnh
    {
        id: "CDHA001",
        name: "X-quang phổi",
        category: "X-quang",
        price: 120000,
        description: "Chụp X-quang phổi thẳng"
    },
    {
        id: "CDHA002",
        name: "X-quang cột sống",
        category: "X-quang",
        price: 150000,
        description: "Chụp X-quang cột sống thẳng và nghiêng"
    },
    {
        id: "CDHA003",
        name: "Siêu âm bụng tổng quát",
        category: "SA",
        price: 200000,
        description: "Siêu âm gan, mật, tụy, lách, thận"
    },
    {
        id: "CDHA004",
        name: "Siêu âm tim",
        category: "SA",
        price: 300000,
        description: "Siêu âm Doppler tim"
    },
    {
        id: "CDH005",
        name: "CT Scanner sọ não",
        category: "CDHA",
        price: 1500000,
        description: "Chụp CT Scanner sọ não có thuốc cản quang"
    },
    {
        id: "CDH006",
        name: "MRI não",
        category: "MRI",
        price: 3000000,
        description: "Chụp MRI não có thuốc cản quang"
    },
    {
        id: "CDH007",
        name: "X-quang xương khớp",
        category: "X_Quang",
        price: 100000,
        description: "Chụp X-quang xương khớp 1 vị trí"
    },


    {
        id: "DT001",
        name: "Điện tim",
        category: "Khác",
        price: 80000,
        description: "Điện tim đồ 12 chuyển đạo"
    },
    {
        id: "TDC002",
        name: "Điện não đồ",
        category: "Khác",
        price: 200000,
        description: "Ghi điện não đồ"
    },
    {
        id: "TDC003",
        name: "Đo huyết áp 24h",
        category: "Khác",
        price: 300000,
        description: "Theo dõi huyết áp liên tục 24 giờ"
    },
    {
        id: "TDC004",
        name: "Đo điện cơ",
        category: "Khác",
        price: 250000,
        description: "Đo điện cơ tứ chi"
    },
    {
        id: "TDC005",
        name: "Đo chức năng hô hấp",
        category: "Khác",
        price: 200000,
        description: "Đo sức thông khí phổi"
    }
]




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
