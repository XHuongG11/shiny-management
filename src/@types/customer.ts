export enum EUserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface Customer {
    id: number
    fullName: string
    email: string
    phone?: string
    username?: string
    dob?: string | null
    gender?: 'MALE' | 'FEMALE' | 'OTHER'
    status: EUserStatus
    membershipRank?: string
    totalSpent?: number
    isSubscribedForNews?: boolean
    role?: string
}

export interface CustomerListResponse {
    code: string
    message: string
    data: {
        content: Customer[]
        totalPages: number
        totalElements: number
        number: number
    }
}