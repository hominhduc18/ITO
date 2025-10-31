import React from 'react'
import { TextInput, Select } from './Field'
import { CATEGORIES, PRIORITY } from '@shared/constants/serviceCategories'

// Interface cho dịch vụ từ API
interface APIService {
    dichVu_Id: number;
    nhomDichVu_Id: number;
    maDichVu: string;
    tenDichVu: string;
    tenKhongDau: string;
    giaDichVu?: number;
    giaBHYT?: number;
    trangThai?: number;
    khoaId?: number;
    tenKhoa?: string;
    tenNhomDichVu?: string;
}

interface ServiceCatalogItem {
    id: string;
    name: string;
    nameEn: string;
    category: string;
    department?: string;
    servicePrice?: number;
    insurancePrice?: number;
}

interface AncillaryOrderPickerProps {
    chosen: any[];
    onAdd: (service: any) => void;
    onRemove: (id: string) => void;
    onUpdate: (id: string, updates: any) => void;
    errors?: any;
}

// Hàm chuẩn hóa chuỗi tìm kiếm (bỏ dấu và chuyển thành chữ thường)
const normalizeString = (str: string): string => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu
        .replace(/đ/g, 'd') // Chuyển đ -> d
        .replace(/Đ/g, 'd'); // Chuyển Đ -> d
}

// Hàm tìm kiếm hỗ trợ cả có dấu và không dấu
const searchServices = (services: ServiceCatalogItem[], searchTerm: string): ServiceCatalogItem[] => {
    if (!searchTerm) return services;

    const normalizedSearch = normalizeString(searchTerm);

    return services.filter(service => {
        // Tìm trong tên có dấu
        const nameMatch = normalizeString(service.name).includes(normalizedSearch);
        // Tìm trong tên không dấu
        const nameEnMatch = service.nameEn && normalizeString(service.nameEn).includes(normalizedSearch);
        // Tìm trong mã dịch vụ
        const codeMatch = normalizeString(service.id).includes(normalizedSearch);
        // Tìm trong category
        const categoryMatch = service.category && normalizeString(service.category).includes(normalizedSearch);

        return nameMatch || nameEnMatch || codeMatch || categoryMatch;
    });
}

