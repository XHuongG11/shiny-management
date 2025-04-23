import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiDeleteProduct, apiGetAllProducts } from '@/services/SalesService'
import type { TableQueries } from '@/@types/common'
import { ProductResponse } from '@/@types/product'
import { ApiResponse } from '@/@types/auth'

type Products = ProductResponse[]

type GetSalesProductsResponse = {
    content: Products
    totalPages: number
}

export type SalesProductListState = {
    loading: boolean
    deleteConfirmation: boolean
    selectedProduct?: number
    tableData: TableQueries
    productList: ProductResponse[]
}

type GetSalesProductsRequest = TableQueries // & { filterData?: FilterQueries }

export const SLICE_NAME = 'salesProductList'

export const getProducts = createAsyncThunk(
    SLICE_NAME + '/getProducts',
    async (data: GetSalesProductsRequest) => {
        const response = await apiGetAllProducts<
            ApiResponse<GetSalesProductsResponse>,
            GetSalesProductsRequest
        >(data)
        console.log(response.data.data)
        return response.data.data
    },
)

export const deleteProduct = async (id: number) => {
    const response = await apiDeleteProduct<boolean>(id)
    return response.data
}

export const initialTableData: TableQueries = {
    totalPages: 0,
    page: 1,
    size: 10,
    title: '',
}

const initialState: SalesProductListState = {
    loading: false,
    deleteConfirmation: false,
    selectedProduct: undefined,
    productList: [],
    tableData: initialTableData,
}

const productListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateProductList: (state, action) => {
            state.productList = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.fulfilled, (state, action) => {
                state.productList = action.payload.content
                state.tableData.totalPages = action.payload.totalPages
                state.loading = false
            })
            .addCase(getProducts.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateProductList,
    setTableData,
    toggleDeleteConfirmation,
    setSelectedProduct,
} = productListSlice.actions

export default productListSlice.reducer
