import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { 
    apiGetAllBanners, 
    apiUpdateBanner, 
    apiGetPrivacyPolicy, 
    apiUpdatePrivacyPolicy 
} from '@/services/WebContentService'
import { Banner, PrivacyPolicy } from '@/@types/webContent'

export const SLICE_NAME = 'webContent'

export const fetchBanners = createAsyncThunk(
    `${SLICE_NAME}/fetchBanners`,
    async () => {
        const response = await apiGetAllBanners()
        return response.data.data
    }
)

export const updateBanner = createAsyncThunk(
    `${SLICE_NAME}/updateBanner`,
    async ({ id, formData }: { id: number; formData: FormData }) => {
        await apiUpdateBanner(id, formData)
        const response = await apiGetAllBanners()
        return response.data.data
    }
)

export const fetchPrivacyPolicy = createAsyncThunk(
    `${SLICE_NAME}/fetchPrivacyPolicy`,
    async () => {
        const response = await apiGetPrivacyPolicy()
        return response.data.data
    }
)

export const updatePrivacyPolicy = createAsyncThunk(
    `${SLICE_NAME}/updatePrivacyPolicy`,
    async (content: string) => {
        await apiUpdatePrivacyPolicy(content)
        const response = await apiGetPrivacyPolicy()
        return response.data.data
    }
)

type InitialStateType = {
    type: 'Banner' | 'Privacy';
    banners: Banner[];
    privacyPolicy: PrivacyPolicy | null;
    loading: boolean;
    error: string | null;
}

const initialState: InitialStateType = {
    type: 'Banner',
    banners: [],
    privacyPolicy: null,
    loading: false,
    error: null,
}

const catalogSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setType: (state, action) => {
            state.type = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // Banners handling
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.loading = false
                state.banners = action.payload
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch banners'
            })
            .addCase(updateBanner.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateBanner.fulfilled, (state, action) => {
                state.loading = false
                state.banners = action.payload
            })
            .addCase(updateBanner.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to update banner'
            })
            
            // Privacy policy handling
            .addCase(fetchPrivacyPolicy.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPrivacyPolicy.fulfilled, (state, action) => {
                state.loading = false
                state.privacyPolicy = action.payload
            })
            .addCase(fetchPrivacyPolicy.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch privacy policy'
            })
            .addCase(updatePrivacyPolicy.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updatePrivacyPolicy.fulfilled, (state, action) => {
                state.loading = false
                state.privacyPolicy = action.payload
            })
            .addCase(updatePrivacyPolicy.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to update privacy policy'
            })
    },
})

export const { setType } = catalogSlice.actions

export default catalogSlice.reducer
