import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    username: string
    email: string
    phone: string
    fullName: string
    dob: string
    gender: string
    status: string
    role: string
}

const initialState: UserState = {
    username: '',
    email: '',
    phone: '',
    fullName: '',
    dob: '',
    gender: '',
    status: '',
    role: '',
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.username = action.payload?.username
            state.email = action.payload?.email
            state.phone = action.payload?.phone
            state.fullName = action.payload?.fullName
            state.dob = action.payload?.dob
            state.gender = action.payload?.gender
            state.status = action.payload?.status
            state.role = action.payload?.role
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
