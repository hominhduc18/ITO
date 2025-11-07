import React from 'react'
import { TextInput, Select } from './Field'

// Interface cho dịch vụ từ API
interface APIService {
    dichVu_Id: number;
    nhomDichVu_Id: number;
    maDichVu: string;
    tenDichVu: string;
    tenKhongDau: string;
    tenNhom?: string;
    donViTinh: string;
    donGiaMin: number | null;
    donGiaMax: number | null;
    bhyt: boolean;
    tamNgung: boolean;
    congTy_Id: number;
    tyleVAT: number;
    soLanThucHien: number;
}

interface ServiceCatalogItem {
    id: string;
    name: string;
    nameEn: string;
    category: string;
    unit: string;
    minPrice: number | null;
    maxPrice: number | null;
    insuranceCovered: boolean;
    isActive: boolean;
}

interface ChosenService {
    id: string;
    name: string;
    category: string;
    unit: string;
    priority: 'emergency' | 'urgent' | 'routine';
    note: string;
    minPrice: number | null;
    maxPrice: number | null;
    insuranceCovered: boolean;
}

interface AncillaryOrderPickerProps {
    chosen: ChosenService[];
    onAdd: (service: ChosenService) => void;
    onRemove: (id: string) => void;
    onUpdate: (id: string, updates: Partial<ChosenService>) => void;
    errors?: any;
}

// Hàm chuẩn hóa chuỗi tìm kiếm
const normalizeString = (str: string): string => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd');
}

// Hàm tìm kiếm
const searchServices = (services: ServiceCatalogItem[], searchTerm: string): ServiceCatalogItem[] => {
    if (!searchTerm) return services;

    const normalizedSearch = normalizeString(searchTerm);

    return services.filter(service => {
        const nameMatch = normalizeString(service.name).includes(normalizedSearch);
        const nameEnMatch = service.nameEn && normalizeString(service.nameEn).includes(normalizedSearch);
        const codeMatch = normalizeString(service.id).includes(normalizedSearch);
        const categoryMatch = service.category && normalizeString(service.category).includes(normalizedSearch);

        return nameMatch || nameEnMatch || codeMatch || categoryMatch;
    });
}

