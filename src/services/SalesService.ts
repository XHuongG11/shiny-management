import ApiService from './ApiService'

export async function apiGetSalesDashboardData<
    T extends Record<string, unknown>,
>() {
    return ApiService.fetchData<T>({
        url: '/sales/dashboard',
        method: 'post',
    })
}

export async function apiGetAllProducts<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchData<T>({
        url: '/products/search-and-filter',
        method: 'get',
        params,
    })
}

export async function apiDeleteProduct<T>(id: number) {
    return ApiService.fetchData<T>({
        url: `/products/product/${id}`,
        method: 'delete',
    })
}

export async function getProductById<T>(id: number) {
    return ApiService.fetchData<T>({
        url: `/products/${id}`,
        method: 'get',
    })
}

export async function apiUpdateProduct<T, U extends Record<string, unknown>>(
    id: number,
    data: U,
) {
    return ApiService.fetchData<T>({
        url: `/products/product/${id}`,
        method: 'put',
        data,
    })
}

export async function apiCreateProduct<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchData<T>({
        url: '/products/add',
        method: 'post',
        data,
    })
}

export async function apiGetSalesOrders<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchData<T>({
        url: '/sales/orders',
        method: 'get',
        params,
    })
}

export async function apiDeleteSalesOrders<
    T,
    U extends Record<string, unknown>,
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/sales/orders/delete',
        method: 'delete',
        data,
    })
}

export async function apiGetSalesOrderDetails<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchData<T>({
        url: '/sales/orders-details',
        method: 'get',
        params,
    })
}

export async function apiGetCategories<T extends Record<string, unknown>>() {
    return ApiService.fetchData<T>({
        url: '/categories/all',
        method: 'get',
        authRequired: false,
    })
}

export async function apiGetCollections<T extends Record<string, unknown>>() {
    return ApiService.fetchData<T>({
        url: '/collections/all',
        method: 'get',
        authRequired: false,
    })
}

export async function apiAddProductImage(data: FormData) {
    return ApiService.fetchData({
        url: '/images/upload',
        method: 'post',
        data,
    })
}
export async function apiUpdateProductImage(id: number, data: FormData) {
    return ApiService.fetchData({
        url: `/images/${id}`,
        method: 'put',
        data,
    })
}
export async function apiDeleteImageProduct(id: number) {
    return ApiService.fetchData({
        url: `/images/${id}`,
        method: 'delete',
    })
}
