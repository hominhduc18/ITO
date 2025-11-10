import { DonViHanhChinh } from '@presentation/models/administrative';


export class AdministrativeService {

    static async fetchDonViHanhChinh(cap: number): Promise<DonViHanhChinh[]> {
        try {
            const response = await fetch(`/api/DonViHanhChinh/GetAllByCap/${cap}`);
            const result = await response.json();

            if (result.success && result.data) {
                return result.data;
            }
            return [];
        } catch (error) {
            console.error(`Error loading cap ${cap}:`, error);
            return [];
        }
    }

    /**
     * Lấy danh sách quận/huyện theo tỉnh/thành phố
     */
    static async loadDistricts(provinceCode: string): Promise<DonViHanhChinh[]> {
        try {
            const response = await fetch(`/api/DonViHanhChinh/GetAllByCap/3?maDonViCha=${provinceCode}`);
            const result = await response.json();

            if (result.success && result.data) {
                return result.data;
            }
            return [];
        } catch (error) {
            console.error('Error loading districts:', error);
            return [];
        }
    }

    /**
     * Lấy danh sách xã/phường theo quận/huyện
     */
    static async loadWards(districtCode: string): Promise<DonViHanhChinh[]> {
        try {
            const response = await fetch(`/api/DonViHanhChinh/GetAllByCap/4?maDonViCha=${districtCode}`);
            const result = await response.json();

            if (result.success && result.data) {
                return result.data;
            }
            return [];
        } catch (error) {
            console.error('Error loading wards:', error);
            return [];
        }
    }

    /**
     * Lấy danh sách dân tộc
     */
    static async loadEthnicities(): Promise<any[]> {
        try {
            const response = await fetch('/api/DanToc');
            if (response.ok) {
                const data = await response.json();
                return data.data || [];
            }
            return [];
        } catch (error) {
            console.error('Error loading ethnicities:', error);
            return [];
        }
    }

    /**
     * Lấy danh sách Bac si theo chi nhanh
     */

}