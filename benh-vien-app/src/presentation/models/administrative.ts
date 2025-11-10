// Interface cho đơn vị hành chính
export interface DonViHanhChinh {
    maDonVi: string;
    tenDonVi: string;
    cap: number;
    maDonViCha?: string;
}

// Props cho component AddressSection
export interface AddressSectionProps {
    value: any;
    onChange: (data: any) => void;
    countries: DonViHanhChinh[];
    provinces: DonViHanhChinh[];
    districts: DonViHanhChinh[];
    wards: DonViHanhChinh[];
    ethnicities: any[];
}