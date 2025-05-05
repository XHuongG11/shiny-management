import { combineReducers } from '@reduxjs/toolkit'
import catalogReducer from './catalogSlice'
import collectionsReducer, {
    SalesCollectionsListState,
} from './collectionsSlice'
import { useSelector } from 'react-redux'

import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

import categoriesReducer, { SalesCategoriesListState } from './categoriesSlice'

const reducer = combineReducers({
    catalog: catalogReducer,
    categories: categoriesReducer,
    collections: collectionsReducer,
})

export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        ['salesCatalog']: {
            catalog: {
                type: 'Category' | 'Collection'
            }
            categories: SalesCategoriesListState
            collections: SalesCollectionsListState
        }
    }
> = useSelector

export * from './categoriesSlice'
export { useAppDispatch } from '@/store'
export default reducer
