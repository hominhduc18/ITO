// components/ServiceCatalog.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './ServiceCatalog.css';

// Interfaces
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
    donViTinh?: string;
    donGiaMin?: number;
    donGiaMax?: number;
    bhyt?: boolean;
    tamNgung?: boolean;
    createdDate?: string;
    createdBy?: string;
    modifiedDate?: string;
    modifiedBy?: string;
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
    unit: string;
    minPrice: number;
    maxPrice: number;
    hasInsurance: boolean;
    isPaused: boolean;
    createdBy?: string;
    createdDate?: string;
    modifiedBy?: string;
    modifiedDate?: string;
}

interface Filters {
    search: string;
    group: string;
    department: string;
    searchLanguage: string;
    status: string;
    priceRange: {
        min: number;
        max: number;
    };
    dateRange: {
        from: string;
        to: string;
    };
}

interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

interface ServiceFormData {
    code: string;
    name: string;
    nameEn: string;
    group: string;
    department: string;
    servicePrice: number;
    insurancePrice: number;
    status: 'active' | 'inactive';
    unit: string;
    minPrice: number;
    maxPrice: number;
    hasInsurance: boolean;
    isPaused: boolean;
}

interface APIResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface SearchParams {
    keyword?: string;
    groupId?: number;
    departmentId?: number;
    status?: number;
    page?: number;
    pageSize?: number;
    minPrice?: number;
    maxPrice?: number;
    fromDate?: string;
    toDate?: string;
}

interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
}

