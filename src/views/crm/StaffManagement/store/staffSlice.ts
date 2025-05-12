import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetAllStaffs, apiSearchStaffs, apiActivateStaff, apiDeactivateStaff, apiDeleteStaff } from '@/services/StaffService';
import { Staff, StaffListResponse } from '@/@types/staff';
import { TableQueries } from '@/@types/common';
import { ApiResponse } from '@/@types/auth';
import { AxiosResponse } from 'axios';

export const SLICE_NAME = 'staffManagement';

export type StaffState = {
    staffList: Staff[];
    tableData: TableQueries;
    loading: boolean;
    selectedStaff?: Staff | null;
    deleteConfirmation: boolean;
    banConfirmation: boolean;
}

export const initialTableData: TableQueries = {
    totalPages: 0,
    page: 1,
    size: 10,
    title: '',
}

const initialState: StaffState = {
    staffList: [],
    tableData: initialTableData,
    loading: false,
    selectedStaff: null,
    deleteConfirmation: false,
    banConfirmation: false,
};

export const getStaffs = createAsyncThunk(
    SLICE_NAME + '/getStaffs', 
    async (params: { page: number; size: number }) => {
    const response = await apiGetAllStaffs<StaffListResponse>(params);
    return response.data;
});

export const searchStaffs = createAsyncThunk(
    SLICE_NAME + '/searchStaffs', 
    async (params: { page: number; size: number; name: string }) => {
    const response = await apiSearchStaffs<StaffListResponse>(params);
    return response.data;
});

export const banStaff = createAsyncThunk(
    SLICE_NAME + '/banStaff', 
    async (id: number) => {
    const response = await apiDeactivateStaff(id) as unknown as AxiosResponse<ApiResponse<Staff>>;
    if (response.data.code === "200") {
        return id;
    }
    throw new Error(response.data.message || 'Failed to ban staff');
});

export const unbanStaff = createAsyncThunk(
    SLICE_NAME + '/unbanStaff', 
    async (id: number) => {
    const response = await apiActivateStaff(id) as unknown as AxiosResponse<ApiResponse<Staff>>;
    if (response.data.code === "200") {
        return id;
    }
    throw new Error(response.data.message || 'Failed to unban staff');
});

export const deleteStaff = createAsyncThunk(
    SLICE_NAME + '/deleteStaff', 
    async (id: number) => {
    const response = await apiDeleteStaff(id) as unknown as AxiosResponse<ApiResponse<Staff>>;
    if (response.data.code === "200") {
        return id;
    }
    throw new Error(response.data.message || 'Failed to delete staff');
});

const staffSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData(state, action) {
            state.tableData = action.payload;
        },
        setSelectedStaff(state, action) {
            state.selectedStaff = action.payload;
        },
        toggleDeleteConfirmation(state, action) {
            state.deleteConfirmation = action.payload;
        },
        toggleBanConfirmation(state, action) {
            state.banConfirmation = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStaffs.fulfilled, (state, action) => {
                state.staffList = action.payload.data.content
                state.tableData.totalPages = action.payload.data.totalPages;
                state.loading = false;                
            })
            .addCase(getStaffs.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchStaffs.fulfilled, (state, action) => {
                state.staffList = action.payload.data.content;
                state.tableData.totalPages = action.payload.data.totalPages;
                state.loading = false;
            })
            .addCase(searchStaffs.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteStaff.fulfilled, (state, action) => {
                state.staffList = state.staffList.filter(staff => staff.id !== action.payload);
                state.deleteConfirmation = false;
                state.selectedStaff = null;
            })
            .addCase(banStaff.fulfilled, (state, action) => {
                const staffIndex = state.staffList.findIndex(staff => staff.id === action.payload);
                if (staffIndex !== -1) {
                    state.staffList[staffIndex].status = 'BANNED'; // Update the status to 'Banned'
                }
                state.banConfirmation = false;
                state.selectedStaff = null;
            })
            .addCase(unbanStaff.fulfilled, (state, action) => {
                const staffIndex = state.staffList.findIndex(staff => staff.id === action.payload);
                if (staffIndex !== -1) {
                    state.staffList[staffIndex].status = 'ACTIVE'; // Update the status to 'Active'
                }
                state.banConfirmation = false;
                state.selectedStaff = null;
            })

    },
});

export const { setTableData,
    setSelectedStaff,
    toggleDeleteConfirmation,
    toggleBanConfirmation,
} = staffSlice.actions;
export default staffSlice.reducer;