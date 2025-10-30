import React from 'react'
import { TextInput, TextArea, Select } from './Field'
import { DEPARTMENTS } from '@shared/constants/serviceCategories'

export function AppointmentForm({ value, onChange, errors }: any) {
  return (
    <div className="card">
      <h2>2) Thông tin khám</h2>
      <p style={{color:'#6b7280', fontSize:12}}>Chọn khoa và thời gian dự kiến</p>
      <div className="row cols-3" style={{marginTop:12}}>
        <Select label="Khoa khám" required value={value.department} onChange={(e:any)=>onChange({department:e.target.value})}
          options={DEPARTMENTS.map(d=>({value:d,label:d}))}
          hint={errors?.department}
        />
        <TextInput type="date" label="Ngày khám mong muốn" required
          value={value.preferredDate} onChange={(e:any)=>onChange({preferredDate:e.target.value})}
          hint={errors?.preferredDate}
        />
        <TextInput type="time" label="Giờ khám mong muốn" required
          value={value.preferredTime} onChange={(e:any)=>onChange({preferredTime:e.target.value})}
          hint={errors?.preferredTime}
        />
      </div>
      <div style={{marginTop:12}}>
        <TextArea label="Triệu chứng / Lý do khám" rows={3}
          value={value.symptoms} onChange={(e:any)=>onChange({symptoms:e.target.value})}
        />
      </div>
    </div>
  )
}
export default AppointmentForm
