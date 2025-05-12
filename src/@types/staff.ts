export type Staff = {
    id?: number;
    fullName: string;
    email: string;
    phone: string;
    username: string;
    password?: string;
    gender: string;
    role?: string;
    status?: string;
    dob: string; // Ngày sinh
    joinAt?: string; // Ngày tham gia
};

export type StaffListResponse = {
    code: string;
    message: string;
    data: {
        content: Staff[];
        pageable: {
            pageNumber: number;
            pageSize: number;
            sort: {
                empty: boolean;
                sorted: boolean;
                unsorted: boolean;
            };
            offset: number;
            paged: boolean;
            unpaged: boolean;
        };
        totalElements: number;
        totalPages: number;
        last: boolean;
        size: number;
        number: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        first: boolean;
        numberOfElements: number;
        empty: boolean;
    };
};