import ApiService from './ApiService';
import { BannerListResponse, PrivacyPolicyResponse, Banner } from '@/@types/webContent';

// Get all banners
export async function apiGetAllBanners() {
    return ApiService.fetchData<BannerListResponse>({
        url: '/banners/all',
        method: 'get',
    });
}

// Update a banner by id
export async function apiUpdateBanner(id: number, formData: FormData) {
    return ApiService.fetchData<{code: string; message: string}>({
        url: `/banners/${id}`,
        method: 'put',
        data: formData as any,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

// Get privacy policy content
export async function apiGetPrivacyPolicy() {
    return ApiService.fetchData<PrivacyPolicyResponse>({
        url: '/privacy-and-terms/get',
        method: 'get',
    });
}

// Update privacy policy content
export async function apiUpdatePrivacyPolicy(content: string) {
    return ApiService.fetchData<{code: string; message: string}>({
        url: '/privacy-and-terms/update',
        method: 'put',
        data: { content },
    });
}