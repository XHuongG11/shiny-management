import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetSalesOrders, apiDeleteSalesOrders } from '@/services/SalesService'
import type { TableQueries } from '@/@types/common'
import { OrderResponse } from '@/@types/order'
import { ApiResponse } from '@/@types/auth'

type Orders = OrderResponse[]

type GetSalesOrdersResponse = {
    content: Orders
    totalPages: number
}

export type SalesOrderListState = {
    loading: boolean
    deleteConfirmation: boolean
    selectedOrder?: string
    tableData: TableQueries & {
        status?: string
        query?: string
    }
    orderList: OrderResponse[]
}

type GetSalesOrdersRequest = TableQueries & {
    status?: string
    query?: string
}

export const SLICE_NAME = 'salesOrderList'

export const getOrders = createAsyncThunk(
    SLICE_NAME + '/getOrders',
    async (data: GetSalesOrdersRequest) => {
        const response = await apiGetSalesOrders<
            ApiResponse<GetSalesOrdersResponse>,
            GetSalesOrdersRequest
        >(data)
        console.log(response.data.data)
        return response.data.data
    }
)

export const deleteOrders = async (id: string) => {
    const response = await apiDeleteSalesOrders<
        boolean,
        { id: string }
    >({ id })
    return response.data
}

export const initialTableData: TableQueries & { status?: string; query?: string } = {
    totalPages: 0,
    page: 1,
    size: 10,
    title: '',
    status: undefined,
    query: '',
}

const initialState: SalesOrderListState = {
    loading: false,
    deleteConfirmation: false,
    selectedOrder: undefined,
    orderList: [],
    tableData: initialTableData,
}

const orderListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateOrderList: (state, action) => {
            state.orderList = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedOrder: (state, action) => {
            state.selectedOrder = action.payload
        },
        setStatusFilter: (state, action) => {
            state.tableData.status = action.payload === 'ALL' ? undefined : action.payload
        },
        setSearchQuery: (state, action) => {
            state.tableData.query = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.fulfilled, (state, action) => {
                state.orderList = action.payload.content
                state.tableData.totalPages = action.payload.totalPages
                state.loading = false
            })
            .addCase(getOrders.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateOrderList,
    setTableData,
    toggleDeleteConfirmation,
    setSelectedOrder,
    setStatusFilter,
    setSearchQuery
} = orderListSlice.actions

export default orderListSlice.reducer