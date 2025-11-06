import { api } from './httpClient'


export type DichVu = {
    dichVu_Id: number
    nhomDichVu_Id: number
    maDichVu: string
    tenDichVu: string
    tenKhongDau?: string
}


export type ServiceVM = {
    id: number
    groupId: number
    code: string
    name: string
    nameUnaccent?: string
}


export function mapDichVuToService(x: DichVu): ServiceVM {
    return {
        id: x.dichVu_Id,
        groupId: x.nhomDichVu_Id,
        code: x.maDichVu,
        name: x.tenDichVu,
        nameUnaccent: x.tenKhongDau
    }
}


export async function fetchServices(): Promise<ServiceVM[]> {
    const data = await api.get<DichVu[]>('/api/DichVu')
    return data.map(mapDichVuToService)
}


export async function searchServices(keyword: string): Promise<ServiceVM[]> {
    const kw = keyword.trim().toLowerCase()
    const items = await fetchServices()
    if (!kw) return items
    return items.filter(x =>
        x.code.toLowerCase().includes(kw) ||
        x.name.toLowerCase().includes(kw) ||
        (x.nameUnaccent || '').toLowerCase().includes(kw)
    )
}
