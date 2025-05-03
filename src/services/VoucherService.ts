import { Voucher, VoucherListResponse } from '@/@types/voucher'
import ApiService from './ApiService'

export async function apiGetAllVouchers<T>(data: { page: number; size: number }) {
    return ApiService.fetchData<T>({
        url: '/vouchers/all',
        method: 'get',
        params: data,
    })
}

export async function apiSearchVouchers<T>(data: { page: number; size: number; query: string }) {
    return ApiService.fetchData<T>({
        url: `/vouchers/search`,
        method: 'get',
        params: data,
    })
}

export async function apiAddVoucher<T>(data: Voucher) {
    return ApiService.fetchData<T>({
        url: '/vouchers/add',
        method: 'post',
        data,
    })
}

export async function apiUpdateVoucher<T>(id: number, data: Voucher) {
    return ApiService.fetchData<T>({
        url: `/vouchers/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteVoucher<T>(id: number) {
    return ApiService.fetchData<T>({
        url: `/vouchers/${id}`,
        method: 'delete',
    })
}

export async function apiGetProducts<T>() {
    return ApiService.fetchData<T>({
        url: '/products/all',
        method: 'get',
        params: { page: 1, size: 100 },
    })
}

export async function apiGetCategories<T>() {
    return ApiService.fetchData<T>({
        url: '/categories/all',
        method: 'get',
    })
}

export async function apiGetCollections<T>() {
    return ApiService.fetchData<T>({
        url: '/collections/all',
        method: 'get',
    })
}

export async function apiGetCustomers<T>() {
    return ApiService.fetchData<T>({
        url: '/customers/all',
        method: 'get',
        params: { page: 1, size: 100 },
    })
}