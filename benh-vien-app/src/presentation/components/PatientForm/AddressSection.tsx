import React from 'react';
import { TextInput, TextArea, Select } from '../Field';
import { AddressSectionProps } from '@presentation/models/administrative';

/**
 * Component hiển thị phần thông tin địa chỉ
 * Bao gồm tỉnh/thành phố, quận/huyện, xã/phường, số nhà và địa chỉ đầy đủ
 */
export const AddressSection: React.FC<AddressSectionProps> = ({
                                                                  value,
                                                                  onChange,
                                                                  countries,
                                                                  provinces,
                                                                  districts,
                                                                  wards,
                                                                  ethnicities
                                                              }) => {
    /**
     * Xử lý thay đổi thông tin địa chỉ
     * Reset các field phụ thuộc khi field cha thay đổi
     */
    const handleInputChange = (field: string, fieldValue: string) => {
        const updates: any = { [field]: fieldValue };

        // Reset dependent fields khi field cha thay đổi
        if (field === 'province') {
            updates.district = '';
            updates.ward = '';
            updates.street = '';
        } else if (field === 'district') {
            updates.ward = '';
            updates.street = '';
        }

        onChange(updates);
    };

    /**
     * Tự động xây dựng địa chỉ đầy đủ từ các thành phần
     */
    const buildFullAddress = () => {
        const addressParts = [];

        if (value.street) addressParts.push(value.street);

        const selectedWard = wards.find(w => w.maDonVi === value.ward);
        if (selectedWard) addressParts.push(selectedWard.tenDonVi);

        const selectedDistrict = districts.find(d => d.maDonVi === value.district);
        if (selectedDistrict) addressParts.push(selectedDistrict.tenDonVi);

        const selectedProvince = provinces.find(p => p.maDonVi === value.province);
        if (selectedProvince) addressParts.push(selectedProvince.tenDonVi);

        return addressParts.join(', ');
    };

    /**
     * Tự động cập nhật địa chỉ đầy đủ khi các trường địa chỉ thay đổi
     */
    React.useEffect(() => {
        if (value.street || value.ward || value.district || value.province) {
            const fullAddress = buildFullAddress();
            if (fullAddress !== value.address) {
                onChange({ address: fullAddress });
            }
        }
    }, [value.street, value.ward, value.district, value.province]);

    return (
        <div className="address-section">
            <h3>📍 Thông tin địa chỉ</h3>

            <div className="address-grid">
                {/* Tỉnh/Thành Phố */}
                <Select
                    label="Tỉnh/Thành Phố"
                    value={value.province}
                    onChange={(e: any) => handleInputChange('province', e.target.value)}
                    options={[
                        { value: '', label: 'Chọn tỉnh/thành phố' },
                        ...provinces.map((province: any) => ({
                            value: province.maDonVi,
                            label: province.tenDonVi
                        }))
                    ]}
                />

                {/* Quận/Huyện - Chỉ enable khi đã chọn tỉnh/thành phố */}
                <Select
                    label="Quận/Huyện"
                    value={value.district}
                    onChange={(e: any) => handleInputChange('district', e.target.value)}
                    options={[
                        { value: '', label: 'Chọn quận/huyện' },
                        ...districts.map((district: any) => ({
                            value: district.maDonVi,
                            label: district.tenDonVi
                        }))
                    ]}
                    disabled={!value.province}
                />

                {/* Xã/Phường - Chỉ enable khi đã chọn quận/huyện */}
                <Select
                    label="Xã/Phường"
                    value={value.ward}
                    onChange={(e: any) => handleInputChange('ward', e.target.value)}
                    options={[
                        { value: '', label: 'Chọn xã/phường' },
                        ...wards.map((ward: any) => ({
                            value: ward.maDonVi,
                            label: ward.tenDonVi
                        }))
                    ]}
                    disabled={!value.district}
                />

                {/* Số nhà/Tên đường */}
                <TextInput
                    label="Số nhà/Tên đường"
                    value={value.street}
                    onChange={(e: any) => handleInputChange('street', e.target.value)}
                    placeholder="Số nhà, tên đường"
                />
            </div>

            {/* Địa chỉ đầy đủ (tự động điền, read-only) */}
            <TextArea
                label="Địa chỉ đầy đủ"
                rows={2}
                value={value.address}
                onChange={(e: any) => handleInputChange('address', e.target.value)}
                placeholder="Địa chỉ đầy đủ sẽ tự động điền từ các thông tin trên"
                readOnly
            />
        </div>
    );
};