export function ServiceCatalogForm() {// States
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>('');
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [filters, setFilters] = useState<Filters>({
        search: '',
        group: '',
        department: '',
        searchLanguage: 'both',
        status: 'all',
        priceRange: { min: 0, max: 10000000 },
        dateRange: { from: '', to: '' }
    });

    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        pageSize: 20,
        total: 0
    });

    const [showDetail, setShowDetail] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState<ServiceFormData>(getDefaultFormData());
    const [bulkActions, setBulkActions] = useState<{
        selectedIds: number[];
        isSelectAll: boolean;
    }>({
        selectedIds: [],
        isSelectAll: false
    });
    const [exportLoading, setExportLoading] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        withInsurance: 0
    });

    // Helper functions
    function getDefaultFormData(): ServiceFormData {
        return {
            code: '',
            name: '',
            nameEn: '',
            group: '',
            department: '',
            servicePrice: 0,
            insurancePrice: 0,
            status: 'active',
            unit: 'Lần',
            minPrice: 0,
            maxPrice: 0,
            hasInsurance: false,
            isPaused: false
        };
    }

    function generateServiceCode(): string {
        const timestamp = new Date().getTime();
        return `DV${timestamp.toString().slice(-6)}`;
    }

    function addNotification(type: Notification['type'], message: string) {
        const id = Math.random().toString(36).substr(2, 9);
        const notification: Notification = {
            id,
            type,
            message,
            timestamp: new Date()
        };
        setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    }

    // API functions
    const fetchServicesFromAPI = useCallback(async (searchParams?: SearchParams) => {
        try {
            setLoading(true);
            setError(null);

            let apiUrl = '/api/DichVu';
            const params = new URLSearchParams();

            if (searchParams?.keyword) params.append('keyword', searchParams.keyword);
            if (searchParams?.groupId) params.append('nhomDichVu_Id', searchParams.groupId.toString());
            if (searchParams?.departmentId) params.append('khoaId', searchParams.departmentId.toString());
            if (searchParams?.status !== undefined) params.append('trangThai', searchParams.status.toString());
            if (searchParams?.page) params.append('page', searchParams.page.toString());
            if (searchParams?.pageSize) params.append('pageSize', searchParams.pageSize.toString());
            if (searchParams?.minPrice) params.append('minPrice', searchParams.minPrice.toString());
            if (searchParams?.maxPrice) params.append('maxPrice', searchParams.maxPrice.toString());
            if (searchParams?.fromDate) params.append('fromDate', searchParams.fromDate);
            if (searchParams?.toDate) params.append('toDate', searchParams.toDate);

            if (params.toString()) {
                apiUrl += `?${params.toString()}`;
            }

            setDebugInfo(`GET ${apiUrl}`);
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result: APIResponse<APIService[]> = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'API request failed');
            }

            const data = result.data;
            setDebugInfo(`API returned ${data?.length || 0} services`);

            const convertedServices: Service[] = data.map((apiService) => ({
                id: apiService.dichVu_Id,
                code: apiService.maDichVu || 'N/A',
                name: apiService.tenDichVu || 'Không có tên',
                nameEn: apiService.tenKhongDau || apiService.tenDichVu || 'No name',
                group: apiService.tenNhomDichVu || `Nhóm ${apiService.nhomDichVu_Id}`,
                department: apiService.tenKhoa || 'Chưa xác định',
                servicePrice: apiService.donGiaMin || apiService.giaDichVu || 0,
                insurancePrice: apiService.giaBHYT || 0,
                status: (apiService.tamNgung || apiService.trangThai === 0) ? 'inactive' : 'active',
                updatedBy: apiService.modifiedBy || apiService.createdBy || 'system',
                updatedAt: apiService.modifiedDate || apiService.createdDate || new Date().toISOString().split('T')[0],
                unit: apiService.donViTinh || 'Lần',
                minPrice: apiService.donGiaMin || 0,
                maxPrice: apiService.donGiaMax || 0,
                hasInsurance: apiService.bhyt || false,
                isPaused: apiService.tamNgung || false,
                createdBy: apiService.createdBy,
                createdDate: apiService.createdDate,
                modifiedBy: apiService.modifiedBy,
                modifiedDate: apiService.modifiedDate
            }));

            setServices(convertedServices);
            setPagination(prev => ({ ...prev, total: convertedServices.length }));

            // Update stats
            updateStats(convertedServices);

            addNotification('success', `Đã tải ${convertedServices.length} dịch vụ`);

        } catch (err) {
            console.error('❌ Error fetching services:', err);
            const errorMessage = `Không thể tải danh sách dịch vụ: ${err instanceof Error ? err.message : 'Unknown error'}`;
            setError(errorMessage);
            addNotification('error', errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const createService = useCallback(async (serviceData: ServiceFormData) => {
        try {
            setLoading(true);

            const payload = {
                maDichVu: serviceData.code || generateServiceCode(),
                tenDichVu: serviceData.name,
                tenKhongDau: serviceData.nameEn,
                tenNhomDichVu: serviceData.group,
                tenKhoa: serviceData.department,
                giaDichVu: serviceData.servicePrice,
                giaBHYT: serviceData.insurancePrice,
                trangThai: serviceData.status === 'active' ? 1 : 0,
                donViTinh: serviceData.unit,
                donGiaMin: serviceData.minPrice,
                donGiaMax: serviceData.maxPrice,
                bhyt: serviceData.hasInsurance,
                tamNgung: serviceData.isPaused
            };

            const response = await fetch('/api/DichVu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            addNotification('success', `Đã tạo dịch vụ "${serviceData.name}" thành công`);
            return result.data;

        } catch (err) {
            console.error('❌ Error creating service:', err);
            const errorMessage = `Không thể tạo dịch vụ: ${err instanceof Error ? err.message : 'Unknown error'}`;
            addNotification('error', errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateService = useCallback(async (serviceId: number, serviceData: ServiceFormData) => {
        try {
            setLoading(true);

            const payload = {
                maDichVu: serviceData.code,
                tenDichVu: serviceData.name,
                tenKhongDau: serviceData.nameEn,
                tenNhomDichVu: serviceData.group,
                tenKhoa: serviceData.department,
                giaDichVu: serviceData.servicePrice,
                giaBHYT: serviceData.insurancePrice,
                trangThai: serviceData.status === 'active' ? 1 : 0,
                donViTinh: serviceData.unit,
                donGiaMin: serviceData.minPrice,
                donGiaMax: serviceData.maxPrice,
                bhyt: serviceData.hasInsurance,
                tamNgung: serviceData.isPaused
            };

            const response = await fetch(`/api/DichVu/${serviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            addNotification('success', `Đã cập nhật dịch vụ "${serviceData.name}" thành công`);
            return result.data;

        } catch (err) {
            console.error('❌ Error updating service:', err);
            const errorMessage = `Không thể cập nhật dịch vụ: ${err instanceof Error ? err.message : 'Unknown error'}`;
            addNotification('error', errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteService = useCallback(async (serviceId: number, serviceName: string) => {
        try {
            setLoading(true);

            const response = await fetch(`/api/DichVu/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            addNotification('success', `Đã xóa dịch vụ "${serviceName}" thành công`);
            return result.data;

        } catch (err) {
            console.error('❌ Error deleting service:', err);
            const errorMessage = `Không thể xóa dịch vụ: ${err instanceof Error ? err.message : 'Unknown error'}`;
            addNotification('error', errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkUpdateServices = useCallback(async (serviceIds: number[], updates: any) => {
        try {
            setLoading(true);

            const response = await fetch('/api/DichVu/BulkUpdate', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    serviceIds,
                    ...updates
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            addNotification('success', `Đã cập nhật ${serviceIds.length} dịch vụ thành công`);
            return result.data;

        } catch (err) {
            console.error('❌ Error bulk updating services:', err);
            const errorMessage = `Không thể cập nhật hàng loạt: ${err instanceof Error ? err.message : 'Unknown error'}`;
            addNotification('error', errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkDeleteServices = useCallback(async (serviceIds: number[]) => {
        try {
            setLoading(true);

            const response = await fetch('/api/DichVu/BulkDelete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ serviceIds })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            addNotification('success', `Đã xóa ${serviceIds.length} dịch vụ thành công`);
            return result.data;

        } catch (err) {
            console.error('❌ Error bulk deleting services:', err);
            const errorMessage = `Không thể xóa hàng loạt: ${err instanceof Error ? err.message : 'Unknown error'}`;
            addNotification('error', errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const exportServices = useCallback(async (exportFilters: any) => {
        try {
            setExportLoading(true);

            const response = await fetch('/api/DichVu/Export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ filters: exportFilters })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `danh-muc-dich-vu-${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            addNotification('success', 'Xuất Excel thành công');

        } catch (err) {
            console.error('❌ Error exporting services:', err);
            const errorMessage = `Không thể xuất file Excel: ${err instanceof Error ? err.message : 'Unknown error'}`;
            addNotification('error', errorMessage);
            throw err;
        } finally {
            setExportLoading(false);
        }
    }, []);

    const importServices = useCallback(async (file: File) => {
        try {
            setImportLoading(true);

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/DichVu/Import', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            addNotification('success', `Import thành công: ${result.data?.importedCount || 0} dịch vụ`);
            return result.data;

        } catch (err) {
            console.error('❌ Error importing services:', err);
            const errorMessage = `Không thể import file: ${err instanceof Error ? err.message : 'Unknown error'}`;
            addNotification('error', errorMessage);
            throw err;
        } finally {
            setImportLoading(false);
        }
    }, []);

    // Effects
    useEffect(() => {
        fetchServicesFromAPI();
    }, [fetchServicesFromAPI]);

    useEffect(() => {
        const timer = setInterval(() => {
            setNotifications(prev => {
                const now = new Date();
                return prev.filter(notif =>
                    (now.getTime() - notif.timestamp.getTime()) < 5000
                );
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Memoized computations
    const filteredServices = useMemo(() => {
        let filtered = services;

        // Text search
        if (filters.search) {
            filtered = filtered.filter(service => {
                const searchTerm = filters.search.toLowerCase();
                const matchesCode = service.code.toLowerCase().includes(searchTerm);
                const matchesName = service.name.toLowerCase().includes(searchTerm);
                const matchesNameEn = service.nameEn.toLowerCase().includes(searchTerm);

                switch (filters.searchLanguage) {
                    case 'vi': return matchesCode || matchesName;
                    case 'en': return matchesCode || matchesNameEn;
                    default: return matchesCode || matchesName || matchesNameEn;
                }
            });
        }

        // Filters
        if (filters.group) filtered = filtered.filter(s => s.group === filters.group);
        if (filters.department) filtered = filtered.filter(s => s.department === filters.department);
        if (filters.status !== 'all') filtered = filtered.filter(s => s.status === filters.status);

        // Price range
        filtered = filtered.filter(s =>
            s.servicePrice >= filters.priceRange.min &&
            s.servicePrice <= filters.priceRange.max
        );

        // Date range
        if (filters.dateRange.from) {
            filtered = filtered.filter(s =>
                s.updatedAt >= filters.dateRange.from
            );
        }
        if (filters.dateRange.to) {
            filtered = filtered.filter(s =>
                s.updatedAt <= filters.dateRange.to
            );
        }

        return filtered;
    }, [services, filters]);

    const paginatedServices = useMemo(() => {
        const startIndex = (pagination.page - 1) * pagination.pageSize;
        return filteredServices.slice(startIndex, startIndex + pagination.pageSize);
    }, [filteredServices, pagination.page, pagination.pageSize]);

    const serviceGroups = useMemo(() =>
            [...new Set(services.map(s => s.group))].filter(Boolean).sort(),
        [services]
    );

    const departments = useMemo(() =>
            [...new Set(services.map(s => s.department))].filter(Boolean).sort(),
        [services]
    );

    const totalPages = Math.ceil(filteredServices.length / pagination.pageSize);

    // Helper functions
    const updateStats = useCallback((servicesList: Service[]) => {
        setStats({
            total: servicesList.length,
            active: servicesList.filter(s => s.status === 'active').length,
            inactive: servicesList.filter(s => s.status === 'inactive').length,
            withInsurance: servicesList.filter(s => s.hasInsurance).length
        });
    }, []);

    const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    const handlePriceRangeChange = useCallback((min: number, max: number) => {
        setFilters(prev => ({
            ...prev,
            priceRange: { min, max }
        }));
    }, []);

    const handleDateRangeChange = useCallback((from: string, to: string) => {
        setFilters(prev => ({
            ...prev,
            dateRange: { from, to }
        }));
    }, []);

    const handleAdvancedSearch = useCallback(() => {
        const searchParams: SearchParams = {};

        if (filters.search) searchParams.keyword = filters.search;
        if (filters.group) {
            const groupId = serviceGroups.findIndex(g => g === filters.group) + 1;
            if (groupId > 0) searchParams.groupId = groupId;
        }
        if (filters.department) {
            const departmentId = departments.findIndex(d => d === filters.department) + 1;
            if (departmentId > 0) searchParams.departmentId = departmentId;
        }
        if (filters.status !== 'all') {
            searchParams.status = filters.status === 'active' ? 1 : 0;
        }
        if (filters.priceRange.min > 0) searchParams.minPrice = filters.priceRange.min;
        if (filters.priceRange.max < 10000000) searchParams.maxPrice = filters.priceRange.max;
        if (filters.dateRange.from) searchParams.fromDate = filters.dateRange.from;
        if (filters.dateRange.to) searchParams.toDate = filters.dateRange.to;

        searchParams.page = pagination.page;
        searchParams.pageSize = pagination.pageSize;

        fetchServicesFromAPI(searchParams);
    }, [filters, pagination, serviceGroups, departments, fetchServicesFromAPI]);

    const handleResetFilters = useCallback(() => {
        setFilters({
            search: '',
            group: '',
            department: '',
            searchLanguage: 'both',
            status: 'all',
            priceRange: { min: 0, max: 10000000 },
            dateRange: { from: '', to: '' }
        });
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchServicesFromAPI();
    }, [fetchServicesFromAPI]);

    // Bulk actions
    const handleBulkSelect = useCallback((serviceId: number, checked: boolean) => {
        setBulkActions(prev => ({
            selectedIds: checked
                ? [...prev.selectedIds, serviceId]
                : prev.selectedIds.filter(id => id !== serviceId),
            isSelectAll: checked && prev.selectedIds.length + 1 === filteredServices.length
        }));
    }, [filteredServices.length]);

    const handleSelectAll = useCallback((checked: boolean) => {
        setBulkActions({
            selectedIds: checked ? filteredServices.map(s => s.id) : [],
            isSelectAll: checked
        });
    }, [filteredServices]);

    const handleBulkStatusChange = useCallback(async (newStatus: 'active' | 'inactive') => {
        if (bulkActions.selectedIds.length === 0) return;

        try {
            await bulkUpdateServices(bulkActions.selectedIds, {
                status: newStatus === 'active' ? 1 : 0
            });

            // Update local state
            setServices(prev => prev.map(service =>
                bulkActions.selectedIds.includes(service.id)
                    ? { ...service, status: newStatus }
                    : service
            ));

            setBulkActions({ selectedIds: [], isSelectAll: false });

        } catch (err) {
            // Error handled in bulkUpdateServices
        }
    }, [bulkActions.selectedIds, bulkUpdateServices]);

    const handleBulkDelete = useCallback(async () => {
        if (bulkActions.selectedIds.length === 0) return;

        if (!window.confirm(`Xóa ${bulkActions.selectedIds.length} dịch vụ?`)) return;

        try {
            await bulkDeleteServices(bulkActions.selectedIds);
            setServices(prev => prev.filter(s => !bulkActions.selectedIds.includes(s.id)));
            setBulkActions({ selectedIds: [], isSelectAll: false });

        } catch (err) {
            // Error handled in bulkDeleteServices
        }
    }, [bulkActions.selectedIds, bulkDeleteServices]);

    // CRUD handlers
    const handleCreate = useCallback(() => {
        setEditingService(null);
        setFormData({
            ...getDefaultFormData(),
            code: generateServiceCode()
        });
        setShowForm(true);
    }, []);

    const handleEdit = useCallback((service: Service) => {
        setEditingService(service);
        setFormData({
            code: service.code,
            name: service.name,
            nameEn: service.nameEn,
            group: service.group,
            department: service.department,
            servicePrice: service.servicePrice,
            insurancePrice: service.insurancePrice,
            status: service.status,
            unit: service.unit,
            minPrice: service.minPrice,
            maxPrice: service.maxPrice,
            hasInsurance: service.hasInsurance,
            isPaused: service.isPaused
        });
        setShowForm(true);
    }, []);

    const handleDelete = useCallback(async (service: Service) => {
        if (!window.confirm(`Xóa dịch vụ "${service.name}"?`)) return;

        try {
            await deleteService(service.id, service.name);
            setServices(prev => prev.filter(s => s.id !== service.id));
        } catch (err) {
            // Error handled in deleteService
        }
    }, [deleteService]);

    const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let result;
            if (editingService) {
                result = await updateService(editingService.id, formData);
                setServices(prev => prev.map(s =>
                    s.id === editingService.id
                        ? { ...s, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
                        : s
                ));
            } else {
                result = await createService(formData);
                const newService: Service = {
                    id: result.dichVu_Id || Date.now(),
                    ...formData,
                    updatedBy: 'current_user',
                    updatedAt: new Date().toISOString().split('T')[0],
                    createdBy: 'current_user',
                    createdDate: new Date().toISOString().split('T')[0]
                };
                setServices(prev => [...prev, newService]);
            }

            setShowForm(false);
            setEditingService(null);

        } catch (err) {
            // Error handled in create/update functions
        }
    }, [editingService, formData, createService, updateService]);

    const handleViewDetail = useCallback((service: Service) => {
        setSelectedService(service);
        setShowDetail(true);
    }, []);

    const handleRefresh = useCallback(() => {
        fetchServicesFromAPI();
    }, [fetchServicesFromAPI]);

    // Export/Import
    const handleExportExcel = useCallback(async () => {
        try {
            await exportServices(filters);
        } catch (err) {
            // Error handled in exportServices
        }
    }, [filters, exportServices]);

    const handleImportExcel = useCallback(async (file: File) => {
        try {
            await importServices(file);
            fetchServicesFromAPI();
        } catch (err) {
            // Error handled in importServices
        }
    }, [importServices, fetchServicesFromAPI]);

    // Quick actions
    const handleQuickCreate = useCallback(() => {
        setFormData({
            ...getDefaultFormData(),
            code: generateServiceCode(),
            name: 'Dịch vụ mới',
            nameEn: 'New service',
            servicePrice: 100000,
            minPrice: 100000,
            maxPrice: 100000
        });
        setShowForm(true);
    }, []);

    const handleDuplicate = useCallback((service: Service) => {
        setFormData({
            code: generateServiceCode(),
            name: `${service.name} (Bản sao)`,
            nameEn: `${service.nameEn} (Copy)`,
            group: service.group,
            department: service.department,
            servicePrice: service.servicePrice,
            insurancePrice: service.insurancePrice,
            status: service.status,
            unit: service.unit,
            minPrice: service.minPrice,
            maxPrice: service.maxPrice,
            hasInsurance: service.hasInsurance,
            isPaused: service.isPaused
        });
        setShowForm(true);
    }, []);

    // Render
    if (loading && services.length === 0) {
        return (
            <div className="service-catalog">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Đang tải danh sách dịch vụ...</p>
                    <div className="debug-info">{debugInfo}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="service-catalog">
            {/* Notifications */}
            <NotificationPanel
                notifications={notifications}
                onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
            />

            {/* Header */}
            <div className="catalog-header">
                <div className="header-top">
                    <div className="header-title">
                        <h1>Danh Mục Dịch Vụ</h1>
                        <div className="stats-overview">
                            <div className="stat-item">
                                <span className="stat-number">{stats.total}</span>
                                <span className="stat-label">Tổng số</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number active">{stats.active}</span>
                                <span className="stat-label">Đang HĐ</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number inactive">{stats.inactive}</span>
                                <span className="stat-label">Ngừng HĐ</span>
                            </div>

                        </div>
                    </div>

                    <div className="header-actions">
                        {/* Bulk Actions */}
                        {bulkActions.selectedIds.length > 0 && (
                            <div className="bulk-actions">
                                <span className="bulk-count">
                                    Đã chọn: {bulkActions.selectedIds.length}
                                </span>
                                <button
                                    className="btn success"
                                    onClick={() => handleBulkStatusChange('active')}
                                >
                                    Kích hoạt
                                </button>
                                <button
                                    className="btn warning"
                                    onClick={() => handleBulkStatusChange('inactive')}
                                >
                                    Ngừng HĐ
                                </button>
                                <button
                                    className="btn danger"
                                    onClick={handleBulkDelete}
                                >
                                    Xóa
                                </button>
                            </div>
                        )}

                        <div className="action-group">
                            <button className="btn primary" onClick={handleQuickCreate}>
                                <span className="btn-icon">⚡</span>
                                Tạo nhanh
                            </button>
                            <button className="btn primary" onClick={handleCreate}>
                                <span className="btn-icon">➕</span>
                                Thêm mới
                            </button>
                            <button className="btn secondary" onClick={handleRefresh}>
                                <span className="btn-icon">🔄</span>
                                Làm mới
                            </button>
                        </div>

                        <div className="api-info">
                            <span className="api-status">📡 API CRUD</span>
                            <span className="item-count">{services.length.toLocaleString()} dịch vụ</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <div className="basic-filters">
                        <div className="search-container">
                            <div className="search-box">

                                <input
                                    type="text"
                                    placeholder="Tìm theo mã, tên dịch vụ..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="search-input"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAdvancedSearch()}
                                />
                                {filters.search && (
                                    <button
                                        className="clear-search"
                                        onClick={() => handleFilterChange('search', '')}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <select
                                value={filters.searchLanguage}
                                onChange={(e) => handleFilterChange('searchLanguage', e.target.value)}
                                className="language-select"
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
                            <option value="">Tất cả nhóm</option>
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

                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="inactive">Ngừng hoạt động</option>
                        </select>

                        <button
                            className={`btn secondary ${showAdvancedFilters ? 'active' : ''}`}
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        >
                            <span className="btn-icon">⚙️</span>
                            Lọc nâng cao
                        </button>
                    </div>

                    {/* Advanced Filters */}
                    {showAdvancedFilters && (
                        <div className="advanced-filters">
                            <div className="filter-row">
                                <div className="filter-group">
                                    <label>Khoảng giá:</label>
                                    <PriceRangeFilter
                                        min={filters.priceRange.min}
                                        max={filters.priceRange.max}
                                        onChange={handlePriceRangeChange}
                                    />
                                </div>

                                <div className="filter-group">
                                    <label>Ngày cập nhật:</label>
                                    <DateRangeFilter
                                        from={filters.dateRange.from}
                                        to={filters.dateRange.to}
                                        onChange={handleDateRangeChange}
                                    />
                                </div>
                            </div>

                            <div className="filter-actions">
                                <button className="btn primary" onClick={handleAdvancedSearch}>
                                    Áp dụng bộ lọc
                                </button>
                                <button className="btn secondary" onClick={handleResetFilters}>
                                    Đặt lại
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Filter Summary */}
                    {(filters.search || filters.group || filters.department || filters.status !== 'all' ||
                        filters.priceRange.min > 0 || filters.priceRange.max < 10000000 ||
                        filters.dateRange.from || filters.dateRange.to) && (
                        <div className="filter-summary">
                            <span className="filtered-count">
                                Đang hiển thị {filteredServices.length.toLocaleString()} trên {services.length.toLocaleString()} dịch vụ
                            </span>
                            <button className="btn-link" onClick={handleResetFilters}>
                                Xóa tất cả bộ lọc
                            </button>
                        </div>
                    )}
                </div>

                {/* Toolbar */}
                <div className="toolbar">
                    <div className="toolbar-left">
                        <button
                            className="btn secondary"
                            onClick={handleExportExcel}
                            disabled={exportLoading}
                        >
                            <span className="btn-icon">📤</span>
                            {exportLoading ? 'Đang xuất...' : 'Export Excel'}
                        </button>

                        <FileUpload
                            onFileSelect={handleImportExcel}
                            accept=".xlsx,.xls"
                            label="Import Excel"
                            loading={importLoading}
                        />
                    </div>

                    <div className="toolbar-right">
                        <div className="view-options">
                            <span>Hiển thị:</span>
                            <select
                                value={pagination.pageSize}
                                onChange={(e) => setPagination(prev => ({
                                    ...prev,
                                    pageSize: parseInt(e.target.value),
                                    page: 1
                                }))}
                                className="page-size-select"
                            >
                                <option value={10}>10 dòng</option>
                                <option value={20}>20 dòng</option>
                                <option value={50}>50 dòng</option>
                                <option value={100}>100 dòng</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="catalog-content">
                {/* Loading Overlay */}
                {loading && services.length > 0 && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                    </div>
                )}

                {/* Services Table */}
                <div className="table-container">
                    <ServicesTable
                        services={paginatedServices}
                        selectedIds={bulkActions.selectedIds}
                        onBulkSelect={handleBulkSelect}
                        onSelectAll={handleSelectAll}
                        onViewDetail={handleViewDetail}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onDuplicate={handleDuplicate}
                        isSelectAll={bulkActions.isSelectAll}
                    />
                </div>

                {/* Pagination */}
                {services.length > 0 && (
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={totalPages}
                        totalItems={filteredServices.length}
                        pageSize={pagination.pageSize}
                        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                    />
                )}
            </div>

            {/* Modals */}
            {showDetail && (
                <ServiceDetail
                    service={selectedService}
                    onClose={() => setShowDetail(false)}
                    onEdit={handleEdit}
                />
            )}

            {showForm && (
                <ServiceForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleFormSubmit}
                    onClose={() => {
                        setShowForm(false);
                        setEditingService(null);
                    }}
                    editingService={editingService}
                    serviceGroups={serviceGroups}
                    departments={departments}
                />
            )}
        </div>
    );
}

// Sub-components
function NotificationPanel({ notifications, onRemove }: {
    notifications: Notification[];
    onRemove: (id: string) => void;
}) {
    if (notifications.length === 0) return null;

    return (
        <div className="notification-panel">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`notification ${notification.type}`}
                >
                    <div className="notification-content">
                        <span className="notification-message">
                            {notification.message}
                        </span>
                        <button
                            className="notification-close"
                            onClick={() => onRemove(notification.id)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function PriceRangeFilter({ min, max, onChange }: {
    min: number;
    max: number;
    onChange: (min: number, max: number) => void;
}) {
    const [localMin, setLocalMin] = useState(min);
    const [localMax, setLocalMax] = useState(max);

    const handleApply = () => {
        onChange(localMin, localMax);
    };

    const handleReset = () => {
        setLocalMin(0);
        setLocalMax(10000000);
        onChange(0, 10000000);
    };

    return (
        <div className="price-range-filter">
            <div className="price-inputs">
                <input
                    type="number"
                    value={localMin}
                    onChange={(e) => setLocalMin(Number(e.target.value))}
                    placeholder="Từ"
                />
                <span>-</span>
                <input
                    type="number"
                    value={localMax}
                    onChange={(e) => setLocalMax(Number(e.target.value))}
                    placeholder="Đến"
                />
                <span>đ</span>
            </div>
            <button className="btn sm primary" onClick={handleApply}>
                Áp dụng
            </button>
            <button className="btn sm secondary" onClick={handleReset}>
                Đặt lại
            </button>
        </div>
    );
}

function DateRangeFilter({ from, to, onChange }: {
    from: string;
    to: string;
    onChange: (from: string, to: string) => void;
}) {
    const handleFromChange = (value: string) => {
        onChange(value, to);
    };

    const handleToChange = (value: string) => {
        onChange(from, value);
    };

    const handleReset = () => {
        onChange('', '');
    };

    return (
        <div className="date-range-filter">
            <input
                type="date"
                value={from}
                onChange={(e) => handleFromChange(e.target.value)}
            />
            <span>đến</span>
            <input
                type="date"
                value={to}
                onChange={(e) => handleToChange(e.target.value)}
            />
            <button className="btn sm secondary" onClick={handleReset}>
                ✕
            </button>
        </div>
    );
}

function ServicesTable({
                           services,
                           selectedIds,
                           onBulkSelect,
                           onSelectAll,
                           onViewDetail,
                           onEdit,
                           onDelete,
                           onDuplicate,
                           isSelectAll
                       }: {
    services: Service[];
    selectedIds: number[];
    onBulkSelect: (id: number, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onViewDetail: (service: Service) => void;
    onEdit: (service: Service) => void;
    onDelete: (service: Service) => void;
    onDuplicate: (service: Service) => void;
    isSelectAll: boolean;
}) {
    const tableHeaders = [
        { key: 'select', label: '', width: '40px' },
        { key: 'code', label: 'Mã DV', width: '100px' },
        { key: 'name', label: 'Tên dịch vụ (VN)', width: '200px' },
        { key: 'nameEn', label: 'Tên không dấu', width: '200px' },
        { key: 'group', label: 'Nhóm', width: '150px' },
        { key: 'department', label: 'Khoa', width: '150px' },
        { key: 'servicePrice', label: 'Giá DV', width: '120px' },
        { key: 'insurancePrice', label: 'Giá BH', width: '120px' },
        { key: 'status', label: 'Trạng thái', width: '130px' },
        { key: 'actions', label: 'Hành động', width: '140px' }
    ];

    if (services.length === 0) {
        return (
            <table className="services-table">
                <thead>
                <tr>
                    {tableHeaders.map(header => (
                        <th key={header.key} style={{ width: header.width }}>
                            {header.key === 'select' && (
                                <input
                                    type="checkbox"
                                    checked={false}
                                    onChange={() => {}}
                                    disabled
                                />
                            )}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan={tableHeaders.length} className="empty-state">
                        <div className="empty-content">
                            <div className="empty-icon">📋</div>
                            <div className="empty-text">Không có dữ liệu dịch vụ</div>
                            <div className="empty-subtext">Hãy thử thay đổi bộ lọc hoặc tạo dịch vụ mới</div>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        );
    }

    return (
        <table className="services-table">
            <thead>
            <tr>
                {tableHeaders.map(header => (
                    <th key={header.key} style={{ width: header.width }}>
                        {header.key === 'select' ? (
                            <input
                                type="checkbox"
                                checked={isSelectAll}
                                onChange={(e) => onSelectAll(e.target.checked)}
                            />
                        ) : (
                            header.label
                        )}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {services.map(service => (
                <tr
                    key={service.id}
                    className={selectedIds.includes(service.id) ? 'selected' : ''}
                >
                    <td>
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(service.id)}
                            onChange={(e) => onBulkSelect(service.id, e.target.checked)}
                        />
                    </td>
                    <td className="code-cell">
                        <span className="code-badge">{service.code}</span>
                    </td>
                    <td className="name-cell">
                        <div className="service-name">
                            {service.name}
                            {service.hasInsurance && (
                                <span className="insurance-badge" title="Có BHYT">🏥</span>
                            )}
                        </div>
                    </td>
                    <td className="name-en-cell">{service.nameEn}</td>
                    <td>
                        <span className="group-badge">{service.group}</span>
                    </td>
                    <td>{service.department}</td>
                    <td className="price-cell">
                        {service.servicePrice ? (
                            <span className="price">{service.servicePrice.toLocaleString()}đ</span>
                        ) : (
                            <span className="price-missing">—</span>
                        )}
                    </td>
                    <td className="price-cell">
                        {service.insurancePrice ? (
                            <span className="price insurance">{service.insurancePrice.toLocaleString()}đ</span>
                        ) : (
                            <span className="price-missing">—</span>
                        )}
                    </td>
                    <td>
                        <StatusBadge status={service.status} />
                    </td>
                    <td className="actions-cell">
                        <div className="action-buttons">
                            <button
                                className="btn-icon view-btn"
                                onClick={() => onViewDetail(service)}
                                title="Xem chi tiết"
                            >
                                👁️
                            </button>
                            <button
                                className="btn-icon edit-btn"
                                onClick={() => onEdit(service)}
                                title="Sửa dịch vụ"
                            >
                                ✏️
                            </button>
                            <button
                                className="btn-icon duplicate-btn"
                                onClick={() => onDuplicate(service)}
                                title="Nhân bản"
                            >
                                ⎘
                            </button>
                            <button
                                className="btn-icon delete-btn"
                                onClick={() => onDelete(service)}
                                title="Xóa dịch vụ"
                            >
                                🗑️
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
    return (
        <span className={`status-badge ${status}`}>
            {status === 'active' ? (
                <>
                    <span className="status-dot"></span>
                    Đang hoạt động
                </>
            ) : (
                <>
                    <span className="status-dot"></span>
                    Ngừng hoạt động
                </>
            )}
        </span>
    );
}

function Pagination({
                        currentPage,
                        totalPages,
                        totalItems,
                        pageSize,
                        onPageChange
                    }: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}) {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5;

        let start = Math.max(1, currentPage - Math.floor(showPages / 2));
        let end = Math.min(totalPages, start + showPages - 1);

        if (end - start + 1 < showPages) {
            start = Math.max(1, end - showPages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="pagination">
            <div className="pagination-info">
                Hiển thị {startItem.toLocaleString()}-{endItem.toLocaleString()} trên {totalItems.toLocaleString()} dịch vụ
            </div>

            <div className="pagination-controls">
                <button
                    className="page-btn first"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(1)}
                >
                    ≪
                </button>

                <button
                    className="page-btn prev"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    ‹
                </button>

                {getPageNumbers().map(page => (
                    <button
                        key={page}
                        className={`page-btn ${page === currentPage ? 'active' : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className="page-btn next"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    ›
                </button>

                <button
                    className="page-btn last"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(totalPages)}
                >
                    ≫
                </button>
            </div>
        </div>
    );
}

function FileUpload({ onFileSelect, accept, label, loading }: {
    onFileSelect: (file: File) => void;
    accept: string;
    label: string;
    loading?: boolean;
}) {
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div
            className={`file-upload ${dragOver ? 'drag-over' : ''} ${loading ? 'loading' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <span className="btn-icon">📥</span>
            {loading ? 'Đang import...' : label}
        </div>
    );
}

function ServiceDetail({ service, onClose, onEdit }: { service: Service | null, onClose: () => void, onEdit: (service: Service) => void }) {
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
                            <div className="detail-item">
                                <label>Đơn vị tính:</label>
                                <span>{service.unit}</span>
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
                            <div className="detail-item">
                                <label>Giá tối thiểu:</label>
                                <span className="price">{service.minPrice.toLocaleString()}đ</span>
                            </div>
                            <div className="detail-item">
                                <label>Giá tối đa:</label>
                                <span className="price">{service.maxPrice.toLocaleString()}đ</span>
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
                                <label>Có BHYT:</label>
                                <span>{service.hasInsurance ? 'Có' : 'Không'}</span>
                            </div>
                            <div className="detail-item">
                                <label>Tạm ngừng:</label>
                                <span>{service.isPaused ? 'Có' : 'Không'}</span>
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
                    <button className="btn secondary" onClick={() => onEdit(service)}>
                        ✏️ Sửa dịch vụ
                    </button>
                    <button className="btn primary" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

function ServiceForm({
                         formData,
                         setFormData,
                         onSubmit,
                         onClose,
                         editingService,
                         serviceGroups,
                         departments
                     }: {
    formData: ServiceFormData;
    setFormData: React.Dispatch<React.SetStateAction<ServiceFormData>>;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    editingService: Service | null;
    serviceGroups: string[];
    departments: string[];
}) {
    const handleChange = (field: keyof ServiceFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{editingService ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={onSubmit} className="service-form">
                    <div className="form-section">
                        <h3>Thông tin cơ bản</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="required">Mã dịch vụ</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => handleChange('code', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="required">Tên dịch vụ (VN)</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Tên không dấu (EN)</label>
                                <input
                                    type="text"
                                    value={formData.nameEn}
                                    onChange={(e) => handleChange('nameEn', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Nhóm dịch vụ</label>
                                <select
                                    value={formData.group}
                                    onChange={(e) => handleChange('group', e.target.value)}
                                >
                                    <option value="">Chọn nhóm dịch vụ</option>
                                    {serviceGroups.map(group => (
                                        <option key={group} value={group}>{group}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Khoa</label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => handleChange('department', e.target.value)}
                                >
                                    <option value="">Chọn khoa</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Đơn vị tính</label>
                                <input
                                    type="text"
                                    value={formData.unit}
                                    onChange={(e) => handleChange('unit', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Thông tin giá</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Giá dịch vụ</label>
                                <input
                                    type="number"
                                    value={formData.servicePrice}
                                    onChange={(e) => handleChange('servicePrice', parseFloat(e.target.value) || 0)}
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Giá BHYT</label>
                                <input
                                    type="number"
                                    value={formData.insurancePrice}
                                    onChange={(e) => handleChange('insurancePrice', parseFloat(e.target.value) || 0)}
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Giá tối thiểu</label>
                                <input
                                    type="number"
                                    value={formData.minPrice}
                                    onChange={(e) => handleChange('minPrice', parseFloat(e.target.value) || 0)}
                                    min="0"
                                />
                            </div>
                            <div className="form-group">
                                <label>Giá tối đa</label>
                                <input
                                    type="number"
                                    value={formData.maxPrice}
                                    onChange={(e) => handleChange('maxPrice', parseFloat(e.target.value) || 0)}
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Trạng thái</h3>
                        <div className="form-grid">
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.status === 'active'}
                                        onChange={(e) => handleChange('status', e.target.checked ? 'active' : 'inactive')}
                                    />
                                    Đang hoạt động
                                </label>
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.hasInsurance}
                                        onChange={(e) => handleChange('hasInsurance', e.target.checked)}
                                    />
                                    Có BHYT
                                </label>
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.isPaused}
                                        onChange={(e) => handleChange('isPaused', e.target.checked)}
                                    />
                                    Tạm ngừng
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn primary">
                            {editingService ? 'Cập nhật' : 'Tạo mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ServiceCatalogForm;