import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetProductReviews, apiRespondToReview } from '@/services/ReviewService'
import type { TableQueries } from '@/@types/common'
import type { ReviewData, ReviewListResponse } from '@/@types/review'

export type ReviewListState = {
    loading: boolean
    responseDialogVisible: boolean
    selectedReview?: ReviewData | null
    tableData: TableQueries
    reviewList: ReviewData[]
    submitting: boolean
}

export const SLICE_NAME = 'salesReviewList'

export const getReviews = createAsyncThunk(
    SLICE_NAME + '/getReviews',
    async (data: { page: number; size: number }) => {
        const response = await apiGetProductReviews<ReviewListResponse>(data)
        return response.data
    }
)

export const respondToReview = createAsyncThunk(
    SLICE_NAME + '/respondToReview',
    async (data: { reviewId: number; content: string }) => {
        const response = await apiRespondToReview<{ success: boolean }>(data)
        return { ...response.data, reviewId: data.reviewId, response: data.content }
    }
)

export const initialTableData: TableQueries = {
    totalPages: 0,
    page: 1,
    size: 10,
    title: '',
}

const initialState: ReviewListState = {
    loading: false,
    responseDialogVisible: false,
    selectedReview: null,
    reviewList: [],
    tableData: initialTableData,
    submitting: false,
}

const reviewListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        toggleResponseDialog: (state, action) => {
            state.responseDialogVisible = action.payload
        },
        setSelectedReview: (state, action) => {
            state.selectedReview = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getReviews.fulfilled, (state, action) => {
                state.reviewList = action.payload.data.content
                state.tableData.totalPages = action.payload.data.totalPages
                state.loading = false
            })
            .addCase(getReviews.pending, (state) => {
                state.loading = true
            })
            .addCase(respondToReview.fulfilled, (state, action) => {
                // Update the response in the review list
                state.reviewList = state.reviewList.map(review => 
                    review.id === action.payload.reviewId 
                        ? { ...review, response: action.payload.response } 
                        : review
                )
                state.responseDialogVisible = false
                state.selectedReview = null
                state.submitting = false
            })
            .addCase(respondToReview.pending, (state) => {
                state.submitting = true
            })
    },
})

export const {
    setTableData,
    toggleResponseDialog,
    setSelectedReview,
} = reviewListSlice.actions

export default reviewListSlice.reducer