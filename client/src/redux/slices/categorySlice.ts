import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { Category } from '../../types/Category'
import { Matcher } from '../../types/Matcher'

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
        },
        initUpdateSingleCategory: (state, action: PayloadAction<{
            category: Partial<Category>
        }>) => {
            state.loading = true
        },
        updateSingleCategory: (state, action: PayloadAction<{
            category: Category,
        }>) => {
            state.orderedData.byId[action.payload.category.id] = {
                ...state.orderedData.byId[action.payload.category.id],
                ...action.payload.category,
            }
            state.orderedData.byLabel[action.payload.category.label] = action.payload.category
            
            state.response = state.response.map((category) => {
                if (category.id === action.payload?.category.id) {
                    return action.payload.category
                }
                return category
            })
            
            state.loading = false
            state.queried = true
        },
        initCreateSingleMatcher: (state, action: PayloadAction<{
            categoryId: Category['id'],
            matcher: Partial<Matcher>,
        }>) => {
            state.loading = true
        },
        createSingleMatcher: (state, action: PayloadAction<{
            categoryId: Category['id'],
            matcher: Matcher,
        }>) => {
            const updatedCategory = {
                ...state.orderedData.byId[action.payload.categoryId],
                matchers: [
                    ...state.orderedData.byId[action.payload.categoryId].matchers,
                    action.payload.matcher,
                ],
            }
            
            state.response = state.response.map(category => {
                if (category.id === action.payload.categoryId) {
                    return updatedCategory
                }
                return category
            })
            state.orderedData.byId[action.payload.categoryId] = updatedCategory
            state.orderedData.byLabel[updatedCategory.label] = updatedCategory

            state.loading = false
        },
        initUpdateSingleMatcher: (state, action: PayloadAction<{
            categoryId: Category['id'],
            matcher: Partial<Matcher>,
        }>) => {
            state.loading = true
        },
        updateSingleMatcher: (state, action: PayloadAction<{
            categoryId: Category['id'],
            matcher: Matcher,
        }>) => {
            const updatedMatchers = state.orderedData.byId[action.payload.categoryId].matchers.map(
                matcher => {
                    if (matcher.id === action.payload.matcher.id) {
                        return action.payload.matcher
                    }
                    return matcher
                }
            )
            const updatedCategory = {
                ...state.orderedData.byId[action.payload.categoryId],
                matchers: updatedMatchers,
            }

            state.response = state.response.map(category => {
                if (category.id === action.payload.categoryId) {
                    return updatedCategory
                }
                return category
            })
            state.orderedData.byId[action.payload.categoryId] = updatedCategory
            state.orderedData.byLabel[updatedCategory.label] = updatedCategory
            
            state.loading = false
        },
        initDeleteSingleMatcher: (state, action: PayloadAction<{
            matcherId: Matcher['id'],
            categoryId: Category['id'],
        }>) => {
            state.loading = true
        },
        deleteSingleMatcher: (state, action: PayloadAction<{
            categoryId: Category['id'],
            matcherId: Matcher['id'],
        }>) => {
            const updatedMatchers = state.orderedData.byId[action.payload.categoryId].matchers.filter(
                matcher => matcher.id !== action.payload.matcherId
            )
            const updatedCategory = {
                ...state.orderedData.byId[action.payload.categoryId],
                matchers: updatedMatchers,
            }

            state.response = state.response.map(category => {
                if (category.id === action.payload.categoryId) {
                    return updatedCategory
                }
                return category
            })
            state.orderedData.byId[action.payload.categoryId] = updatedCategory
            state.orderedData.byLabel[updatedCategory.label] = updatedCategory
            
            state.loading = false
        },
    }
})

export const {
    requestCategories,
    writeCategories,
    initUpdateSingleCategory,
    updateSingleCategory,
    initCreateSingleMatcher,
    createSingleMatcher,
    initUpdateSingleMatcher,
    updateSingleMatcher,
    initDeleteSingleMatcher,
    deleteSingleMatcher,
} = categorySlice.actions

export default categorySlice.reducer
