import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetAllStaffs, apiDeleteStaff, apiActivateStaff, apiBanStaff } from '@/services/StaffService';
import { Staff, StaffListResponse } from '@/@types/staff';

interface StaffState {
    staffList: Staff[];
    tableData: {
        page: number;
        size: number;
        sort: string | null;
        totalPages: number;
        query: string;
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
        query: '',
    },
    loading: false,
    selectedStaff: null,
    deleteConfirmationVisible: false,
    error: null,
};

export const getStaffs = createAsyncThunk('staff/getStaffs', async (params: { page: number; size: number; query?: string }, { rejectWithValue }) => {
    try {
        const response = await apiGetAllStaffs(params);
        console.log('API response:', response);
        return response.data as StaffListResponse;
    } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to fetch staffs');
    }
});

export const deleteStaff = createAsyncThunk('staff/deleteStaff', async (id: number, { rejectWithValue }) => {
    try {
        const response = await apiDeleteStaff(id);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to delete staff');
    }
});

export const activateStaff = createAsyncThunk('staff/activateStaff', async (id: number, { rejectWithValue }) => {
    try {
        const response = await apiActivateStaff(id);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to activate staff');
    }
});

export const banStaff = createAsyncThunk('staff/banStaff', async (id: number, { rejectWithValue }) => {
    try {
        const response = await apiBanStaff(id);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.message || 'Failed to ban staff');
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
        setSearchQuery(state, action) {
            state.tableData.query = action.payload;
            state.tableData.page = 1;
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
            })
            .addCase(deleteStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStaff.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(activateStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(activateStaff.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(activateStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(banStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(banStaff.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(banStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setTableData, setSelectedStaff, toggleDeleteConfirmation, setSearchQuery } = staffSlice.actions;
export default staffSlice.reducer;