export interface Patient {
    id: string;
    fullName: string;
    dateOfBirth: Date;
    gender: "male" | "female" | "other";
    idNumber: string;
    phoneNumber: string;
    address: string;
    department: string;
    doctor?: string;
    insuranceType: "bh" | "private" | "none";
    registrationTime: Date;
    status: "waiting" | "in-progress" | "completed";
    priority: "normal" | "urgent";
}