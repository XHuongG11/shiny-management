export type Banner = {
    id?: number;
    name: string;
    url: string;
    position: string;
    imageFile?: File; // For upload/update operations
};

export type BannerListResponse = {
    code: string;
    message: string;
    data: Banner[];
};

export type PrivacyPolicy = {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string | null;
};

export type PrivacyPolicyResponse = {
    code: string;
    message: string;
    data: PrivacyPolicy;
};

export type WebContentType = 'Banner' | 'Privacy';