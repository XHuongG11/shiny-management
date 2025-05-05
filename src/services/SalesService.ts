import ApiService from './ApiService'

export async function apiGetTotalRevenue<T extends Record<string, unknown>>({
    month,
    year,
}: {
    month: number
    year: number
}) {
    return ApiService.fetchData<T>({
        url: '/dashboard/revenue',
        method: 'get',
        params: {
            month,
            year,
        },
    })
}
export async function apiGetTotalOrders<T extends Record<string, unknown>>({
    month,
    year,
}: {
    month: number
    year: number
}) {
    return ApiService.fetchData<T>({
        url: '/dashboard/total-orders',
        method: 'get',
        params: {
            month,
            year,
        },
    })
}
export async function apiGetNewCustomers<T extends Record<string, unknown>>({
    month,
    year,
}: {
    month: number
    year: number
}) {
    return ApiService.fetchData<T>({
        url: '/dashboard/new-customers',
        method: 'get',
        params: {
            month,
            year,
        },
    })
}
export async function apiGetTotalReturnOrders<
    T extends Record<string, unknown>,
>({ month, year }: { month: number; year: number }) {
    return ApiService.fetchData<T>({
        url: '/dashboard/total-return-orders',
        method: 'get',
        params: {
            month,
            year,
        },
    })
}

export async function apiGetTopSellingProduct<
    T extends Record<string, unknown>,
>({ month, year, limit }: { month: number; year: number; limit?: number }) {
    return ApiService.fetchData<T>({
        url: '/dashboard/top-selling-products',
        method: 'get',
        params: {
            month,
            year,
            limit,
        },
    })
}

export async function apiGetLatestOrders<T extends Record<string, unknown>>({
    month,
    year,
    limit,
}: {
    month: number
    year: number
    limit?: number
}) {
    return ApiService.fetchData<T>({
        url: '/dashboard/latest-orders',
        method: 'get',
        params: {
            month,
            year,
            limit,
        },
    })
}

export async function apiGetProductSoldByCategory<
    T extends Record<string, unknown>,
>({ month, year }: { month: number; year: number }) {
    return ApiService.fetchData<T>({
        url: '/dashboard/product-sold-by-category',
        method: 'get',
        params: {
            month,
            year,
        },
    })
}
export async function apigetMonthlyRevenue<T extends Record<string, unknown>>({
    year,
}: {
    year: number
}) {
    return ApiService.fetchData<T>({
        url: '/dashboard/monthly-revenue',
        method: 'get',
        params: {
            year,
        },
    })
}
export async function apiGetRevenueByCategory<
    T extends Record<string, unknown>,
>({ year }: { year: number }) {
    return ApiService.fetchData<T>({
        url: '/dashboard/revenue-by-category',
        method: 'get',
        params: {
            year,
        },
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
    params: {
        status?: string;
        query?: string;
        page?: number;
        size?: number;
    }
) {
    return ApiService.fetchData<T>({
        url: '/orders/all',
        method: 'get',
        params,
    })
}

export async function getOrderById<T>(id: string) {
    return ApiService.fetchData<T>({
        url: `/orders/${id}`,
        method: 'get',
    })
}
export async function updateOrderStatusById<T>(id: string, status: string) {
    return ApiService.fetchData<T>({
        url: `/orders/${id}/status?status=${status}`,
        method: 'put',
    })
}

export async function apiDeleteSalesOrders<
    T,
    U extends Record<string, unknown>,
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/orders/delete',
        method: 'delete',
        data,
    })
}

export async function apiGetSalesOrderDetails<
    T,
    U extends Record<string, unknown>,
>(params: U) {
    return ApiService.fetchData<T>({
        url: '/orders',
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

export async function apiGetAllCategories<T extends Record<string, unknown>>() {
    return ApiService.fetchData<T>({
        url: '/categories/all',
        method: 'get',
    })
}

export async function apiGetAllCollections<
    T extends Record<string, unknown>,
>() {
    return ApiService.fetchData<T>({
        url: '/collections/all',
        method: 'get',
    })
}
export async function apiCreateCollection<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchData<T>({
        url: '/collections/add',
        method: 'post',
        data,
    })
}
export async function apiUpdateCollection<T, U extends Record<string, unknown>>(
    id: number,
    data: U,
) {
    return ApiService.fetchData<T>({
        url: `/collections/collection/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteCollection<T>(id: number) {
    return ApiService.fetchData<T>({
        url: `/collections/collection/${id}`,
        method: 'delete',
    })
}

export async function apiCreateCategory<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchData<T>({
        url: '/categories/add',
        method: 'post',
        data,
    })
}
export async function apiUpdateCategory<T, U extends Record<string, unknown>>(
    id: number,
    data: U,
) {
    return ApiService.fetchData<T>({
        url: `/categories/category/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteCategory<T>(id: number) {
    return ApiService.fetchData<T>({
        url: `/categories/category/${id}`,
        method: 'delete',
    })
}
