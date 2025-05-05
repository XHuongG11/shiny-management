import { createSlice } from '@reduxjs/toolkit'

export const SLICE_NAME = 'catalogSlice'

const initialState = {
    type: 'Category' as 'Category' | 'Collection',
}

const catalogSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setType: (state, action) => {
            state.type = action.payload
        },
    },
})

export const { setType } = catalogSlice.actions

export default catalogSlice.reducer
