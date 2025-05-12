import ApiService from './ApiService'

export async function apiGetAllCustomers<T extends Record<string, unknown>>(
    { page = 1, size = 10 }: { page?: number; size?: number }
) {
    return ApiService.fetchData<T>({
        url: '/users/customers',
        method: 'get',
        params: {
            page,
            size,
        },
    })
}


export async function apiDeactivateCustomer<T>(id: number) {
    return ApiService.fetchData<T>({
        url: `/users/deactivate-customer/${id}`,
        method: 'put',
    })
}

export async function apiActivateCustomer<T>(id: number) {
    return ApiService.fetchData<T>({
        url: `/users/activate-customer/${id}`,
        method: 'put',
    })
}

export async function apiSearchCustomers<T extends Record<string, unknown>>(
    { name, page = 1, size = 15 }: { name: string; page?: number; size?: number }
) {
    return ApiService.fetchData<T>({
        url: '/users/search-customers',
        method: 'get',
        params: {
            name,
            page,
            size,
        },
    })
}


