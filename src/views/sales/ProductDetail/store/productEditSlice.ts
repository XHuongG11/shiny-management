import { ApiResponse } from '@/@types/auth'
import { ProductResponse } from '@/@types/product'
import {
    apiDeleteProduct,
    apiUpdateProduct,
    getProductById,
} from '@/services/SalesService'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type SalesProductEditState = {
    loading: boolean
    productData: ProductResponse
}

type GetSalesProductResponse = ProductResponse

export const SLICE_NAME = 'salesProductEdit'

export const getProduct = createAsyncThunk(
    SLICE_NAME + '/getProducts',
    async (data: number) => {
        const response =
            await getProductById<ApiResponse<GetSalesProductResponse>>(data)
        console.log('Product: ', response.data.data)
        return response.data.data
    },
)

export const updateProduct = async <T, U extends Record<string, unknown>>(
    id: number,
    data: U,
) => {
    const response = await apiUpdateProduct<T, U>(id, data)
    return response.data
}

export const deleteProduct = async <ApiResponse>(data: number) => {
    const response = await apiDeleteProduct<ApiResponse>(data)
    return response.data
}

const initialState: SalesProductEditState = {
    loading: true,
    productData: {
        id: 0,
        title: '',
        description: '',
        material: '',
        category: {
            id: 0,
            name: '',
            parent: null,
        },
        collection: {
            id: 0,
            name: '',
            description: '',
        },
        status: '',
        attributes: [],
        productSizes: [],
        images: [],
        createdAt: '',
        updatedAt: '',
    },
}

const productEditSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProduct.fulfilled, (state, action) => {
                state.productData = action.payload
                state.loading = false
            })
            .addCase(getProduct.pending, (state) => {
                state.loading = true
            })
    },
})

export default productEditSlice.reducer
