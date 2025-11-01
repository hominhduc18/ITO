import React from 'react'
import { TextInput, TextArea, Select } from './Field'


const DEPARTMENTS = [
    'Khoa Khám Bệnh ',
    'Khoa Gây Mê Hồi Sức',
    'Khoa Điều Trị',
    'Khoa Chấn Thương Chỉnh Hình'

]

const ROOMS_BY_DEPARTMENT = {
    'Khoa Khám Bệnh': ['Phòng 101', 'Phòng 102', 'Phòng 103'],
    'Khoa Gây Mê Hồi Sức': ['Phòng 301', 'Phòng 302', 'Phòng 303'],
    'Khoa Điêu Trị': ['Phòng 501', 'Phòng 502', 'Phòng 503'],
    'Khoa Chấn Thương Chỉnh Hình': ['Phòng 801', 'Phòng 802', 'Phòng 803'],
}

const DOCTORS_BY_DEPARTMENT = {
    'Khoa Khám Bệnh': [
        { id: 'BS001', name: 'BS. Nguyễn Văn A', specialization: 'Khám Bệnh' },
        { id: 'BS002', name: 'BS. Trần Thị B', specialization: 'Khám Bệnh' }
    ],
    'Khoa Gây Mê Hồi Sức': [
        { id: 'BS003', name: 'BS. Lê Văn C', specialization: 'Khoa Gây Mê Hồi Sức' },
        { id: 'BS004', name: 'BS. Phạm Thị D', specialization: 'Khoa Gây Mê Hồi Sức' }
    ],
    'Khoa Điều Trị': [
        { id: 'BS005', name: 'BS. Hoàng Văn E', specialization: 'Khoa Điều Trị' },
        { id: 'BS006', name: 'BS. Vũ Thị F', specialization: 'Khoa Điều Trị' }
    ],
    'Khoa Chấn Thương Chỉnh Hình': [
        { id: 'BS007', name: 'BS. Đặng Văn G', specialization: 'Khoa Chấn Thương Chỉnh Hình' },
        { id: 'BS008', name: 'BS. Bùi Thị H', specialization: 'Khoa Chấn Thương Chỉnh Hình' }
    ]

}

export function AppointmentForm({ value, onChange, errors }: any) {


    const getRoomsByDepartment = () => {
        if (!value.department) return []
        return ROOMS_BY_DEPARTMENT[value.department] || []
    }


    const getDoctorsByDepartment = () => {
        if (!value.department) return []
        return DOCTORS_BY_DEPARTMENT[value.department] || []
    }

    const handleDepartmentChange = (department: string) => {

        onChange({
            department,
            room: '',
            doctorId: ''
        })
    }

    const handleRoomChange = (room: string) => {
        onChange({ room })
    }

    const handleDoctorChange = (doctorId: string) => {
        onChange({ doctorId })
    }

    return (
        <div className="card">
            <h2>2) Thông tin khám</h2>
            <p style={{color:'#6b7280', fontSize:12}}>Chọn khoa, phòng và bác sĩ</p>

            <div className="row cols-3" style={{marginTop:12}}>
                <Select
                    label="Khoa khám"
                    required
                    value={value.department}
                    onChange={(e: any) => handleDepartmentChange(e.target.value)}
                    options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
                    hint={errors?.department}
                />

                <Select
                    label="Phòng khám"
                    required
                    value={value.room}
                    onChange={(e: any) => handleRoomChange(e.target.value)}
                    options={[
                        { value: '', label: '-- Chọn phòng --' },
                        ...getRoomsByDepartment().map(room => ({ value: room, label: room }))
                    ]}
                    disabled={!value.department}
                    hint={errors?.room || (!value.department ? 'Vui lòng chọn khoa trước' : '')}
                />

                <Select
                    label="Bác sĩ"
                    required
                    value={value.doctorId}
                    onChange={(e: any) => handleDoctorChange(e.target.value)}
                    options={[
                        { value: '', label: '-- Chọn bác sĩ --' },
                        ...getDoctorsByDepartment().map(doctor => ({
                            value: doctor.id,
                            label: `${doctor.name} - ${doctor.specialization}`
                        }))
                    ]}
                    disabled={!value.department}
                    hint={errors?.doctorId || (!value.department ? 'Vui lòng chọn khoa trước' : '')}
                />
            </div>

            <div className="row cols-2" style={{marginTop:12}}>
                <TextInput
                    type="date"
                    label="Ngày khám mong muốn"
                    required
                    value={value.preferredDate}
                    onChange={(e: any) => onChange({ preferredDate: e.target.value })}
                    hint={errors?.preferredDate}
                />
                <TextInput
                    type="time"
                    label="Giờ khám mong muốn"
                    required
                    value={value.preferredTime}
                    onChange={(e: any) => onChange({ preferredTime: e.target.value })}
                    hint={errors?.preferredTime}
                />
            </div>

            <div style={{marginTop:12}}>
                <TextArea
                    label="Triệu chứng / Lý do khám"
                    rows={3}
                    value={value.symptoms}
                    onChange={(e: any) => onChange({ symptoms: e.target.value })}
                    placeholder="Mô tả chi tiết các triệu chứng và lý do khám bệnh..."
                />
            </div>

            {/* Hiển thị thông tin bác sĩ đã chọn */}
            {value.doctorId && (
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: '8px'
                }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#0369a1' }}>Thông tin bác sĩ đã chọn:</h4>
                    {getDoctorsByDepartment()
                        .filter(doctor => doctor.id === value.doctorId)
                        .map(doctor => (
                            <div key={doctor.id}>
                                <p style={{ margin: '4px 0', fontWeight: '500' }}>{doctor.name}</p>
                                <p style={{ margin: '4px 0', color: '#64748b', fontSize: '14px' }}>
                                    Chuyên khoa: {doctor.specialization}
                                </p>
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    )
}

export default AppointmentForm