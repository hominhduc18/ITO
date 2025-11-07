// Interface cho bệnh nhân từ API
export interface Patient {
    benhNhan_Id: number;
    maYTe: number;
    tenBenhNhan: string;
    soDienThoai: string | null;
    cmnd: string | null;
    ngaySinh?: string;
    gioiTinh?: string;
    diaChi?: string;
    ngayTao?: string;
}

// Props cho component PatientForm
export interface PatientFormProps {
    value: any;
    onChange: (data: any) => void;
    errors?: any;
    onSubmit?: (data: any) => Promise<void>;
    loading?: boolean;
}

// Props cho component PatientSearch
export interface PatientSearchProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    searchType: 'maYTe' | 'tenBenhNhan' | 'soDienThoai' | 'cmnd';
    setSearchType: (type: 'maYTe' | 'tenBenhNhan' | 'soDienThoai' | 'cmnd') => void;
    searchResults: Patient[];
    isSearching: boolean;
    onSelectPatient: (patient: Patient) => void;
    onNewPatient: () => void;
    selectedPatientId?: number;
}