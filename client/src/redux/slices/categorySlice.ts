import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { Category } from '../../types/Category'

export interface CategoryState {
    loading: boolean
    queried: boolean
    response: Category[]
    orderedData: {
        byId: { [id: string]: Category }
        byLabel: { [label: string]: Category }
    }
}

const initialState: CategoryState = {
    loading: false,
    queried: false,
    response: [],
    orderedData: {
        byId: {},
        byLabel: {},
    },
}

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        requestCategories: (state) => {
            state.loading = true
        },
        writeCategories: (state, action: PayloadAction<{
            categories: Category[],
            orderedData: CategoryState['orderedData'],
        }>) => {
            state.response = action.payload.categories
            state.orderedData = action.payload.orderedData
            state.loading = false
            state.queried = true
        }
    }
})

export const {
    requestCategories,
    writeCategories,
} = categorySlice.actions

export default categorySlice.reducer
