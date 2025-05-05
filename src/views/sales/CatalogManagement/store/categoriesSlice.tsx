import { ApiResponse } from '@/@types/auth'
import { Category } from '@/@types/product'
import {
    apiCreateCategory,
    apiDeleteCategory,
    apiGetAllCategories,
    apiUpdateCategory,
} from '@/services/SalesService'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type SalesCategoriesListState = {
    data: {
        loading: boolean
        categories: Category[]
    }
    deleteConfirmation: boolean
    selectedCategory?: number
}

export const SLICE_NAME = 'salesCategories'

export const getCategories = createAsyncThunk(
    SLICE_NAME + '/getCategories',
    async () => {
        const response = await apiGetAllCategories<ApiResponse<Category[]>>()
        return response.data.data
    },
)

export const addCategory = createAsyncThunk(
    SLICE_NAME + '/addCategory',
    async (data: { name: string; parent?: Category }) => {
        const response = await apiCreateCategory<
            ApiResponse<Category>,
            typeof data
        >(data)
        return response.data.data
    },
)

export const updateCategory = createAsyncThunk(
    SLICE_NAME + '/updateCategory',
    async (data: Category) => {
        if (!data.id) {
            throw new Error('Category ID is required')
        }
        const response = await apiUpdateCategory<
            ApiResponse<Category>,
            Category
        >(data.id, data)
        return response.data.data
    },
)

export const deleteCategory = createAsyncThunk(
    SLICE_NAME + '/deleteCollection',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await apiDeleteCategory<boolean>(id)
            return response.data
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'message' in error) {
                return rejectWithValue(
                    'Danh mục này hiện đang có sản phẩm, không thể xóa.',
                )
            }
            return rejectWithValue('Unexpected error')
        }
    },
)

const initialState: SalesCategoriesListState = {
    data: {
        loading: false,
        categories: [],
    },
    deleteConfirmation: false,
    selectedCategory: undefined,
}

const categoriesSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateCategories: (state, action) => {
            state.data.categories = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.fulfilled, (state, action) => {
                state.data.categories = action.payload
                state.data.loading = false
            })
            .addCase(getCategories.pending, (state) => {
                state.data.loading = true
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.data.categories = [
                    ...state.data.categories,
                    action.payload,
                ]
                state.data.loading = false
            })
            .addCase(addCategory.pending, (state) => {
                state.data.loading = true
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.data.categories = state.data.categories.map((category) =>
                    category.id === action.payload.id
                        ? action.payload
                        : category,
                )
                state.data.loading = false
            })
            .addCase(updateCategory.pending, (state) => {
                state.data.loading = true
            })
            .addCase(deleteCategory.fulfilled, (state) => {
                state.data.categories = state.data.categories.filter(
                    (category) => category.id !== state.selectedCategory,
                )
                state.data.loading = false
            })
            .addCase(deleteCategory.pending, (state) => {
                state.data.loading = true
            })
            .addCase(deleteCategory.rejected, (state) => {
                state.data.loading = false
            })
    },
})

export const {
    updateCategories,
    toggleDeleteConfirmation,
    setSelectedCategory,
} = categoriesSlice.actions

export default categoriesSlice.reducer
