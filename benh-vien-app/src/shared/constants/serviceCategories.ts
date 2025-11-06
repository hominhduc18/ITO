export const SERVICE_CATALOG = [
  { id: '1', name: 'Công thức máu (CBC)', category: 'Xét nghiệm' },
  { id: '2', name: 'Đường huyết (Glucose)', category: 'Xét nghiệm' },
  { id: '3', name: 'CRP định lượng', category: 'Xét nghiệm' },
  { id: 'P4',  name: 'Đông máu (PT/INR)', category: 'Xét nghiệm' },
  { id: '5', name: 'X-quang Ngực thẳng', category: 'Chẩn đoán hình ảnh' },
  { id: '6', name: 'Siêu âm bụng tổng quát', category: 'Chẩn đoán hình ảnh' },
  { id: '7', name: 'MRI gối', category: 'Chẩn đoán hình ảnh' },
  { id: '8', name: 'CT Scan sọ não', category: 'Chẩn đoán hình ảnh' },

] as const

export const CATEGORIES = ['Xét nghiệm', 'Chẩn đoán hình ảnh'] as const

export const DEPARTMENTS = [
  'Khoa Khám bệnh',
  'Chấn thương Chỉnh hình',
  'Điều trị',
  'Gây mê Hồi sức',

] as const

export const PRIORITY = [
  { value: 'routine', label: 'Thường' },
  { value: 'urgent', label: 'Khẩn' },
  { value: 'stat', label: 'Cấp cứu' },
] as const
