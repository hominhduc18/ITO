import { Patient } from '../types/patient';


export class PatientService {
    /**
     * Tìm kiếm bệnh nhân theo các tiêu chí khác nhau
     */
    static async searchPatients(searchValue: string, searchType: string): Promise<Patient[]> {
        if (!searchValue.trim()) {
            return [];
        }

        try {
            let apiUrl = '';

            switch (searchType) {
                case 'maYTe':
                    apiUrl = `/api/BenhNhan/GetBenhNhanByMaYTe/${searchValue}`;
                    break;
                case 'tenBenhNhan':
                    apiUrl = `/api/BenhNhan/search?tenBenhNhan=${encodeURIComponent(searchValue)}`;
                    break;
                case 'soDienThoai':
                    apiUrl = `/api/BenhNhan/search?soDienThoai=${encodeURIComponent(searchValue)}`;
                    break;
                case 'cmnd':
                    apiUrl = `/api/BenhNhan/search?cmnd=${encodeURIComponent(searchValue)}`;
                    break;
                default:
                    apiUrl = `/api/BenhNhan/search?keyword=${encodeURIComponent(searchValue)}`;
            }

            const response = await fetch(apiUrl);
            const result = await response.json();

            if (result.success && result.data) {
                return Array.isArray(result.data) ? result.data : [result.data];
            }
            return [];
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    }
}