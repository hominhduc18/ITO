import { DoctorResponse } from "@presentation/models/doctor";
import { api } from "@infra/http/httpClient";

export class DoctorService {
    static async getDoctorsByBranch(chiNhanh_Id: string): Promise<any[]> {
        try {
            const response = await fetch(`http://localhost:5153/api/Users/GetBacSi/${chiNhanh_Id}`);
            if (response.ok) {
                const data: DoctorResponse = await response.json();
                return data.data || [];
            }
            return [];
        } catch (error) {
            console.error('Error loading doctors:', error);
            return [];
        }
    }


}