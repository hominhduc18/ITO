// components/ServiceCatalog.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';

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

interface Service {
    id: number;
    code: string;
    name: string;
    nameEn: string;
    group: string;
    department: string;
    servicePrice: number;
    insurancePrice: number;
    status: 'active' | 'inactive';
    updatedBy: string;
    updatedAt: string;
}

interface Filters {
    search: string;
    group: string;
    department: string;
    searchLanguage: string;
}

interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

export function ServiceCatalogForm() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>('');

    const [filters, setFilters] = useState<Filters>({
        search: '',
        group: '',
        department: '',
        searchLanguage: 'both'
    });

    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        pageSize: 20,
        total: 0
    });

    const [showDetail, setShowDetail] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    // Fetch data từ API - CHỈ GET
    useEffect(() => {
        fetchServicesFromAPI();
    }, []);

    const fetchServicesFromAPI = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setDebugInfo('Bắt đầu gọi API...');

            console.log('Đang gọi API Danh mục dịch vụ...');
            const apiUrl = '/api/DichVu';
            setDebugInfo(`Gọi API: ${apiUrl}`);

            const response = await fetch(apiUrl);
            setDebugInfo(`API response status: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            const data: APIService[] = await response.json();
            console.log('API response data:', data);
            setDebugInfo(`API trả về ${data.length} items, kiểu dữ liệu: ${typeof data}`);

            if (!Array.isArray(data)) {
                throw new Error(`Dữ liệu API trả về không phải array: ${typeof data}`);
            }

            if (data.length === 0) {
                setDebugInfo('API trả về mảng rỗng');
                console.warn('API trả về danh sách dịch vụ rỗng');
            }

            const convertedServices: Service[] = data.map((apiService) => {
                return {
                    id: apiService.dichVu_Id,
                    code: apiService.maDichVu || 'N/A',
                    name: apiService.tenDichVu || 'Không có tên',
                    nameEn: apiService.tenKhongDau || apiService.tenDichVu || 'No name',
                    group: apiService.tenNhomDichVu || `Nhóm ${apiService.nhomDichVu_Id}`,
                    department: apiService.tenKhoa || 'Chưa xác định',
                    servicePrice: apiService.giaDichVu || 0,
                    insurancePrice: apiService.giaBHYT || 0,
                    status: apiService.trangThai === 0 ? 'inactive' : 'active',
                    updatedBy: 'system',
                    updatedAt: new Date().toISOString().split('T')[0]
                };
            });

            console.log('✅ Converted services:', convertedServices);
          //  setDebugInfo(`Chuyển đổi thành công ${convertedServices.length} dịch vụ`);

            setServices(convertedServices);
            setPagination(prev => ({ ...prev, total: convertedServices.length }));

        } catch (err) {
            console.error('❌ Error fetching services:', err);
            const errorMessage = `Không thể tải danh sách dịch vụ: ${err instanceof Error ? err.message : 'Unknown error'}`;
            setError(errorMessage);
            setDebugInfo(`Lỗi: ${errorMessage}`);


            setServices([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Tối ưu hóa filter với useMemo
    const filteredServices = useMemo(() => {
        if (!filters.search && !filters.group && !filters.department) {
            return services;
        }

        return services.filter(service => {
            const matchesSearch = !filters.search ||
                service.code.toLowerCase().includes(filters.search.toLowerCase()) ||
                (filters.searchLanguage === 'vi' && service.name.toLowerCase().includes(filters.search.toLowerCase())) ||
                (filters.searchLanguage === 'en' && service.nameEn.toLowerCase().includes(filters.search.toLowerCase())) ||
                (filters.searchLanguage === 'both' && (
                    service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                    service.nameEn.toLowerCase().includes(filters.search.toLowerCase())
                ));

            const matchesGroup = !filters.group || service.group === filters.group;
            const matchesDepartment = !filters.department || service.department === filters.department;

            return matchesSearch && matchesGroup && matchesDepartment;
        });
    }, [services, filters.search, filters.group, filters.department, filters.searchLanguage]);

    // Tối ưu hóa pagination với useMemo
    const paginatedServices = useMemo(() => {
        const startIndex = (pagination.page - 1) * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        return filteredServices.slice(startIndex, endIndex);
    }, [filteredServices, pagination.page, pagination.pageSize]);

    const totalPages = Math.ceil(filteredServices.length / pagination.pageSize);

    // Lấy danh sách các nhóm dịch vụ và khoa duy nhất từ API với useMemo
    const serviceGroups = useMemo(() =>
            [...new Set(services.map(service => service.group))].sort(),
        [services]
    );

    const departments = useMemo(() =>
            [...new Set(services.map(service => service.department))].sort(),
        [services]
    );

    const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        // Reset về trang 1 khi filter thay đổi
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    const handleViewDetail = useCallback((service: Service) => {
        setSelectedService(service);
        setShowDetail(true);
    }, []);

    const handleRefresh = useCallback(() => {
        fetchServicesFromAPI();
    }, [fetchServicesFromAPI]);

    // Reset filters
    const handleResetFilters = useCallback(() => {
        setFilters({
            search: '',
            group: '',
            department: '',
            searchLanguage: 'both'
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    // Test với dữ liệu mẫu tạm thời
    const useSampleData = useCallback(() => {
        const sampleData: Service[] = [
            {
                id: 1,
                code: "DV001",
                name: "Khám tổng quát",
                nameEn: "General examination",
                group: "Khám bệnh",
                department: "Khoa Khám bệnh",
                servicePrice: 200000,
                insurancePrice: 150000,
                status: 'active',
                updatedBy: 'system',
                updatedAt: '2024-01-15'
            },
            {
                id: 2,
                code: "XN001",
                name: "Xét nghiệm máu",
                nameEn: "Blood test",
                group: "Xét nghiệm",
                department: "Khoa Xét nghiệm",
                servicePrice: 150000,
                insurancePrice: 100000,
                status: 'active',
                updatedBy: 'system',
                updatedAt: '2024-01-15'
            },
            {
                id: 3,
                code: "CDHA001",
                name: "Chụp X-Quang ngực",
                nameEn: "Chest X-Ray",
                group: "Chẩn đoán hình ảnh",
                department: "Khoa Chẩn đoán hình ảnh",
                servicePrice: 300000,
                insurancePrice: 250000,
                status: 'active',
                updatedBy: 'system',
                updatedAt: '2024-01-15'
            }
        ];
        setServices(sampleData);
        setPagination(prev => ({ ...prev, total: sampleData.length }));
        setDebugInfo('Đang sử dụng dữ liệu mẫu');
    }, []);

    if (loading) {
        return (
            <div className="service-catalog">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Đang tải danh sách dịch vụ từ API...</p>
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                        {debugInfo}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="service-catalog">
            {/* Header / Toolbar */}
            <div className="catalog-header">
                <div className="header-top">
                    <h1>Danh Mục Dịch Vụ</h1>
                    <div className="header-actions">
                        <button className="btn secondary" onClick={handleRefresh}>
                            <span className="btn-icon">🔄</span>
                            Làm mới API
                        </button>
                        <button className="btn secondary" onClick={useSampleData}>
                            <span className="btn-icon">🧪</span>
                            Dữ liệu mẫu
                        </button>
                        <div className="api-info">
                            <span className="api-status">📡 API GET</span>
                            <span className="item-count">{services.length.toLocaleString()} dịch vụ</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="error-banner">
                        <div>
                            <strong>Lỗi kết nối API:</strong>
                            <span style={{marginLeft: '10px'}}>{error}</span>
                        </div>
                        <div>
                            <button onClick={fetchServicesFromAPI}>Thử lại API</button>
                            <button onClick={useSampleData} style={{marginLeft: '10px', background: '#10b981'}}>
                                Dùng dữ liệu mẫu
                            </button>
                        </div>
                    </div>
                )}

                {/* Debug info */}
                {debugInfo && (
                    <div style={{
                        background: '#f3f4f6',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        marginBottom: '12px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <strong>Debug:</strong> {debugInfo}
                    </div>
                )}

                <div className="toolbar">
                    <div className="filter-group">
                        <div className="search-container">
                            <div className="search-box">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Tìm theo mã, tên dịch vụ (Việt/Anh)..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <select
                                value={filters.searchLanguage}
                                onChange={(e) => handleFilterChange('searchLanguage', e.target.value)}
                                className="language-select"
                                title="Chọn ngôn ngữ tìm kiếm"
                            >
                                <option value="both">Tìm cả Việt & Anh</option>
                                <option value="vi">Chỉ tiếng Việt</option>
                                <option value="en">Chỉ tiếng Anh</option>
                            </select>
                        </div>

                        <select
                            value={filters.group}
                            onChange={(e) => handleFilterChange('group', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Tất cả nhóm dịch vụ</option>
                            {serviceGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>

                        <select
                            value={filters.department}
                            onChange={(e) => handleFilterChange('department', e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Tất cả khoa</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>

                        {(filters.search || filters.group || filters.department) && (
                            <button className="btn secondary" onClick={handleResetFilters}>
                                <span className="btn-icon">❌</span>
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>

                    <div className="action-buttons">
                        <button className="btn secondary" onClick={() => alert('Chức năng đang phát triển')}>
                            <span className="btn-icon">📤</span>
                            Export Excel
                        </button>
                    </div>
                </div>

                {/* Filter summary */}
                {(filters.search || filters.group || filters.department) && (
                    <div className="filter-summary">
                        <span className="filtered-count">
                            Đang hiển thị {filteredServices.length.toLocaleString()} trên {services.length.toLocaleString()} dịch vụ
                        </span>
                    </div>
                )}
            </div>

            {/* Services Table */}
            <div className="table-container">
                <table className="services-table">
                    <thead>
                    <tr>
                        <th>Mã DV</th>
                        <th>Tên dịch vụ (VN)</th>
                        <th>Tên không dấu</th>
                        <th>Nhóm</th>
                        <th>Khoa</th>
                        <th>Giá DV</th>
                        <th>Giá BHYT</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedServices.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="empty-state">
                                {services.length === 0 ?
                                    'Không có dữ liệu dịch vụ. Hãy thử "Dữ liệu mẫu" hoặc kiểm tra kết nối API.'
                                    : 'Không tìm thấy dịch vụ phù hợp'
                                }
                            </td>
                        </tr>
                    ) : (
                        paginatedServices.map(service => (
                            <tr key={service.id}>
                                <td className="code-cell">{service.code}</td>
                                <td className="name-cell">{service.name}</td>
                                <td className="name-en-cell">{service.nameEn}</td>
                                <td>{service.group}</td>
                                <td>{service.department}</td>
                                <td className="price-cell">{service.servicePrice.toLocaleString()}đ</td>
                                <td className="price-cell">{service.insurancePrice.toLocaleString()}đ</td>
                                <td>
                                        <span className={`status-badge ${service.status}`}>
                                            {service.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                        </span>
                                </td>
                                <td className="actions-cell">
                                    <button
                                        className="btn-icon view-btn"
                                        onClick={() => handleViewDetail(service)}
                                        title="Xem chi tiết"
                                    >
                                        👁️
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {services.length > 0 && (
                <div className="pagination">
                    <div className="pagination-info">
                        Hiển thị {((pagination.page - 1) * pagination.pageSize + 1).toLocaleString()}-
                        {Math.min(pagination.page * pagination.pageSize, filteredServices.length).toLocaleString()}
                        trên {filteredServices.length.toLocaleString()} dịch vụ
                    </div>
                    <div className="pagination-controls">
                        <select
                            value={pagination.pageSize}
                            onChange={(e) => setPagination(prev => ({ ...prev, pageSize: parseInt(e.target.value), page: 1 }))}
                            className="page-size-select"
                        >
                            <option value={10}>10 dòng / trang</option>
                            <option value={20}>20 dòng / trang</option>
                            <option value={50}>50 dòng / trang</option>
                            <option value={100}>100 dòng / trang</option>
                        </select>

                        <div className="page-buttons">
                            <button
                                className="page-btn"
                                disabled={pagination.page === 1}
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            >
                                ‹‹
                            </button>
                            <span className="page-info">
                                Trang {pagination.page} / {totalPages}
                            </span>
                            <button
                                className="page-btn"
                                disabled={pagination.page >= totalPages}
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            >
                                ››
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Detail Drawer */}
            {showDetail && (
                <ServiceDetail
                    service={selectedService}
                    onClose={() => setShowDetail(false)}
                />
            )}
        </div>
    );
}

// Service Detail Component (giữ nguyên)
function ServiceDetail({ service, onClose }: { service: Service | null, onClose: () => void }) {
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
                                <label>Tên dịch vụ (VN):</label>
                                <span>{service.name}</span>
                            </div>
                            <div className="detail-item">
                                <label>Tên không dấu (EN):</label>
                                <span>{service.nameEn}</span>
                            </div>
                            <div className="detail-item">
                                <label>Nhóm dịch vụ:</label>
                                <span>{service.group}</span>
                            </div>
                            <div className="detail-item">
                                <label>Khoa:</label>
                                <span>{service.department}</span>
                            </div>
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
                    <button className="btn primary" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

// CSS Styles (giữ nguyên)
const serviceCatalogStyles = `
/* CSS styles từ phiên bản trước - giữ nguyên */
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

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.api-info {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
}

.api-status {
    background: #3b82f6;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 500;
}

.item-count {
    color: var(--muted-color);
    font-weight: 500;
}

.filter-summary {
    margin-top: 12px;
    padding: 8px 12px;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 6px;
    font-size: 14px;
}

.filtered-count {
    color: #0369a1;
    font-weight: 500;
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

.search-container {
    display: flex;
    gap: 8px;
    align-items: center;
    min-width: 400px;
}

.search-box {
    position: relative;
    flex: 1;
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

.language-select, .filter-select {
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--card-bg);
    color: var(--text-color);
    font-size: 14px;
    cursor: pointer;
    transition: border-color 0.2s ease;
}

.language-select {
    font-size: 12px;
    min-width: 140px;
}

.filter-select {
    min-width: 160px;
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

.error-banner {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.error-banner button {
    background: #dc2626;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    color: var(--muted-color);
}

.loading-state p {
    margin-top: 16px;
    font-size: 16px;
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

.table-container {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    max-height: 600px;
    overflow-y: auto;
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
    position: sticky;
    top: 0;
    z-index: 10;
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

.name-en-cell {
    font-style: italic;
    color: var(--muted-color);
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

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted-color);
    font-style: italic;
    background: var(--bg-color);
}

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
    justify-content: flex-end;
}

/* Responsive Design */
@media (max-width: 768px) {
    .service-catalog {
        padding: 16px;
    }
    
    .header-top {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }
    
    .header-actions {
        width: 100%;
        justify-content: space-between;
    }
    
    .toolbar {
        flex-direction: column;
    }
    
    .filter-group {
        width: 100%;
    }
    
    .search-container {
        min-width: 100%;
        flex-direction: column;
    }
    
    .language-select {
        min-width: 100%;
    }
    
    .drawer-overlay {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .filter-group {
        flex-direction: column;
    }
    
    .filter-select {
        min-width: 100%;
    }
    
    .pagination {
        flex-direction: column;
        gap: 12px;
    }
    
    .pagination-controls {
        justify-content: space-between;
        width: 100%;
    }
}

/* Dark Theme */
[data-theme="dark"] .table-container {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .status-badge.active {
    background: rgba(34, 197, 94, 0.2);
    color: #4ade80;
}

[data-theme="dark"] .status-badge.inactive {
    background: rgba(245, 158, 11, 0.2);
    color: #fbbf24;
}

[data-theme="dark"] .filter-summary {
    background: rgba(56, 189, 248, 0.1);
    border-color: rgba(56, 189, 248, 0.3);
}

[data-theme="dark"] .filtered-count {
    color: #7dd3fc;
}
`;

// Inject styles
const style = document.createElement('style');
style.innerHTML = serviceCatalogStyles;
document.head.appendChild(style);