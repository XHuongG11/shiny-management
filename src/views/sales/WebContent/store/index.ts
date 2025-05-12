import { combineReducers } from '@reduxjs/toolkit'
import reducer, { SLICE_NAME } from './catalogSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const webContentReducer = combineReducers({
    state: reducer,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [SLICE_NAME]: {
            loading: any
            state: {
                type: 'Banner' | 'Privacy';
                banners: Array<any>;
                privacyPolicy: any;
                loading: boolean;
                error: string | null;
            }
        }
    }
> = useSelector

export * from './catalogSlice'
export { useAppDispatch } from '@/store'
export default webContentReducer
