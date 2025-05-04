import { combineReducers } from '@reduxjs/toolkit'
import reducers, { SLICE_NAME, ReviewListState } from './reviewListSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    data: reducers,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            data: ReviewListState
        }
    }
> = useSelector

export * from './reviewListSlice'
export { useAppDispatch } from '@/store'
export default reducer