export type Gender = 'M' | 'F';
export type Role = 'ADMIN' | 'MANAGER' | 'STAFF';
export type Status = 'active' | 'inactive';

export type Staff = {
    id?: number;
    fullName: string;
    email: string;
    phone: string;
    username: string;
    password?: string;
    gender: Gender;
    role: Role;
    status: Status;
    dob: string; // Ngày sinh
    joinAt: string; // Ngày tham gia
    avatar?: string; // URL ảnh đại diện
    backupToken?: string; // Token dự phòng
    backupTokenExpireAt?: string; // Thời gian hết hạn token dự phòng
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