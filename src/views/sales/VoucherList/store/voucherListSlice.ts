import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiDeleteVoucher, apiGetAllVouchers, apiSearchVouchers } from '@/services/VoucherService'
import type { TableQueries } from '@/@types/common'
import { Voucher, VoucherListResponse } from '@/@types/voucher'
import { ApiResponse } from '@/@types/auth'
import { AxiosResponse } from 'axios'

export type VoucherListState = {
    loading: boolean
    deleteConfirmation: boolean
    selectedVoucher?: Voucher | null
    tableData: TableQueries
    voucherList: Voucher[]
}

export const SLICE_NAME = 'salesVoucherList'

export const getVouchers = createAsyncThunk(
    SLICE_NAME + '/getVouchers',
    async (data: { page: number; size: number }) => {
        const response = await apiGetAllVouchers<VoucherListResponse>(data)
        return response.data
    }
)

export const searchVouchers = createAsyncThunk(
    SLICE_NAME + '/searchVouchers',
    async (data: { page: number; size: number; query: string }) => {
        const response = await apiSearchVouchers<VoucherListResponse>(data)
        return response.data
    }
)

export const deleteVoucher = createAsyncThunk(
    SLICE_NAME + '/deleteVoucher',
    async (id: number) => {
        const response = await apiDeleteVoucher(id) as unknown as AxiosResponse<ApiResponse<Voucher>>
        if (response.data.code === "200") {
            return id
        }
        throw new Error(response.data.message || 'Unable to delete voucher')
    }
)

export const initialTableData: TableQueries = {
    totalPages: 0,
    page: 1,
    size: 10,
    title: '',
}

const initialState: VoucherListState = {
    loading: false,
    deleteConfirmation: false,
    selectedVoucher: null,
    voucherList: [],
    tableData: initialTableData,
}

const voucherListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedVoucher: (state, action) => {
            state.selectedVoucher = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getVouchers.fulfilled, (state, action) => {
                state.voucherList = action.payload.data.content
                state.tableData.totalPages = action.payload.data.totalPages
                state.loading = false
            })
            .addCase(getVouchers.pending, (state) => {
                state.loading = true
            })
            .addCase(searchVouchers.fulfilled, (state, action) => {
                state.voucherList = action.payload.data.content
                state.tableData.totalPages = action.payload.data.totalPages
                state.loading = false
            })
            .addCase(searchVouchers.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteVoucher.fulfilled, (state, action) => {
                state.voucherList = state.voucherList.filter(
                    (voucher) => voucher.id !== action.payload
                )
                state.deleteConfirmation = false
                state.selectedVoucher = null
            })
    },
})

export const {
    setTableData,
    toggleDeleteConfirmation,
    setSelectedVoucher,
} = voucherListSlice.actions

export default voucherListSlice.reducer