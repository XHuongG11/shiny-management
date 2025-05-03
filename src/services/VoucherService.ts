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

export async function apiGetProducts<T>(page: number, size: number, title: string) {
    return ApiService.fetchData<T>({
        url: '/products/search-and-filter',
        method: 'get',
        params : { page, size, title },
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

export async function apiGetCustomers<T>(page: number, size: number) {
    return ApiService.fetchData<T>({
        url: '/users/customers',
        method: 'get',
        params: { page, size },
    })
}