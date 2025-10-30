import React from 'react'
import { TextInput, TextArea, Select } from './Field'

export function PatientForm({ value, onChange, errors }: any) {
  return (
    <div className="card">
      <h2>1) Thông tin người bệnh</h2>
      <p style={{color:'#6b7280', fontSize:12}}>Các trường có * là bắt buộc</p>
      <div className="row cols-2" style={{marginTop:12}}>
        <TextInput label="Họ và tên" required
          value={value.fullName} onChange={(e:any)=>onChange({fullName:e.target.value})}
          placeholder="VD: Nguyễn Văn A"
          hint={errors?.fullName}
        />
        <TextInput type="date" label="Ngày sinh" required
          value={value.dob} onChange={(e:any)=>onChange({dob:e.target.value})}
          hint={errors?.dob}
        />
        <Select label="Giới tính" required value={value.gender} onChange={(e:any)=>onChange({gender:e.target.value})}
          options={[{value:'male',label:'Nam'},{value:'female',label:'Nữ'},{value:'other',label:'Khác'}]}
          hint={errors?.gender}
        />
        <TextInput label="Số CCCD/Hộ chiếu"
          value={value.nationalId} onChange={(e:any)=>onChange({nationalId:e.target.value})}
        />
        <TextInput label="Số điện thoại" required
          value={value.phone} onChange={(e:any)=>onChange({phone:e.target.value})}
          placeholder="+xxxxxxxxxx" hint={errors?.phone}
        />
        <TextInput label="Bảo hiểm tư nhân "
          value={value.insurance} onChange={(e:any)=>onChange({insurance:e.target.value})}
        />

      </div>
      <div style={{marginTop:12}}>
        <TextArea label="Địa chỉ" rows={2}
          value={value.address} onChange={(e:any)=>onChange({address:e.target.value})}
        />
      </div>
    </div>
  )
}
export default PatientForm
