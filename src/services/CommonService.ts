import ApiService from './ApiService'

export async function apiGetNotificationCount<T extends Record<string, unknown>>() {
    return ApiService.fetchData<T>({
        url: '/notifications/unread-count',
        method: 'get',
    })
}

export async function apiGetNotificationList() {
    return ApiService.fetchData<{
        code: string
        message: string
        data: {
            content: {
                id: number
                title: string
                content: string
                status: string
                sentAt: string
            }[]
            pageable: {
                pageNumber: number
                pageSize: number
                sort: {
                    empty: boolean
                    unsorted: boolean
                    sorted: boolean
                }
                offset: number
                unpaged: boolean
                paged: boolean
            }
            last: boolean
            totalElements: number
            totalPages: number
            first: boolean
            size: number
            number: number
            sort: {
                empty: boolean
                unsorted: boolean
                sorted: boolean
            }
            numberOfElements: number
            empty: boolean
        }
    }>({
        url: '/notifications/all',
        method: 'get',
    })
}

export async function apiMarkNotificationAsRead(id: number) {
    return ApiService.fetchData({
        url: `/notifications/mark-as-read/${id}`,
        method: 'put',
    })
}

export async function apiMarkAllNotificationsAsRead() {
    return ApiService.fetchData({
        url: '/notifications/mark-as-read-all',
        method: 'put',
    })
}

export async function apiDeleteNotification(id: number) {
    return ApiService.fetchData({
        url: `/notifications/delete/${id}`,
        method: 'delete',
    })
}

export async function apiDeleteAllNotifications() {
    return ApiService.fetchData({
        url: '/notifications/delete-all',
        method: 'delete',
    })
}

export async function apiGetSearchResult<T>(data: { query: string }) {
    return ApiService.fetchData<T>({
        url: '/search/query',
        method: 'post',
        data,
    })
}