export function AncillaryOrderPicker({ chosen, onAdd, onRemove, onUpdate, errors }: AncillaryOrderPickerProps) {
    const [search, setSearch] = React.useState('')
    const [category, setCategory] = React.useState('')
    const [serviceCatalog, setServiceCatalog] = React.useState<ServiceCatalogItem[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    // Fetch danh mục dịch vụ từ API
    React.useEffect(() => {
        fetchServiceCatalog()
    }, [])

    const fetchServiceCatalog = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/DichVu')

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: APIService[] = await response.json()

            // Chuyển đổi dữ liệu từ API sang format cần thiết
            const convertedServices: ServiceCatalogItem[] = data.map(apiService => ({
                id: apiService.maDichVu,
                name: apiService.tenDichVu,
                nameEn: apiService.tenKhongDau || apiService.tenDichVu,
                category: apiService.tenNhomDichVu || `Nhóm ${apiService.nhomDichVu_Id}`,
                department: apiService.tenKhoa,
                servicePrice: apiService.giaDichVu,
                insurancePrice: apiService.giaBHYT
            }))

            setServiceCatalog(convertedServices)

        } catch (err) {
            console.error('Error fetching service catalog:', err)
            setError('Không thể tải danh mục dịch vụ')
            // Fallback to empty array
            setServiceCatalog([])
        } finally {
            setLoading(false)
        }
    }

    const filtered = React.useMemo(() => {
        let result = serviceCatalog;

        // Áp dụng tìm kiếm
        if (search) {
            result = searchServices(result, search);
        }

        // Áp dụng filter category
        if (category) {
            result = result.filter(s => s.category === category);
        }

        return result;
    }, [search, category, serviceCatalog])

    // Tạo danh sách categories duy nhất từ API
    const availableCategories = React.useMemo(() => {
        const categories = [...new Set(serviceCatalog.map(s => s.category))].filter(Boolean)
        return categories.map(cat => ({ value: cat, label: cat }))
    }, [serviceCatalog])

    if (loading) {
        return (
            <div className="card">
                <h2>3) Chỉ định cận lâm sàng</h2>
                <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                    Đang tải danh mục dịch vụ...
                </div>
            </div>
        )
    }

    return (
        <div className="card">
            <h2>3) Chỉ định cận lâm sàng</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ color: '#6b7280', fontSize: 12 }}>
                    Tìm và thêm dịch vụ từ danh mục
                    <span style={{ color: '#3b82f6', marginLeft: 4 }}>✓ Hỗ trợ tìm có dấu & không dấu</span>
                </p>
                {serviceCatalog.length > 0 && (
                    <span style={{ fontSize: 12, color: '#059669', background: '#d1fae5', padding: '4px 8px', borderRadius: 6 }}>
                        {serviceCatalog.length} dịch vụ
                    </span>
                )}
            </div>

            {error && (
                <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    marginBottom: 12
                }}>
                    {error}
                    <button
                        onClick={fetchServiceCatalog}
                        style={{
                            marginLeft: 8,
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '2px 6px',
                            borderRadius: 4,
                            fontSize: 11,
                            cursor: 'pointer'
                        }}
                    >
                        Thử lại
                    </button>
                </div>
            )}

            <div className="row" style={{ marginTop: 12 }}>
                <TextInput
                    label="Tìm kiếm dịch vụ"
                    value={search}
                    onChange={(e: any) => setSearch(e.target.value)}
                    placeholder="gõ tên có dấu hoặc không dấu, mã dịch vụ..."
                />

                <Select
                    label="Phân nhóm"
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    options={[
                        { value: '', label: 'Tất cả nhóm' },
                        ...availableCategories
                    ]}
                />

                <div style={{ maxHeight: 220, overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                    {filtered.length === 0 ? (
                        <div style={{ padding: 12, fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
                            {serviceCatalog.length === 0 ?
                                'Không có dữ liệu dịch vụ' :
                                'Không tìm thấy dịch vụ phù hợp'
                            }
                        </div>
                    ) : (
                        filtered.map(s => (
                            <div
                                key={s.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 12,
                                    borderTop: '1px solid #f3f4f6',
                                    background: chosen.some(ch => ch.id === s.id) ? '#f0f9ff' : 'transparent'
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                                        Mã: {s.id} • {s.category}
                                        {s.servicePrice && ` • Giá: ${s.servicePrice.toLocaleString()}đ`}
                                    </div>
                                    {s.nameEn && s.nameEn !== s.name && (
                                        <div style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic', marginTop: 2 }}>
                                            {s.nameEn}
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="btn primary"
                                    onClick={() => onAdd({
                                        id: s.id,
                                        name: s.name,
                                        category: s.category,
                                        priority: 'routine',
                                        note: '',
                                        servicePrice: s.servicePrice,
                                        insurancePrice: s.insurancePrice
                                    })}
                                    disabled={chosen.some(ch => ch.id === s.id)}
                                    style={{
                                        opacity: chosen.some(ch => ch.id === s.id) ? 0.5 : 1,
                                        fontSize: 12,
                                        padding: '6px 12px'
                                    }}
                                >
                                    {chosen.some(ch => ch.id === s.id) ? 'Đã thêm' : 'Thêm'}
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Hiển thị kết quả tìm kiếm */}
                {search && (
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
                        Tìm thấy {filtered.length} dịch vụ phù hợp với "{search}"
                    </div>
                )}

                <div style={{ marginTop: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                        Dịch vụ đã chọn ({chosen.length})
                    </h3>
                    {chosen.length === 0 ? (
                        <p style={{ fontSize: 12, color: '#6b7280' }}>Chưa có dịch vụ nào được thêm.</p>
                    ) : (
                        <ul style={{ display: 'grid', gap: 8 }}>
                            {chosen.map((o: any) => (
                                <li key={o.id} className="card">
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600 }}>{o.name}</div>
                                            <div style={{ fontSize: 12, color: '#6b7280' }}>
                                                Mã: {o.id} • {o.category}
                                                {o.servicePrice && ` • Giá: ${o.servicePrice.toLocaleString()}đ`}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={() => onRemove(o.id)}
                                            style={{ borderColor: '#fecaca', color: '#dc2626', fontSize: 12, padding: '6px 12px' }}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                    <div className="row cols-2" style={{ marginTop: 8 }}>
                                        <Select
                                            label="Ưu tiên"
                                            value={o.priority}
                                            onChange={(e: any) => onUpdate(o.id, { priority: e.target.value })}
                                            options={PRIORITY}
                                        />
                                        <TextInput
                                            label="Ghi chú"
                                            value={o.note || ''}
                                            onChange={(e: any) => onUpdate(o.id, { note: e.target.value })}
                                            placeholder="VD: làm trước khi chụp MRI"
                                        />
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