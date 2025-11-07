import React from 'react';
import { TextInput, Select } from '../Field';

/**
 * Props cho component PatientInfo
 */
interface PatientInfoProps {
    value: any;
    onChange: (data: any) => void;
    errors?: any;
    countries: any[];
    ethnicities: any[];
    insuranceSearch: string;
    setInsuranceSearch: (value: string) => void;
    showInsuranceResults: boolean;
    setShowInsuranceResults: (value: boolean) => void;
    onSelectInsurance: (insurance: string) => void;
    filteredInsurances: string[];
}

/**
 * Component hiển thị form thông tin bệnh nhân
 * Bao gồm các thông tin cá nhân cơ bản và bảo hiểm
 */
export const PatientInfo: React.FC<PatientInfoProps> = ({
                                                            value,
                                                            onChange,
                                                            errors,
                                                            countries,
                                                            ethnicities,
                                                            insuranceSearch,
                                                            setInsuranceSearch,
                                                            showInsuranceResults,
                                                            setShowInsuranceResults,
                                                            onSelectInsurance,
                                                            filteredInsurances
                                                        }) => {
    /**
     * Xử lý thay đổi thông tin bệnh nhân
     */
    const handleInputChange = (field: string, fieldValue: string) => {
        onChange({
            [field]: fieldValue,
            isNewPatient: field === 'fullName' && !value.patientId ? true : value.isNewPatient
        });
    };

    return (
        <div className="form-grid">
            {/* Mã y tế */}
            <TextInput
                label="Mã Y Tế"
                value={value.medicalCode}
                onChange={(e: any) => handleInputChange('medicalCode', e.target.value)}
                placeholder="Mã y tế"
            />

            {/* Họ và tên */}
            <TextInput
                label="Họ và tên"
                required
                value={value.fullName}
                onChange={(e: any) => handleInputChange('fullName', e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                hint={errors?.fullName}
            />

            {/* Ngày sinh */}
            <TextInput
                type="date"
                label="Ngày sinh"
                required
                value={value.dob}
                onChange={(e: any) => handleInputChange('dob', e.target.value)}
                hint={errors?.dob}
            />

            {/* Giới tính */}
            <Select
                label="Giới tính"
                required
                value={value.gender}
                onChange={(e: any) => handleInputChange('gender', e.target.value)}
                options={[
                    { value: '', label: 'Chọn giới tính' },
                    { value: 'male', label: 'Nam' },
                    { value: 'female', label: 'Nữ' },
                    { value: 'other', label: 'Khác' }
                ]}
                hint={errors?.gender}
            />

            {/* Quốc tịch */}
            <Select
                label="Quốc tịch"
                value={value.country}
                onChange={(e: any) => handleInputChange('country', e.target.value)}
                options={[
                    { value: '', label: 'Chọn quốc tịch' },
                    ...countries.map((country: any) => ({
                        value: country.maDonVi,
                        label: country.tenDonVi
                    }))
                ]}
            />

            {/* Dân tộc */}
            <Select
                label="Dân tộc"
                value={value.ethnicity}
                onChange={(e: any) => handleInputChange('ethnicity', e.target.value)}
                options={[
                    { value: '', label: 'Chọn dân tộc' },
                    ...ethnicities.map((ethnicity: any) => ({
                        value: ethnicity.maDanToc,
                        label: ethnicity.tenDanToc
                    }))
                ]}
            />

            {/* Số CCCD/Hộ chiếu */}
            <TextInput
                label="Số CCCD/Hộ chiếu"
                value={value.nationalId}
                onChange={(e: any) => handleInputChange('nationalId', e.target.value)}
                placeholder="12 số"
            />

            {/* Số điện thoại */}
            <TextInput
                label="Số điện thoại"
                required
                value={value.phone}
                onChange={(e: any) => handleInputChange('phone', e.target.value)}
                placeholder="0912345678"
                hint={errors?.phone}
            />

            {/* Bảo hiểm tư nhân với tính năng tìm kiếm */}
            <div className="insurance-search">
                <TextInput
                    label="Bảo hiểm tư nhân"
                    value={value.insurance}
                    onChange={(e: any) => {
                        handleInputChange('insurance', e.target.value);
                        setInsuranceSearch(e.target.value);
                        setShowInsuranceResults(true);
                    }}
                    onFocus={() => setShowInsuranceResults(true)}
                    placeholder="Chọn hoặc nhập bảo hiểm"
                />

                {/* Dropdown kết quả tìm kiếm bảo hiểm */}
                {showInsuranceResults && insuranceSearch && (
                    <div className="insurance-results">
                        {filteredInsurances.map((insurance, index) => (
                            <div
                                key={index}
                                className="insurance-item"
                                onClick={() => onSelectInsurance(insurance)}
                            >
                                {insurance}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};