export type Customer = {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    username: string;
    joinAt: string;
    dob: string;
    gender: string;
    status: string;
    membershipRank: string;
    totalSpent: number;
    isSubscribedForNews: boolean;
}

export type CustomerListResponse = {
    code: string;
    message: string;
    data: {
        content: Customer[];
        totalPages: number;
        totalElements: number;
        number: number;
    }
}