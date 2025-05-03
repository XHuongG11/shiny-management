export type ReviewData = {
    id: number
    content: string
    rating: number
    product: {
        id: number
        title: string
        images: {
            id: number
            name: string
            url: string
        }[]
    }
    reviewer: {
        id: number
        username: string
        email: string
        phone: string
        fullName: string
    }
    createdAt: string
    response: string | null
}

export type ReviewListResponse = {
    code: string
    message: string
    data: {
        content: ReviewData[]
        pageable: {
            pageNumber: number
            pageSize: number
            sort: {
                sorted: boolean
                unsorted: boolean
                empty: boolean
            }
            offset: number
            paged: boolean
            unpaged: boolean
        }
        totalElements: number
        totalPages: number
        last: boolean
        size: number
        number: number
        sort: {
            sorted: boolean
            unsorted: boolean
            empty: boolean
        }
        first: boolean
        numberOfElements: number
        empty: boolean
    }
}