import React from 'react'

export function TextInput({ label, required, hint, ...props }: any) {
  return (
    <label>
      <span className="label">{label}{required && <span style={{color:'#dc2626'}}> *</span>}</span>
      <input className="input" {...props} />
      {hint && <div className="error" style={{opacity:.8}}>{hint}</div>}
    </label>
  )
}

export function Select({ label, required, options, ...props }: any) {
  return (
    <label>
      <span className="label">{label}{required && <span style={{color:'#dc2626'}}> *</span>}</span>
      <select className="select" {...props}>
        <option value="">-- Chọn --</option>
        {(options||[]).map((o: any) => (
          <option key={(o.value ?? o)} value={(o.value ?? o)}>{o.label ?? o}</option>
        ))}
      </select>
    </label>
  )
}

export function TextArea({ label, required, rows = 4, ...props }: any) {
  return (
    <label>
      <span className="label">{label}{required && <span style={{color:'#dc2626'}}> *</span>}</span>
      <textarea rows={rows} className="textarea" {...props} />
    </label>
  )
}
