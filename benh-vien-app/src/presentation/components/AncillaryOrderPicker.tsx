import React from 'react'
import { TextInput, Select } from './Field'
import { SERVICE_CATALOG, CATEGORIES, PRIORITY } from '@shared/constants/serviceCategories'

export function AncillaryOrderPicker({ chosen, onAdd, onRemove, onUpdate, errors }: any) {
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState('')

  const filtered = React.useMemo(()=>{
    return SERVICE_CATALOG.filter(s =>
      (!category || s.category===category) &&
      (!search || (s.name + s.id).toLowerCase().includes(search.toLowerCase()))
    )
  }, [search, category])

  return (
    <div className="card">
      <h2>3) Chỉ định cận lâm sàng</h2>
      <p style={{color:'#6b7280', fontSize:12}}>Tìm và thêm dịch vụ</p>
      <div className="row" style={{marginTop:12}}>
        <TextInput label="Tìm kiếm dịch vụ" value={search} onChange={(e:any)=>setSearch(e.target.value)} placeholder="gõ tên hoặc mã (VD: CBC, X-quang...)" />
        <Select label="Phân nhóm" value={category} onChange={(e:any)=>setCategory(e.target.value)} options={[{value:'',label:'Tất cả'}, ...CATEGORIES.map(c=>({value:c,label:c}))]} />
        <div style={{maxHeight:220, overflow:'auto', border:'1px solid #e5e7eb', borderRadius:12}}>
          {filtered.length===0 && <div style={{padding:12, fontSize:12, color:'#6b7280'}}>Không tìm thấy dịch vụ phù hợp</div>}
          {filtered.map(s => (
            <div key={s.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:12, borderTop:'1px solid #f3f4f6'}}>
              <div>
                <div style={{fontSize:14, fontWeight:600}}>{s.name}</div>
                <div style={{fontSize:12, color:'#6b7280'}}>{s.id} • {s.category}</div>
              </div>
              <button type="button" className="btn primary" onClick={()=>onAdd(s)}>Thêm</button>
            </div>
          ))}
        </div>

        <div style={{marginTop:12}}>
          <h3 style={{fontSize:14, fontWeight:600, marginBottom:8}}>Đã chọn</h3>
          {chosen.length===0 ? (
            <p style={{fontSize:12, color:'#6b7280'}}>Chưa có dịch vụ nào được thêm.</p>
          ) : (
            <ul style={{display:'grid', gap:8}}>
              {chosen.map((o:any)=>(
                <li key={o.id} className="card">
                  <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12}}>
                    <div>
                      <div style={{fontSize:14, fontWeight:600}}>{o.name}</div>
                      <div style={{fontSize:12, color:'#6b7280'}}>{o.id}</div>
                    </div>
                    <button type="button" className="btn" onClick={()=>onRemove(o.id)} style={{borderColor:'#fecaca', color:'#dc2626'}}>Xóa</button>
                  </div>
                  <div className="row cols-2" style={{marginTop:8}}>
                    <Select label="Ưu tiên" value={o.priority} onChange={(e:any)=>onUpdate(o.id,{priority:e.target.value})} options={PRIORITY} />
                    <TextInput label="Ghi chú" value={o.note||''} onChange={(e:any)=>onUpdate(o.id,{note:e.target.value})} placeholder="VD: làm trước khi chụp MRI" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors?.orders && <div className="error">{errors.orders}</div>}
      </div>
    </div>
  )
}
export default AncillaryOrderPicker
