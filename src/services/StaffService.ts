import ApiService from './ApiService';
import { Staff } from '@/@types/staff';
import { ApiResponse } from '@/@types/auth';

// Lấy danh sách nhân viên với phân trang
export async function apiGetAllStaffs<T>(data: { page: number; size: number }) {
    return ApiService.fetchData<T>({
        url: '/users/staffs',
        method: 'get',
        params: data,
    });
}

// Lấy thông tin chi tiết của một nhân viên theo ID
export async function apiGetStaffById<T>(id: number) {
    return ApiService.fetchData<T>({
        url: `/users/staffs/${id}`,
        method: 'get',
    });
}

// Tìm kiếm nhân viên theo tên
export async function apiSearchStaffs<T>(data: { page: number; size: number; name: string }) {
    return ApiService.fetchData<T>({
        url: '/users/search-staffs',
        method: 'get',
        params: data,
    });
}

// Thêm nhân viên mới
export async function apiAddStaff<ApiResponse>(data: Staff) {
    return ApiService.fetchData<ApiResponse>({
        url: '/users/add-staff',
        method: 'post',
        data,
    });
}

// Cập nhật thông tin nhân viên
export async function apiUpdateStaff<ApiResponse>(id: number, data: Staff) {
    return ApiService.fetchData<ApiResponse>({
        url: `/users/update-staff/${id}`,
        method: 'put',
        data,
    });
}

// Xóa nhân viên
export async function apiDeleteStaff<ApiResponse>(id: number) {
    return ApiService.fetchData<ApiResponse>({
        url: `/users/delete-staff/${id}`,
        method: 'delete',
    });
}

// Kích hoạt nhân viên
export async function apiActivateStaff<ApiResponse>(id: number) {
    return ApiService.fetchData<ApiResponse>({
        url: `/users/activate-staff/${id}`,
        method: 'put',
    });
}

// Vô hiệu hóa nhân viên
export async function apiDeactivateStaff<ApiResponse>(id: number) {
    return ApiService.fetchData<ApiResponse>({
        url: `/users/deactivate-staff/${id}`,
        method: 'put',
    });
}