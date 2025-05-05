import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetAllCustomers,
    apiPutCrmCustomer,
    apiGetCrmCustomerDetails,
    apiDeleteCrmCustomer,
    apiDeactivateCustomer,
    apiActivateCustomer,
    apiSearchCustomers,
} from '@/services/CustomerService'
import type { TableQueries } from '@/@types/common'
import { Customer, CustomerListResponse, EUserStatus } from '@/@types/customer'

export type CustomersState = {
    loading: boolean
    statisticLoading: boolean
    customerList: Customer[]
    statisticData: Partial<any>
    tableData: TableQueries
    filterData: { status: string }
    drawerOpen: boolean
    selectedCustomer: Partial<Customer>
}

export const SLICE_NAME = 'crmCustomers'

export const getCustomers = createAsyncThunk(
    SLICE_NAME + '/getCustomers',
    async (data: { page?: number; size?: number }) => {
        console.log('getCustomers params:', data)
        const response = await apiGetAllCustomers<CustomerListResponse>(data)
        console.log('getCustomers raw response:', response)
        return response.data
    }
)

export const getCustomerDetails = createAsyncThunk(
    SLICE_NAME + '/getCustomerDetails',
    async (params: { id: string }) => {
        const response = await apiGetCrmCustomerDetails<Customer, { id: string }>(params)
        return response.data
    }
)

export const putCustomer = createAsyncThunk(
    SLICE_NAME + '/putCustomer',
    async (data: Customer) => {
        const response = await apiPutCrmCustomer<Customer, Customer>(data)
        return response.data
    }
)

export const deleteCustomer = createAsyncThunk(
    SLICE_NAME + '/deleteCustomer',
    async (data: { id: string }) => {
        const response = await apiDeleteCrmCustomer<boolean, { id: string }>(data)
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

export const searchCustomers = createAsyncThunk(
    SLICE_NAME + '/searchCustomers',
    async (data: { name: string; page?: number; size?: number }) => {
        console.log('searchCustomers params:', data)
        const response = await apiSearchCustomers<CustomerListResponse>(data)
        console.log('searchCustomers raw response:', response)
        return response.data
    }
)

export const initialTableData: TableQueries = {
    totalPages: 0,
    page: 1,
    size: 10,
    title: '',
    sort: {
        order: '',
        key: '',
    },
}

const initialFilterData = {
    status: '',
}

const initialState: CustomersState = {
    loading: false,
    statisticLoading: false,
    customerList: [],
    statisticData: {},
    tableData: initialTableData,
    filterData: initialFilterData,
    drawerOpen: false,
    selectedCustomer: {},
}

const customersSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setCustomerList: (state, action) => {
            state.customerList = action.payload
        },
        setFilterData: (state, action) => {
            state.filterData = action.payload
        },
        setSelectedCustomer: (state, action) => {
            state.selectedCustomer = action.payload
        },
        setDrawerOpen: (state) => {
            state.drawerOpen = true
        },
        setDrawerClose: (state) => {
            state.drawerOpen = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCustomers.fulfilled, (state, action) => {
                console.log('getCustomers response:', action.payload)
                state.customerList = action.payload.data.content || []
                state.tableData.totalPages = action.payload.data.totalPages || 0
                state.tableData.page = (action.payload.data.number || 0) + 1
                state.loading = false
                console.log('Updated state after getCustomers:', state)
            })
            .addCase(getCustomers.pending, (state) => {
                state.loading = true
                console.log('getCustomers pending, state:', state)
            })
            .addCase(getCustomers.rejected, (state, action) => {
                console.log('getCustomers error:', action.error)
                state.customerList = []
                state.loading = false
                console.log('Updated state after getCustomers error:', state)
            })
            .addCase(getCustomerDetails.fulfilled, (state, action) => {
                state.selectedCustomer = action.payload
            })
            .addCase(putCustomer.fulfilled, (state, action) => {
                const updatedCustomer = action.payload
                state.customerList = state.customerList.map(customer =>
                    customer.id === updatedCustomer.id ? updatedCustomer : customer
                )
                state.selectedCustomer = updatedCustomer
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                if (state.selectedCustomer?.id) {
                    state.customerList = state.customerList.filter(customer => customer.id !== state.selectedCustomer?.id)
                    state.selectedCustomer = {}
                }
            })
            .addCase(deactivateCustomer.fulfilled, (state, action) => {
                const { id } = action.payload
                state.customerList = state.customerList.map(customer =>
                    customer.id === id ? { ...customer, status: EUserStatus.INACTIVE } : customer
                )
            })
            .addCase(activateCustomer.fulfilled, (state, action) => {
                const { id } = action.payload
                state.customerList = state.customerList.map(customer =>
                    customer.id === id ? { ...customer, status: EUserStatus.ACTIVE } : customer
                )
            })
            .addCase(searchCustomers.fulfilled, (state, action) => {
                console.log('searchCustomers response:', action.payload)
                state.customerList = action.payload.data.content || []
                state.tableData.totalPages = action.payload.data.totalPages || 0
                state.tableData.page = (action.payload.data.number || 0) + 1
                state.loading = false
                console.log('Updated state after searchCustomers:', state)
            })
            .addCase(searchCustomers.pending, (state) => {
                state.loading = true
            })
            .addCase(searchCustomers.rejected, (state, action) => {
                console.log('searchCustomers error:', action.error)
                state.customerList = []
                state.loading = false
            })
    },
})

export const {
    setTableData,
    setCustomerList,
    setFilterData,
    setSelectedCustomer,
    setDrawerOpen,
    setDrawerClose,
} = customersSlice.actions

export default customersSlice.reducer