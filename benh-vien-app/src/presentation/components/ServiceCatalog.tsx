// components/ServiceCatalog.jsx
import React, { useState } from 'react';

interface Service {
    id: number;
    code: string;
    name: string;
    group: string;
    department: string;
    servicePrice: number;
    insurancePrice: number;
    status: 'active' | 'inactive';
    updatedBy: string;
    updatedAt: string;
    description?: string;
}

interface ServiceFormData {
    code: string;
    name: string;
    group: string;
    department: string;
    servicePrice: number;
    insurancePrice: number;
    description: string;
    status: 'active' | 'inactive';
}

interface Filters {
    search: string;
    group: string;
    department: string;
    priceType: string;
}

interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

export function ServiceCatalogForm() {
    const [services, setServices] = useState<Service[]>([
        {
            id: 1,
            code: 'DV001',
            name: 'Khám tổng quát',
            group: 'Khám bệnh',
            department: 'Khám bệnh',
            servicePrice: 300000,
            insurancePrice: 150000,
            status: 'active',
            updatedBy: 'admin',
            updatedAt: '2024-01-15',
            description: 'Khám tổng quát sức khỏe định kỳ'
        },
        {
            id: 2,
            code: 'DV002',
            name: 'Xét nghiệm máu',
            group: 'Xét nghiệm',
            department: 'Xét nghiệm',
            servicePrice: 150000,
            insurancePrice: 75000,
            status: 'active',
            updatedBy: 'DUC',
            updatedAt: '2024-01-15',
            description: 'Xét nghiệm công thức máu cơ bản'
        },
        {
            id: 3,
            code: 'DV003',
            name: 'Chụp X-quang',
            group: 'Chẩn đoán hình ảnh',
            department: 'Chẩn đoán hình ảnh',
            servicePrice: 250000,
            insurancePrice: 125000,
            status: 'inactive',
            updatedBy: 'Hồ Minh Đức',
            updatedAt: '2024-01-14',
            description: 'Chụp X-quang ngực thẳng'
        },
        {
            id: 4,
            code: 'DV004',
            name: 'Siêu âm bụng tổng quát',
            group: 'Chẩn đoán hình ảnh',
            department: 'Chẩn đoán hình ảnh',
            servicePrice: 350000,
            insurancePrice: 200000,
            status: 'active',
            updatedBy: 'admin',
            updatedAt: '2024-01-12',
            description: 'Siêu âm tổng quát đánh giá gan, thận, tụy, lách'
        },
        {
            id: 5,
            code: 'DV005',
            name: 'Điện tim (ECG)',
            group: 'Tim mạch',
            department: 'Tim mạch',
            servicePrice: 180000,
            insurancePrice: 90000,
            status: 'active',
            updatedBy: 'BS. An',
            updatedAt: '2024-01-13',
            description: 'Ghi và phân tích hoạt động điện tim'
        },
        {
            id: 6,
            code: 'DV006',
            name: 'Chụp MRI não',
            group: 'Chẩn đoán hình ảnh',
            department: 'Chẩn đoán hình ảnh',
            servicePrice: 1800000,
            insurancePrice: 1200000,
            status: 'active',
            updatedBy: 'BS. Châu',
            updatedAt: '2024-01-10',
            description: 'Chụp cộng hưởng từ vùng não – không tiêm thuốc tương phản'
        },
        {
            id: 7,
            code: 'DV007',
            name: 'Phẫu thuật nội soi ruột thừa',
            group: 'Phẫu thuật',
            department: 'Ngoại tổng quát',
            servicePrice: 5000000,
            insurancePrice: 3500000,
            status: 'active',
            updatedBy: 'BS. Dũng',
            updatedAt: '2024-01-08',
            description: 'Phẫu thuật nội soi cắt ruột thừa dưới gây mê toàn thân'
        },
        {
            id: 8,
            code: 'DV008',
            name: 'Thay băng vết thương nhỏ',
            group: 'Thủ thuật',
            department: 'Khoa Điều dưỡng',
            servicePrice: 80000,
            insurancePrice: 40000,
            status: 'active',
            updatedBy: 'Điều dưỡng Hạnh',
            updatedAt: '2024-01-17',
            description: 'Thay băng, sát khuẩn vết thương dưới 2cm'
        },
        {
            id: 9,
            code: 'DV009',
            name: 'Nội soi dạ dày',
            group: 'Thủ thuật',
            department: 'Tiêu hoá',
            servicePrice: 600000,
            insurancePrice: 350000,
            status: 'active',
            updatedBy: 'BS. Hòa',
            updatedAt: '2024-01-09',
            description: 'Nội soi dạ dày chẩn đoán có gây tê họng'
        },
        {
            id: 10,
            code: 'DV010',
            name: 'Siêu âm thai 3D',
            group: 'Sản phụ khoa',
            department: 'Sản',
            servicePrice: 450000,
            insurancePrice: 200000,
            status: 'active',
            updatedBy: 'BS. Lan',
            updatedAt: '2024-01-05',
            description: 'Siêu âm 3D đánh giá hình thái thai nhi'
        },
        {
            id: 11,
            code: 'DV011',
            name: 'Chụp CT ngực có cản quang',
            group: 'Chẩn đoán hình ảnh',
            department: 'Chẩn đoán hình ảnh',
            servicePrice: 1200000,
            insurancePrice: 800000,
            status: 'inactive',
            updatedBy: 'BS. Sơn',
            updatedAt: '2024-01-11',
            description: 'Chụp cắt lớp vi tính vùng ngực có tiêm thuốc cản quang'
        },
        {
            id: 12,
            code: 'DV012',
            name: 'Điều trị vật lý trị liệu chi trên',
            group: 'Phục hồi chức năng',
            department: 'PHCN',
            servicePrice: 200000,
            insurancePrice: 100000,
            status: 'active',
            updatedBy: 'KTV. Thảo',
            updatedAt: '2024-01-15',
            description: 'Tập phục hồi vận động khớp vai, khuỷu, cổ tay'
        },
        {
            id: 13,
            code: 'DV013',
            name: 'Gây mê toàn thân',
            group: 'Gây mê hồi sức',
            department: 'GMHS',
            servicePrice: 800000,
            insurancePrice: 500000,
            status: 'active',
            updatedBy: 'BS. Oanh',
            updatedAt: '2024-01-13',
            description: 'Gây mê toàn thân trong phẫu thuật lớn'
        },
        {
            id: 14,
            code: 'DV014',
            name: 'Xét nghiệm nước tiểu',
            group: 'Xét nghiệm',
            department: 'Xét nghiệm',
            servicePrice: 100000,
            insurancePrice: 50000,
            status: 'active',
            updatedBy: 'DUC',
            updatedAt: '2024-01-12',
            description: 'Phân tích thành phần nước tiểu bằng máy tự động'
        },
        {
            id: 15,
            code: 'DV015',
            name: 'Khám chuyên khoa Tim mạch',
            group: 'Khám bệnh',
            department: 'Tim mạch',
            servicePrice: 400000,
            insurancePrice: 200000,
            status: 'active',
            updatedBy: 'admin',
            updatedAt: '2024-01-15',
            description: 'Khám, chẩn đoán và tư vấn điều trị bệnh lý tim mạch'
        },
        {
            id: 16,
            code: 'DV016',
            name: 'Xét nghiệm đường huyết nhanh',
            group: 'Xét nghiệm',
            department: 'Xét nghiệm',
            servicePrice: 70000,
            insurancePrice: 30000,
            status: 'active',
            updatedBy: 'DUC',
            updatedAt: '2024-01-15',
            description: 'Kiểm tra nhanh đường huyết mao mạch'
        },
        {
            id: 17,
            code: 'DV017',
            name: 'Khâu vết thương nhỏ',
            group: 'Thủ thuật',
            department: 'Ngoại tổng quát',
            servicePrice: 250000,
            insurancePrice: 125000,
            status: 'active',
            updatedBy: 'BS. Minh',
            updatedAt: '2024-01-13',
            description: 'Khâu vết thương phần mềm dưới 5cm'
        },
        {
            id: 18,
            code: 'DV018',
            name: 'Cắt chỉ sau mổ',
            group: 'Thủ thuật',
            department: 'Ngoại tổng quát',
            servicePrice: 50000,
            insurancePrice: 25000,
            status: 'active',
            updatedBy: 'Điều dưỡng Hạnh',
            updatedAt: '2024-01-14',
            description: 'Thủ thuật cắt chỉ sau phẫu thuật'
        },
        {
            id: 19,
            code: 'DV019',
            name: 'Chụp CT sọ não không cản quang',
            group: 'Chẩn đoán hình ảnh',
            department: 'Chẩn đoán hình ảnh',
            servicePrice: 1000000,
            insurancePrice: 700000,
            status: 'active',
            updatedBy: 'BS. Sơn',
            updatedAt: '2024-01-10',
            description: 'Chụp CT sọ não đánh giá xuất huyết và khối choán chỗ'
        },
        {
            id: 20,
            code: 'DV020',
            name: 'Khám sức khỏe định kỳ doanh nghiệp',
            group: 'Khám bệnh',
            department: 'Khám bệnh',
            servicePrice: 500000,
            insurancePrice: 0,
            status: 'active',
            updatedBy: 'admin',
            updatedAt: '2024-01-09',
            description: 'Khám sức khỏe tổng thể cho nhân viên công ty'
        }
    ]);

    const [filters, setFilters] = useState<Filters>({
        search: '',
        group: '',
        department: '',
        priceType: ''
    });

    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        pageSize: 20,
        total: 100
    });

    const [showForm, setShowForm] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    // Filter services based on criteria
    const filteredServices = services.filter(service => {
        const matchesSearch = !filters.search ||
            service.code.toLowerCase().includes(filters.search.toLowerCase()) ||
            service.name.toLowerCase().includes(filters.search.toLowerCase());

        const matchesGroup = !filters.group || service.group === filters.group;
        const matchesDepartment = !filters.department || service.department === filters.department;

        return matchesSearch && matchesGroup && matchesDepartment;
    });

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleAddService = () => {
        setSelectedService(null);
        setShowForm(true);
    };

    const handleEditService = (service: Service) => {
        setSelectedService(service);
        setShowForm(true);
    };

    const handleViewDetail = (service: Service) => {
        setSelectedService(service);
        setShowDetail(true);
    };

    const handleDeleteService = (id: number) => {
        if (confirm('Bạn có chắc muốn xóa dịch vụ này?')) {
            setServices(prev => prev.filter(service => service.id !== id));
        }
    };

    const handleSaveService = (serviceData: ServiceFormData) => {
        if (selectedService) {
            // Update existing service
            setServices(prev => prev.map(service =>
                service.id === selectedService.id
                    ? {
                        ...service,
                        ...serviceData,
                        updatedAt: new Date().toISOString().split('T')[0]
                    }
                    : service
            ));
        } else {
            // Add new service
            const newService: Service = {
                id: Math.max(...services.map(s => s.id)) + 1,
                ...serviceData,
                updatedBy: 'admin',
                updatedAt: new Date().toISOString().split('T')[0]
            };
            setServices(prev => [...prev, newService]);
        }
        setShowForm(false);
    };

    return (
        <div className="service-catalog">
            {/* Header / Toolbar */}
            <div className="catalog-header">
                <h1>Danh Mục Dịch Vụ Tại ITO</h1>
                <div className="toolbar">
                    <div className="filter-group">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Tìm kiếm mã, tên dịch vụ..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="search-input"
                            />
                        </div>

                        <select
                            value={filters.group}
                            onChange={(e) => handleFilterChange('group', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Tất cả nhóm dịch vụ</option>
                            <option value="Khám bệnh">Khám bệnh</option>
                            <option value="Xét nghiệm">Xét nghiệm</option>
                            <option value="Chẩn đoán hình ảnh">Chẩn đoán hình ảnh</option>
                            <option value="Phẫu thuật">Phẫu thuật</option>
                        </select>

                        <select
                            value={filters.department}
                            onChange={(e) => handleFilterChange('department', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Tất cả khoa</option>
                            <option value="Khám bệnh">Khám bệnh</option>
                            <option value="Xét nghiệm">Xét nghiệm</option>
                            <option value="Chẩn đoán hình ảnh">Chẩn đoán hình ảnh</option>
                            <option value="Ngoại khoa">Ngoại khoa</option>
                        </select>

                        <select
                            value={filters.priceType}
                            onChange={(e) => handleFilterChange('priceType', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Tất cả loại giá</option>
                            <option value="BHYT">BHYT</option>
                            <option value="DV">Dịch vụ</option>
                        </select>
                    </div>

                    <div className="action-buttons">
                        <button className="btn primary" onClick={handleAddService}>
                            <span className="btn-icon">➕</span>
                            Thêm dịch vụ
                        </button>
                        <button className="btn secondary">
                            <span className="btn-icon">📤</span>
                            Import Excel
                        </button>
                        <button className="btn secondary">
                            <span className="btn-icon">⬇️</span>
                            Export Excel
                        </button>
                    </div>
                </div>
            </div>

            {/* Services Table */}
            <div className="table-container">
                <table className="services-table">
                    <thead>
                    <tr>
                        <th>Mã</th>
                        <th>Tên dịch vụ</th>
                        <th>Nhóm</th>
                        <th>Khoa</th>
                        <th>Giá DV</th>
                        <th>Giá BHYT</th>
                        <th>Trạng thái</th>
                        <th>Cập nhật bởi</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredServices.map(service => (
                        <tr key={service.id}>
                            <td className="code-cell">{service.code}</td>
                            <td className="name-cell">{service.name}</td>
                            <td>{service.group}</td>
                            <td>{service.department}</td>
                            <td className="price-cell">{service.servicePrice.toLocaleString()}đ</td>
                            <td className="price-cell">{service.insurancePrice.toLocaleString()}đ</td>
                            <td>
                                    <span className={`status-badge ${service.status}`}>
                                        {service.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                    </span>
                            </td>
                            <td>{service.updatedBy}</td>
                            <td className="actions-cell">
                                <button
                                    className="btn-icon view-btn"
                                    onClick={() => handleViewDetail(service)}
                                    title="Xem chi tiết"
                                >
                                    👁️
                                </button>
                                <button
                                    className="btn-icon edit-btn"
                                    onClick={() => handleEditService(service)}
                                    title="Sửa"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="btn-icon delete-btn"
                                    onClick={() => handleDeleteService(service.id)}
                                    title="Xóa"
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
                <div className="pagination-info">
                    Hiển thị {filteredServices.length} trên {pagination.total} dịch vụ
                </div>
                <div className="pagination-controls">
                    <select
                        value={pagination.pageSize}
                        onChange={(e) => setPagination(prev => ({ ...prev, pageSize: parseInt(e.target.value) }))}
                        className="page-size-select"
                    >
                        <option value={20}>20 dòng / trang</option>
                        <option value={50}>50 dòng / trang</option>
                        <option value={100}>100 dòng / trang</option>
                    </select>

                    <div className="page-buttons">
                        <button className="page-btn" disabled={pagination.page === 1}>
                            ‹‹
                        </button>
                        <span className="page-info">
                            Trang {pagination.page}
                        </span>
                        <button className="page-btn">
                            ››
                        </button>
                    </div>
                </div>
            </div>

            {/* Service Form Modal */}
            {showForm && (
                <ServiceForm
                    service={selectedService}
                    onSave={handleSaveService}
                    onClose={() => setShowForm(false)}
                />
            )}

            {/* Service Detail Drawer */}
            {showDetail && (
                <ServiceDetail
                    service={selectedService}
                    onClose={() => setShowDetail(false)}
                    onEdit={() => {
                        setShowDetail(false);
                        setShowForm(true);
                    }}
                />
            )}
        </div>
    );
}

// Service Form Component
interface ServiceFormProps {
    service: Service | null;
    onSave: (data: ServiceFormData) => void;
    onClose: () => void;
}

function ServiceForm({ service, onSave, onClose }: ServiceFormProps) {
    const [formData, setFormData] = useState<ServiceFormData>(service ? {
        code: service.code,
        name: service.name,
        group: service.group,
        department: service.department,
        servicePrice: service.servicePrice,
        insurancePrice: service.insurancePrice,
        description: service.description || '',
        status: service.status
    } : {
        code: '',
        name: '',
        group: '',
        department: '',
        servicePrice: 0,
        insurancePrice: 0,
        description: '',
        status: 'active'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (field: keyof ServiceFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNumberChange = (field: keyof ServiceFormData, value: string) => {
        const numValue = value === '' ? 0 : parseInt(value) || 0;
        setFormData(prev => ({ ...prev, [field]: numValue }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{service ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="service-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Mã dịch vụ *</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => handleChange('code', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Tên dịch vụ *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Nhóm dịch vụ *</label>
                            <select
                                value={formData.group}
                                onChange={(e) => handleChange('group', e.target.value)}
                                required
                            >
                                <option value="">Chọn nhóm</option>
                                <option value="Khám bệnh">Khám bệnh</option>
                                <option value="Xét nghiệm">Xét nghiệm</option>
                                <option value="Chẩn đoán hình ảnh">Chẩn đoán hình ảnh</option>
                                <option value="Phẫu thuật">Phẫu thuật</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Khoa *</label>
                            <select
                                value={formData.department}
                                onChange={(e) => handleChange('department', e.target.value)}
                                required
                            >
                                <option value="">Chọn khoa</option>
                                <option value="Khám bệnh">Khám bệnh</option>
                                <option value="Xét nghiệm">Xét nghiệm</option>
                                <option value="Chẩn đoán hình ảnh">Chẩn đoán hình ảnh</option>
                                <option value="Ngoại khoa">Ngoại khoa</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Giá dịch vụ *</label>
                            <input
                                type="number"
                                value={formData.servicePrice}
                                onChange={(e) => handleNumberChange('servicePrice', e.target.value)}
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Giá BH *</label>
                            <input
                                type="number"
                                value={formData.insurancePrice}
                                onChange={(e) => handleNumberChange('insurancePrice', e.target.value)}
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Mô tả</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                // rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>Trạng thái</label>
                            <div className="toggle-group">
                                <button
                                    type="button"
                                    className={`toggle-btn ${formData.status === 'active' ? 'active' : ''}`}
                                    onClick={() => handleChange('status', 'active')}
                                >
                                    Đang hoạt động
                                </button>
                                <button
                                    type="button"
                                    className={`toggle-btn ${formData.status === 'inactive' ? 'active' : ''}`}
                                    onClick={() => handleChange('status', 'inactive')}
                                >
                                    Ngừng hoạt động
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn primary">
                            {service ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Service Detail Component
interface ServiceDetailProps {
    service: Service | null;
    onClose: () => void;
    onEdit: () => void;
}

function ServiceDetail({ service, onClose, onEdit }: ServiceDetailProps) {
    if (!service) return null;

    return (
        <div className="drawer-overlay">
            <div className="drawer-content">
                <div className="drawer-header">
                    <h2>Chi tiết dịch vụ</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="detail-content">
                    <div className="detail-section">
                        <h3>Thông tin cơ bản</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label>Mã dịch vụ:</label>
                                <span>{service.code}</span>
                            </div>
                            <div className="detail-item">
                                <label>Tên dịch vụ:</label>
                                <span>{service.name}</span>
                            </div>
                            <div className="detail-item">
                                <label>Nhóm dịch vụ:</label>
                                <span>{service.group}</span>
                            </div>
                            <div className="detail-item">
                                <label>Khoa:</label>
                                <span>{service.department}</span>
                            </div>
                            {service.description && (
                                <div className="detail-item full-width">
                                    <label>Mô tả:</label>
                                    <span>{service.description}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Thông tin giá</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label>Giá dịch vụ:</label>
                                <span className="price">{service.servicePrice.toLocaleString()}đ</span>
                            </div>
                            <div className="detail-item">
                                <label>Giá BHYT:</label>
                                <span className="price">{service.insurancePrice.toLocaleString()}đ</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Thông tin hệ thống</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label>Trạng thái:</label>
                                <span className={`status-badge ${service.status}`}>
                                    {service.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Cập nhật bởi:</label>
                                <span>{service.updatedBy}</span>
                            </div>
                            <div className="detail-item">
                                <label>Ngày cập nhật:</label>
                                <span>{service.updatedAt}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="drawer-actions">
                    <button className="btn secondary" onClick={onClose}>
                        Đóng
                    </button>
                    <button className="btn primary" onClick={onEdit}>
                        ✏️ Chỉnh sửa
                    </button>
                </div>
            </div>
        </div>
    );
}

const style = document.createElement('style')
style.innerHTML = `
:root { 
/* Service Catalog Styles */
.service-catalog {
    padding: 20px;
    background: var(--bg-color);
    min-height: 100%;
}

.catalog-header {
    margin-bottom: 24px;
}

.catalog-header h1 {
    margin: 0 0 16px 0;
    font-size: 24px;
    font-weight: 700;
    color: var(--text-color);
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
}

.filter-group {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    flex: 1;
}

.search-box {
    position: relative;
    min-width: 250px;
}

.search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
}

.search-input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--card-bg);
    color: var(--text-color);
    font-size: 14px;
    transition: border-color 0.2s ease;
}

.search-input:focus {
    outline: none;
    border-color: var(--btn-primary-bg);
}

.filter-select {
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--card-bg);
    color: var(--text-color);
    font-size: 14px;
    min-width: 160px;
    cursor: pointer;
    transition: border-color 0.2s ease;
}

.filter-select:focus {
    outline: none;
    border-color: var(--btn-primary-bg);
}

.action-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: 1px solid;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
}

.btn.primary {
    background: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    border-color: var(--btn-primary-bg);
}

.btn.primary:hover {
    background: var(--btn-primary-bg);
    opacity: 0.9;
    transform: translateY(-1px);
}

.btn.secondary {
    background: var(--btn-bg);
    color: var(--text-color);
    border-color: var(--btn-border);
}

.btn.secondary:hover {
    border-color: var(--btn-primary-bg);
    color: var(--btn-primary-bg);
}

.btn-icon {
    font-size: 16px;
}

/* Table Styles */
.table-container {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.services-table {
    width: 100%;
    border-collapse: collapse;
}

.services-table th {
    background: var(--sidebar-bg);
    color: var(--sidebar-text);
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid var(--border-color);
}

.services-table td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border-color);
    font-size: 14px;
}

.services-table tr:last-child td {
    border-bottom: none;
}

.services-table tr:hover {
    background: rgba(59, 130, 246, 0.05);
}

.code-cell {
    font-weight: 600;
    color: var(--btn-primary-bg);
}

.name-cell {
    font-weight: 500;
}

.price-cell {
    text-align: right;
    font-weight: 600;
    font-family: 'Courier New', monospace;
}

.actions-cell {
    display: flex;
    gap: 8px;
}

.actions-cell .btn-icon {
    background: none;
    border: none;
    padding: 6px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
}

.actions-cell .btn-icon:hover {
    background: var(--bg-color);
    transform: scale(1.1);
}

.view-btn:hover {
    color: #3b82f6;
}

.edit-btn:hover {
    color: #f59e0b;
}

.delete-btn:hover {
    color: #ef4444;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    display: inline-block;
}

.status-badge.active {
    background: #d1fae5;
    color: #065f46;
}

.status-badge.inactive {
    background: #fef3c7;
    color: #92400e;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
}

.pagination-info {
    color: var(--muted-color);
    font-size: 14px;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 16px;
}

.page-size-select {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--card-bg);
    color: var(--text-color);
    font-size: 14px;
    cursor: pointer;
}

.page-buttons {
    display: flex;
    align-items: center;
    gap: 12px;
}

.page-btn {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    background: var(--card-bg);
    color: var(--text-color);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
}

.page-btn:hover:not(:disabled) {
    border-color: var(--btn-primary-bg);
    color: var(--btn-primary-bg);
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-info {
    font-size: 14px;
    color: var(--text-color);
    font-weight: 500;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
}

.modal-content {
    background: var(--card-bg);
    border-radius: 12px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
    margin: 0;
    font-size: 20px;
    color: var(--text-color);
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--muted-color);
    padding: 4px;
    transition: color 0.2s ease;
}

.close-btn:hover {
    color: var(--text-color);
}

/* Form Styles */
.service-form {
    padding: 20px;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-group label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color);
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-color);
    color: var(--text-color);
    font-size: 14px;
    transition: border-color 0.2s ease;
    font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--btn-primary-bg);
}

.form-group textarea {
    resize: vertical;
    min-height: 80px;
}

.toggle-group {
    display: flex;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    overflow: hidden;
}

.toggle-btn {
    flex: 1;
    padding: 10px 12px;
    border: none;
    background: var(--bg-color);
    color: var(--text-color);
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
}

.toggle-btn.active {
    background: var(--btn-primary-bg);
    color: var(--btn-primary-text);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid var(--border-color);
}

/* Drawer Styles */
.drawer-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 500px;
    background: var(--card-bg);
    border-left: 1px solid var(--border-color);
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: flex;
    flex-direction: column;
}

.drawer-content {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.drawer-header {
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

.drawer-header h2 {
    margin: 0;
    font-size: 20px;
    color: var(--text-color);
}

.detail-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.detail-section {
    margin-bottom: 32px;
}

.detail-section h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
}

.detail-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
}

.detail-item.full-width {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}

.detail-item label {
    font-weight: 500;
    color: var(--muted-color);
    min-width: 120px;
    flex-shrink: 0;
}

.detail-item span {
    text-align: right;
    color: var(--text-color);
    word-break: break-word;
}

.detail-item.full-width span {
    text-align: left;
}

.detail-item .price {
    font-weight: 600;
    color: var(--success-color);
    font-family: 'Courier New', monospace;
}

.drawer-actions {
    padding: 20px;
    border-top: 1px solid var(--border-color);
    display: flex;
    gap: 12px;
    flex-shrink: 0;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted-color);
}

.empty-state .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
}

.empty-state h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    color: var(--text-color);
}

.empty-state p {
    margin: 0;
    font-size: 14px;
}

/* Loading State */
.loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 60px 20px;
}

.loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--btn-primary-bg);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 1024px) {
    .toolbar {
        flex-direction: column;
    }
    
    .filter-group {
        width: 100%;
    }
    
    .search-box {
        min-width: 100%;
    }
    
    .form-grid {
        grid-template-columns: 1fr;
    }
    
    .drawer-overlay {
        width: 400px;
    }
}

@media (max-width: 768px) {
    .service-catalog {
        padding: 16px;
    }
    
    .pagination {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
    }
    
    .pagination-controls {
        justify-content: space-between;
    }
    
    .action-buttons {
        width: 100%;
    }
    
    .action-buttons .btn {
        flex: 1;
        justify-content: center;
    }
    
    .drawer-overlay {
        width: 100%;
    }
    
    .modal-content {
        margin: 0;
        border-radius: 0;
        max-height: 100vh;
    }
    
    .modal-overlay {
        padding: 0;
    }
}

@media (max-width: 480px) {
    .filter-group {
        flex-direction: column;
    }
    
    .filter-select {
        min-width: 100%;
    }
    
    .actions-cell {
        flex-direction: column;
        gap: 4px;
    }
    
    .actions-cell .btn-icon {
        width: 28px;
        height: 28px;
        font-size: 14px;
    }
    
    .detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
    
    .detail-item label {
        min-width: auto;
    }
    
    .detail-item span {
        text-align: left;
    }
}

/* Dark Theme Enhancements */
[data-theme="dark"] .table-container {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .modal-content {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

[data-theme="dark"] .drawer-overlay {
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .status-badge.active {
    background: rgba(34, 197, 94, 0.2);
    color: #4ade80;
}

[data-theme="dark"] .status-badge.inactive {
    background: rgba(245, 158, 11, 0.2);
    color: #fbbf24;
}

/* Scrollbar Styling */
.detail-content::-webkit-scrollbar,
.modal-content::-webkit-scrollbar {
    width: 6px;
}

.detail-content::-webkit-scrollbar-track,
.modal-content::-webkit-scrollbar-track {
    background: transparent;
}

.detail-content::-webkit-scrollbar-thumb,
.modal-content::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
}

.detail-content::-webkit-scrollbar-thumb:hover,
.modal-content::-webkit-scrollbar-thumb:hover {
    background: var(--muted-color);
}
 }

`
document.head.appendChild(style)