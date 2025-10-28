import { Patient } from "../types/patient";

export const mockPatients: Patient[] = [
    {
        id: "BN001",
        fullName: "Nguyễn Văn An",
        dateOfBirth: new Date("1985-03-15"),
        gender: "male",
        idNumber: "001085012345",
        phoneNumber: "0912345678",
        address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
        department: "Điều Trị",
        doctor: "BS. Trần Thị A",
        insuranceType: "bh",
        registrationTime: new Date(Date.now() - 30 * 60000),
        status: "waiting",
        priority: "normal"
    },
    {
        id: "BN002",
        fullName: "Trần Thị Mai",
        dateOfBirth: new Date("1992-07-20"),
        gender: "female",
        idNumber: "001092023456",
        phoneNumber: "0987654321",
        address: "456 Lê Lợi, Quận 3, TP.HCM",
        department: "Khám Bệnh",
        doctor: "BS. Lê Văn C",
        insuranceType: "private",
        registrationTime: new Date(Date.now() - 15 * 60000),
        status: "in-progress",
        priority: "urgent"
    },
    {
        id: "BN003",
        fullName: "Phạm Minh Tuấn",
        dateOfBirth: new Date("1978-11-05"),
        gender: "male",
        idNumber: "001078056789",
        phoneNumber: "0901234567",
        address: "789 Hai Bà Trưng, Quận 1, TP.HCM",
        department: "Chấn Thương Chỉnh Hình",
        doctor: "BS. Nguyễn Thị L",
        insuranceType: "bh",
        registrationTime: new Date(Date.now() - 45 * 60000),
        status: "waiting",
        priority: "urgent"
    },
    {
        id: "BN004",
        fullName: "Lê Thị Hoa",
        dateOfBirth: new Date("2000-05-12"),
        gender: "female",
        idNumber: "001000067890",
        phoneNumber: "0898765432",
        address: "321 Võ Thị Sáu, Quận 3, TP.HCM",
        department: "Gây Mê Hồi Sức",
        insuranceType: "none",
        registrationTime: new Date(Date.now() - 10 * 60000),
        status: "waiting",
        priority: "normal"
    }
];



