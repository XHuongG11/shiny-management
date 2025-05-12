import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetAllCustomers,
    apiDeactivateCustomer,
    apiActivateCustomer,
    apiSearchCustomers,
} from '@/services/CustomerService'
import type { TableQueries } from '@/@types/common'
import { Customer, CustomerListResponse } from '@/@types/customer'

export type CustomersState = {
    loading: boolean
    customerList: Customer[]
    tableData: TableQueries
    selectedCustomer: Customer | null
    banConfirmation: boolean
}

export const SLICE_NAME = 'crmCustomers'

export const initialTableData: TableQueries = {
    totalPages: 0,
    page: 1,
    size: 10,
    title: '',
}

const initialState: CustomersState = {
    loading: false,
    customerList: [],
    tableData: initialTableData,
    selectedCustomer: null,
    banConfirmation: false,
}

export const getCustomers = createAsyncThunk(
    SLICE_NAME + '/getCustomers',
    async (data: { page?: number; size?: number }) => {
        const response = await apiGetAllCustomers<CustomerListResponse>(data)
        return response.data
    }
)

export const searchCustomers = createAsyncThunk(
    SLICE_NAME + '/searchCustomers',
    async (data: { name: string; page?: number; size?: number }) => {
        const response = await apiSearchCustomers<CustomerListResponse>(data)
        return response.data
    }
)

export const deactivateCustomer = createAsyncThunk(
    SLICE_NAME + '/deactivateCustomer',
    async (id: number) => {
        const response = await apiDeactivateCustomer<boolean>(id)
        return { id, success: response.data }
    }
)

export const activateCustomer = createAsyncThunk(
    SLICE_NAME + '/activateCustomer',
    async (id: number) => {
        const response = await apiActivateCustomer<boolean>(id)
        return { id, success: response.data }
    }
)

const customersSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setSelectedCustomer: (state, action) => {
            state.selectedCustomer = action.payload
        },
        toggleBanConfirmation: (state, action) => {
            state.banConfirmation = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCustomers.fulfilled, (state, action) => {
                state.customerList = action.payload.data.content
                state.tableData.totalPages = action.payload.data.totalPages
                state.loading = false
            })
            .addCase(getCustomers.pending, (state) => {
                state.loading = true
            })
            .addCase(deactivateCustomer.fulfilled, (state, action) => {
                const { id } = action.payload
                state.customerList = state.customerList.map(customer =>
                    customer.id === id ? { ...customer, status: 'BANNED' } : customer
                )
            })
            .addCase(activateCustomer.fulfilled, (state, action) => {
                const { id } = action.payload
                state.customerList = state.customerList.map(customer =>
                    customer.id === id ? { ...customer, status: 'ACTIVE' } : customer
                )
            })
            .addCase(searchCustomers.fulfilled, (state, action) => {
                state.customerList = action.payload.data.content
                state.tableData.totalPages = action.payload.data.totalPages
                state.loading = false
            })
            .addCase(searchCustomers.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    setTableData,
    setSelectedCustomer,
    toggleBanConfirmation,
} = customersSlice.actions

export default customersSlice.reducer