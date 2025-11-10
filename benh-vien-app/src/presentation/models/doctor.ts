
export interface Doctor {
    user_Id: number;
    user_Code: string;
    user_Name: string;
    english: string;
    phongBan_Id: number | null;
    tenPhongBan: string;
    chucDanh_Id: number;
    chucVu_Id: number;
}

export interface DoctorResponse {
    success: boolean;
    message: string;
    data: Doctor[];
}