import { Voucher, VoucherListResponse } from '@/@types/voucher'
import ApiService from './ApiService'
import { ApiResponse } from '@/@types/auth'

export async function apiGetAllVouchers<T>(data: { page: number; size: number }) {
    return ApiService.fetchData<T>({
        url: '/vouchers/all',
        method: 'get',
        params: data,
    })
}

export async function apiGetVoucher<T>(id: number) {
    return ApiService.fetchData<T>({
        url: `/vouchers/${id}`,
        method: 'get',
    })
}

export async function apiSearchVouchers<T>(data: { page: number; size: number; query: string }) {
    return ApiService.fetchData<T>({
        url: `/vouchers/search`,
        method: 'get',
        params: data,
    })
}

export async function apiAddVoucher<ApiResponse>(data: Voucher) {
    return ApiService.fetchData<ApiResponse>({
        url: '/vouchers/add',
        method: 'post',
        data,
    })
}

export async function apiUpdateVoucher<ApiResponse>(id: number, data: Voucher) {
    return ApiService.fetchData<ApiResponse>({
        url: `/vouchers/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteVoucher<ApiResponse>(id: number) {
    return ApiService.fetchData<ApiResponse>({
        url: `/vouchers/${id}`,
        method: 'delete',
    })
}

export async function apiGetProducts<T>(title: string) {
    return ApiService.fetchData<T>({
        url: '/products/search-and-filter',
        method: 'get',
        params : { page : 1, size : 10, title },
    })
}

export async function apiGetCategories<T>(name : string) {
    return ApiService.fetchData<T>({
        url: '/categories/category',
        method: 'get',
        params: { name : name },
    })
}

export async function apiGetCollections<T>(name : string) {
    return ApiService.fetchData<T>({
        url: '/collections/collection',
        method: 'get',
        params: { name : name },
    })
}

export async function apiGetCustomers<T>(name: string) {
    return ApiService.fetchData<T>({
        url: '/users/search-customers',
        method: 'get',
        params: { page : 1, size : 10, name : name },
    })
}