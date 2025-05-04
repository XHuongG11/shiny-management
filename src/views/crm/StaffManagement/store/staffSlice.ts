import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetAllStaffs } from '@/services/StaffService';
import { Staff, StaffListResponse } from '@/@types/staff';

interface StaffState {
    staffList: Staff[];
    tableData: {
        page: number;
        size: number;
        sort: string | null;
        totalPages: number;
    };
    loading: boolean;
    selectedStaff: Staff | null;
    deleteConfirmationVisible: boolean;
    error: string | null;
}

const initialState: StaffState = {
    staffList: [],
    tableData: {
        page: 1,
        size: 10,
        sort: null,
        totalPages: 0,
    },
    loading: false,
    selectedStaff: null,
    deleteConfirmationVisible: false,
    error: null,
};

export const getStaffs = createAsyncThunk('staff/getStaffs', async (params: { page: number; size: number }, { rejectWithValue }) => {
    try {
        const response = await apiGetAllStaffs(params);
        console.log('API response:', response);
        return response.data as StaffListResponse;
    } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to fetch staffs');
    }
});

const staffSlice = createSlice({
    name: 'staff',
    initialState,
    reducers: {
        setTableData(state, action) {
            state.tableData = action.payload;
        },
        setSelectedStaff(state, action) {
            state.selectedStaff = action.payload;
        },
        toggleDeleteConfirmation(state, action) {
            state.deleteConfirmationVisible = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStaffs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStaffs.fulfilled, (state, action) => {
                state.loading = false;
                state.staffList = action.payload.data.content.map((item) => ({
                    ...item,
                    joinAt: item.join_at || item.joinAt,
                    fullName: item.full_name || item.fullName,
                }));
                state.tableData.totalPages = action.payload.data.totalPages;
            })
            .addCase(getStaffs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setTableData, setSelectedStaff, toggleDeleteConfirmation } = staffSlice.actions;
export default staffSlice.reducer;