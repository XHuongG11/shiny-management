import { ApiResponse } from '@/@types/auth'
import { Collection } from '@/@types/product'
import {
    apiCreateCollection,
    apiDeleteCollection,
    apiGetAllCollections,
    apiUpdateCollection,
} from '@/services/SalesService'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type SalesCollectionsListState = {
    data: {
        loading: boolean
        collections: Collection[]
    }
    deleteConfirmation: boolean
    selectedCollection?: number
}

export const SLICE_NAME = 'salesCollections'

export const getCollections = createAsyncThunk(
    SLICE_NAME + '/getCollections',
    async () => {
        const response = await apiGetAllCollections<ApiResponse<Collection[]>>()
        console.log('api collections', response.data.data)
        return response.data.data
    },
)
export const addCollection = createAsyncThunk(
    SLICE_NAME + '/addCollection',
    async (data: { name: string; description: string }) => {
        const response = await apiCreateCollection<
            ApiResponse<Collection>,
            { name: string; description: string }
        >(data)
        console.log('api add collection', response.data.data)
        return response.data.data
    },
)
export const updateCollection = createAsyncThunk(
    SLICE_NAME + '/updateCollection',
    async (data: Collection) => {
        if (!data.id) {
            throw new Error('Collection ID is required')
        }
        const response = await apiUpdateCollection<
            ApiResponse<Collection>,
            Collection
        >(data.id, data)
        console.log('api add collection', response.data.data)
        return response.data.data
    },
)
export const deleteCollection = createAsyncThunk(
    SLICE_NAME + '/deleteCollection',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await apiDeleteCollection<boolean>(id)
            console.log('api delete collection', response.data)
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
const initialState: SalesCollectionsListState = {
    data: {
        loading: false,
        collections: [],
    },
    deleteConfirmation: false,
    selectedCollection: undefined,
}

const collectionsSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateCollections: (state, action) => {
            state.data.collections = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedCollection: (state, action) => {
            state.selectedCollection = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCollections.fulfilled, (state, action) => {
                state.data.collections = action.payload
                console.log('payload', action.payload)
                state.data.loading = false
            })
            .addCase(getCollections.pending, (state) => {
                state.data.loading = true
            })
            .addCase(addCollection.fulfilled, (state, action) => {
                state.data.collections = [
                    ...state.data.collections,
                    action.payload,
                ]
                console.log('payload', action.payload)
                state.data.loading = false
            })
            .addCase(addCollection.pending, (state) => {
                state.data.loading = true
            })
            .addCase(updateCollection.fulfilled, (state, action) => {
                state.data.collections = state.data.collections.map(
                    (collection) =>
                        collection.id === action.payload.id
                            ? action.payload
                            : collection,
                )
                console.log('payload', action.payload)
                state.data.loading = false
            })
            .addCase(updateCollection.pending, (state) => {
                state.data.loading = true
            })
            .addCase(deleteCollection.fulfilled, (state, action) => {
                state.data.collections = state.data.collections.filter(
                    (collection) => collection.id !== state.selectedCollection,
                )
                console.log('payload', action.payload)
                state.data.loading = false
            })
            .addCase(deleteCollection.pending, (state) => {
                state.data.loading = true
            })
            .addCase(deleteCollection.rejected, (state) => {
                state.data.loading = false
            })
    },
})

export const {
    updateCollections,
    toggleDeleteConfirmation,
    setSelectedCollection,
} = collectionsSlice.actions

export default collectionsSlice.reducer