// Priority options
const PRIORITY = [
    { value: 'emergency', label: '🆘 Cấp cứu' },
    { value: 'urgent', label: '⚠️ Khẩn' },
    { value: 'routine', label: '✅ Thường' }
]

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

            const result = await response.json()

            if (!result.success || !Array.isArray(result.data)) {
                throw new Error('Dữ liệu dịch vụ không hợp lệ')
            }

            const data: APIService[] = result.data

            const convertedServices: ServiceCatalogItem[] = data
                .filter(apiService => !apiService.tamNgung)
                .map(apiService => ({
                    id: apiService.maDichVu,
                    name: apiService.tenDichVu,
                    nameEn: apiService.tenKhongDau || apiService.tenDichVu,
                    category: apiService.tenNhom || `Nhóm ${apiService.nhomDichVu_Id}`,
                    unit: apiService.donViTinh,
                    minPrice: apiService.donGiaMin,
                    maxPrice: apiService.donGiaMax,
                    insuranceCovered: apiService.bhyt,
                    isActive: !apiService.tamNgung
                }))

            setServiceCatalog(convertedServices)

        } catch (err) {
            console.error('Error fetching service catalog:', err)
            setError('Không thể tải danh mục dịch vụ')
            setServiceCatalog([])
        } finally {
            setLoading(false)
        }
    }

    const handleAddService = (service: ServiceCatalogItem) => {
        const chosenService: ChosenService = {
            id: service.id,
            name: service.name,
            category: service.category,
            unit: service.unit,
            priority: 'routine',
            note: '',
            minPrice: service.minPrice,
            maxPrice: service.maxPrice,
            insuranceCovered: service.insuranceCovered
        }
        onAdd(chosenService)
    }

    // Hàm format giá an toàn
    const formatPrice = (min: number | null, max: number | null) => {
        if (min == null && max == null) {
            return 'Chưa có giá'
        }

        if (min != null && max != null && min === max) {
            return `${min.toLocaleString()}đ`
        }

        if (min != null && max != null) {
            return `${min.toLocaleString()}đ - ${max.toLocaleString()}đ`
        }

        if (min != null) {
            return `Từ ${min.toLocaleString()}đ`
        }

        if (max != null) {
            return `Đến ${max.toLocaleString()}đ`
        }

        return 'Chưa có giá'
    }

    const filtered = React.useMemo(() => {
        let result = serviceCatalog
        if (search) result = searchServices(result, search)
        if (category) result = result.filter(s => s.category === category)
        return result
    }, [search, category, serviceCatalog])

    const availableCategories = React.useMemo(() => {
        const categories = [...new Set(serviceCatalog.map(s => s.category))].filter(Boolean)
        return categories.map(cat => ({ value: cat, label: cat }))
    }, [serviceCatalog])

    if (loading) {
        return (
            <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <h2 style={{ color: 'white', marginBottom: 16 }}>🩺 Chỉ định dịch vụ khám</h2>
                <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.9)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12
                }}>
                    <div className="loading-spinner" style={{
                        width: 32,
                        height: 32,
                        border: '3px solid rgba(255,255,255,0.3)',
                        borderTop: '3px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <div>Đang tải danh mục dịch vụ...</div>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div className="card" style={{
            background: 'white',
            border: '1px solid #e1e5e9',
            borderRadius: 16,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
            <h2 style={{
                color: '#1e293b',
                marginBottom: 20,
                fontSize: 20,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8
            }}>
                <span style={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    width: 4,
                    height: 24,
                    borderRadius: 2,
                    display: 'inline-block'
                }}></span>
                🩺 Chỉ định dịch vụ khám
            </h2>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                padding: 16,
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: 12,
                border: '1px solid #f1f5f9'
            }}>
                <div>
                    <p style={{ color: '#475569', fontSize: 14, fontWeight: 500, margin: 0 }}>
                        Tìm và thêm dịch vụ từ danh mục
                    </p>
                    <p style={{ color: '#3b82f6', fontSize: 12, margin: '4px 0 0 0' }}>
                        ✅ Hỗ trợ tìm có dấu & không dấu • 🎯 Click để thêm nhanh
                    </p>
                </div>
                {serviceCatalog.length > 0 && (
                    <span style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#059669',
                        background: '#dcfce7',
                        padding: '6px 12px',
                        borderRadius: 20,
                        border: '1px solid #bbf7d0'
                    }}>
                        📦 {serviceCatalog.length} dịch vụ
                    </span>
                )}
            </div>

            {error && (
                <div style={{
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                    border: '1px solid #fca5a5',
                    color: '#dc2626',
                    padding: '12px 16px',
                    borderRadius: 12,
                    fontSize: 14,
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16 }}>⚠️</span>
                        <span>{error}</span>
                    </div>
                    <button
                        onClick={fetchServiceCatalog}
                        style={{
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
                    >
                        Thử lại
                    </button>
                </div>
            )}

            <div style={{ marginTop: 8 }}>
                <div className="row" style={{ gap: 16, marginBottom: 16 }}>
                    <div style={{ flex: 2 }}>
                        <TextInput
                            label="🔍 Tìm kiếm dịch vụ"
                            value={search}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                            placeholder="Nhập tên dịch vụ, mã dịch vụ... (có dấu hoặc không dấu)"
                            style={{
                                borderRadius: 10,
                                border: '2px solid #e2e8f0',
                                padding: '12px 16px',
                                fontSize: 14,
                                transition: 'all 0.2s'
                            }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Select
                            label="📂 Phân nhóm"
                            value={category}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
                            options={[
                                { value: '', label: '📁 Tất cả nhóm' },
                                ...availableCategories
                            ]}
                            style={{
                                borderRadius: 10,
                                border: '2px solid #e2e8f0',
                                padding: '12px 16px',
                                fontSize: 14
                            }}
                        />
                    </div>
                </div>

                {/* Danh sách dịch vụ */}
                <div style={{
                    maxHeight: 280,
                    overflow: 'auto',
                    border: '2px solid #f1f5f9',
                    borderRadius: 12,
                    background: 'white',
                    marginBottom: 16
                }}>
                    {filtered.length === 0 ? (
                        <div style={{
                            padding: 40,
                            textAlign: 'center',
                            color: '#64748b',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: 10
                        }}>
                            <div style={{ fontSize: 48, marginBottom: 8 }}>🔍</div>
                            <div style={{ fontSize: 14, fontWeight: 500 }}>
                                {serviceCatalog.length === 0 ?
                                    'Không có dữ liệu dịch vụ' :
                                    'Không tìm thấy dịch vụ phù hợp'
                                }
                            </div>
                            <div style={{ fontSize: 12, marginTop: 4, opacity: 0.7 }}>
                                Thử tìm kiếm với từ khóa khác
                            </div>
                        </div>
                    ) : (
                        filtered.map(s => (
                            <div
                                key={s.id}
                                onClick={() => !chosen.some(ch => ch.id === s.id) && handleAddService(s)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 16,
                                    borderBottom: '1px solid #f8fafc',
                                    background: chosen.some(ch => ch.id === s.id) ?
                                        'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' :
                                        'transparent',
                                    cursor: chosen.some(ch => ch.id === s.id) ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    position: 'relative',
                                    borderRadius: 8,
                                    margin: 4
                                }}
                                onMouseOver={(e) => {
                                    if (!chosen.some(ch => ch.id === s.id)) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!chosen.some(ch => ch.id === s.id)) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: chosen.some(ch => ch.id === s.id) ? '#0ea5e9' : '#1e293b',
                                        marginBottom: 4
                                    }}>
                                        {s.name}
                                        {chosen.some(ch => ch.id === s.id) && (
                                            <span style={{
                                                marginLeft: 8,
                                                background: '#10b981',
                                                color: 'white',
                                                padding: '2px 8px',
                                                borderRadius: 12,
                                                fontSize: 11,
                                                fontWeight: 500
                                            }}>
                                                Đã thêm
                                            </span>
                                        )}
                                    </div>
                                    <div style={{
                                        fontSize: 12,
                                        color: '#64748b',
                                        lineHeight: 1.4
                                    }}>
                                        <span style={{
                                            background: '#f1f5f9',
                                            padding: '2px 6px',
                                            borderRadius: 4,
                                            fontWeight: 500,
                                            color: '#475569'
                                        }}>
                                            #{s.id}
                                        </span>
                                        <span style={{ margin: '0 8px' }}>•</span>
                                        <span>{s.category}</span>
                                        <span style={{ margin: '0 8px' }}>•</span>
                                        <span>{s.unit}</span>
                                        <span style={{ margin: '0 8px' }}>•</span>
                                        <span style={{
                                            color: s.minPrice ? '#059669' : '#94a3b8',
                                            fontWeight: 600
                                        }}>
                                            💰 {formatPrice(s.minPrice, s.maxPrice)}
                                        </span>
                                        {s.insuranceCovered && (
                                            <span style={{
                                                color: '#059669',
                                                marginLeft: 8,
                                                fontWeight: 600
                                            }}>
                                                🏥 BHYT
                                            </span>
                                        )}
                                    </div>
                                    {s.nameEn && s.nameEn !== s.name && (
                                        <div style={{
                                            fontSize: 11,
                                            color: '#94a3b8',
                                            fontStyle: 'italic',
                                            marginTop: 4,
                                            paddingLeft: 8,
                                            borderLeft: '2px solid #e2e8f0'
                                        }}>
                                            {s.nameEn}
                                        </div>
                                    )}
                                </div>
                                {!chosen.some(ch => ch.id === s.id) && (
                                    <div style={{
                                        padding: '8px 12px',
                                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                        color: 'white',
                                        borderRadius: 8,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        transition: 'all 0.2s',
                                        opacity: 0.9
                                    }}>
                                        Thêm
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Kết quả tìm kiếm */}
                {search && (
                    <div style={{
                        fontSize: 13,
                        color: '#475569',
                        marginBottom: 16,
                        padding: '12px 16px',
                        background: '#f8fafc',
                        borderRadius: 8,
                        border: '1px solid #f1f5f9'
                    }}>
                        🎯 Tìm thấy <strong>{filtered.length}</strong> dịch vụ phù hợp với "<strong>{search}</strong>"
                    </div>
                )}

                {/* Dịch vụ đã chọn */}
                <div style={{
                    marginTop: 24,
                    padding: 20,
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{
                        fontSize: 16,
                        fontWeight: 700,
                        marginBottom: 16,
                        color: '#1e293b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <span style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white',
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12
                        }}>
                            {chosen.length}
                        </span>
                        📋 Dịch vụ đã chọn ({chosen.length})
                    </h3>

                    {chosen.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: 40,
                            color: '#64748b'
                        }}>
                            <div style={{ fontSize: 48, marginBottom: 8 }}>📝</div>
                            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                                Chưa có dịch vụ nào được thêm
                            </div>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>
                                Click vào dịch vụ trong danh sách để thêm
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: 12 }}>
                            {chosen.map((o) => (
                                <div key={o.id} style={{
                                    background: 'white',
                                    padding: 16,
                                    borderRadius: 12,
                                    border: '2px solid #f1f5f9',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: '#1e293b',
                                                marginBottom: 6
                                            }}>
                                                {o.name}
                                            </div>
                                            <div style={{
                                                fontSize: 12,
                                                color: '#64748b',
                                                lineHeight: 1.4
                                            }}>
                                                <span style={{
                                                    background: '#f1f5f9',
                                                    padding: '2px 6px',
                                                    borderRadius: 4,
                                                    fontWeight: 500
                                                }}>
                                                    #{o.id}
                                                </span>
                                                <span style={{ margin: '0 6px' }}>•</span>
                                                <span>{o.category}</span>
                                                <span style={{ margin: '0 6px' }}>•</span>
                                                <span>{o.unit}</span>
                                                <span style={{ margin: '0 6px' }}>•</span>
                                                <span style={{
                                                    color: o.minPrice ? '#059669' : '#94a3b8',
                                                    fontWeight: 600
                                                }}>
                                                    💰 {formatPrice(o.minPrice, o.maxPrice)}
                                                </span>
                                                {o.insuranceCovered && (
                                                    <span style={{
                                                        color: '#059669',
                                                        marginLeft: 6,
                                                        fontWeight: 600
                                                    }}>
                                                        🏥 BHYT
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onRemove(o.id)}
                                            style={{
                                                background: '#fef2f2',
                                                border: '1px solid #fecaca',
                                                color: '#dc2626',
                                                fontSize: 12,
                                                fontWeight: 600,
                                                padding: '8px 12px',
                                                borderRadius: 8,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 4
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = '#dc2626';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = '#fef2f2';
                                                e.currentTarget.style.color = '#dc2626';
                                            }}
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </div>
                                    <div className="row cols-2" style={{ gap: 12 }}>
                                        <Select
                                            label="🎯 Ưu tiên"
                                            value={o.priority}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                onUpdate(o.id, { priority: e.target.value as ChosenService['priority'] })
                                            }
                                            options={PRIORITY}
                                            style={{
                                                borderRadius: 8,
                                                border: '1px solid #e2e8f0',
                                                padding: '8px 12px',
                                                fontSize: 13
                                            }}
                                        />
                                        <TextInput
                                            label="📝 Ghi chú"
                                            value={o.note}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                onUpdate(o.id, { note: e.target.value })
                                            }
                                            placeholder="VD: làm trước khi chụp MRI, nhịn ăn sáng..."
                                            style={{
                                                borderRadius: 8,
                                                border: '1px solid #e2e8f0',
                                                padding: '8px 12px',
                                                fontSize: 13
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {errors?.orders && (
                    <div style={{
                        color: '#dc2626',
                        fontSize: 13,
                        fontWeight: 500,
                        marginTop: 8,
                        padding: '8px 12px',
                        background: '#fef2f2',
                        borderRadius: 6,
                        border: '1px solid #fecaca'
                    }}>
                        ⚠️ {errors.orders}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AncillaryOrderPicker