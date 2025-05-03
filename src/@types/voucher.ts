export type VoucherApplicability = {
    id?: number
    type: 'ALL' | 'PRODUCT' | 'CATEGORY' | 'COLLECTION' | 'CUSTOMER'
    applicableObjectId: number | null
}

export type VoucherType = 'PROMOTION' | 'FREESHIP'

export type Voucher = {
    id?: number
    code: string
    name: string
    discountRate: number
    minimumToApply: number
    applyLimit: number
    validFrom: string
    validTo: string
    quantity: number
    limitUsePerCustomer: number
    type: VoucherType
    applicabilities: VoucherApplicability[]
}

export type VoucherListResponse = {
    code: string
    message: string
    data: {
        content: Voucher[]
        pageable: {
            pageNumber: number
            pageSize: number
            sort: {
                empty: boolean
                sorted: boolean
                unsorted: boolean
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
            empty: boolean
            sorted: boolean
            unsorted: boolean
        }
        first: boolean
        numberOfElements: number
        empty: boolean
    }
}