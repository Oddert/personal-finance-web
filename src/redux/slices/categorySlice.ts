import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Category } from '../../types/Category.d';
import { Matcher } from '../../types/Matcher.d';

/**
 * Redux state key for 'category'
 * @category Redux
 * @subcategory Category Slice
 */
export interface CategoryState {
    loading: boolean;
    queried: boolean;
    response: Category[];
    orderedData: {
        byId: { [id: string]: Category };
        byLabel: { [label: string]: Category };
    };
}

const initialState: CategoryState = {
    loading: false,
    queried: false,
    response: [],
    orderedData: {
        byId: {},
        byLabel: {},
    },
};

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        requestCategories: (state) => {
            state.loading = true;
            state.queried = true;
        },
        writeCategories: (
            state,
            {
                payload,
            }: PayloadAction<{
                categories: Category[];
                orderedData: CategoryState['orderedData'];
            }>,
        ) => {
            state.response = payload.categories;
            state.orderedData = payload.orderedData;
            state.loading = false;
            state.queried = true;
        },
        initCreateCategory: (
            state,
            {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                payload,
            }: PayloadAction<{
                category: Partial<Category>;
            }>,
        ) => {
            state.loading = true;
        },
        createCategory: (
            state,
            {
                payload,
            }: PayloadAction<{
                category: Category;
            }>,
        ) => {
            const category = payload.category;
            state.response.push(category);
            state.orderedData.byId[category.id] = category;
            state.orderedData.byLabel[category.label] = category;
            state.loading = false;
        },
        initUpdateSingleCategory: (
            state,
            {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                payload,
            }: PayloadAction<{
                category: Partial<Category>;
            }>,
        ) => {
            state.loading = true;
        },
        updateSingleCategory: (
            state,
            {
                payload,
            }: PayloadAction<{
                category: Category;
            }>,
        ) => {
            state.orderedData.byId[payload.category.id] = {
                ...state.orderedData.byId[payload.category.id],
                ...payload.category,
            };
            state.orderedData.byLabel[payload.category.label] =
                payload.category;

            state.response = state.response.map((category) => {
                if (category.id === payload?.category.id) {
                    return payload.category;
                }
                return category;
            });

            state.loading = false;
            state.queried = true;
        },
        initDeleteSingleCategory: (
            state,
            {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                payload,
            }: PayloadAction<{
                categoryId: Category['id'];
            }>,
        ) => {
            state.loading = true;
        },
        deleteSingleCategory: (
            state,
            {
                payload,
            }: PayloadAction<{
                categoryId: Category['id'];
            }>,
        ) => {
            const categoryId = payload.categoryId;
            state.response = state.response.filter(
                (category) => category.id !== categoryId,
            );
            delete state.orderedData.byLabel[
                state.orderedData.byId[categoryId].label
            ];
            delete state.orderedData.byId[categoryId];
            state.loading = false;
        },
        initCreateSingleMatcher: (
            state,
            {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                payload,
            }: PayloadAction<{
                categoryId: Category['id'];
                matcher: Partial<Matcher>;
            }>,
        ) => {
            state.loading = true;
        },
        createSingleMatcher: (
            state,
            {
                payload,
            }: PayloadAction<{
                categoryId: Category['id'];
                matcher: Matcher;
            }>,
        ) => {
            const updatedCategory = {
                ...state.orderedData.byId[payload.categoryId],
                matchers: [
                    ...state.orderedData.byId[payload.categoryId].matchers,
                    payload.matcher,
                ],
            };

            state.response = state.response.map((category) => {
                if (category.id === payload.categoryId) {
                    return updatedCategory;
                }
                return category;
            });
            state.orderedData.byId[payload.categoryId] = updatedCategory;
            state.orderedData.byLabel[updatedCategory.label] = updatedCategory;

            state.loading = false;
        },
        initUpdateSingleMatcher: (
            state,
            {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                payload,
            }: PayloadAction<{
                categoryId: Category['id'];
                matcher: Partial<Matcher>;
            }>,
        ) => {
            state.loading = true;
        },
        updateSingleMatcher: (
            state,
            {
                payload,
            }: PayloadAction<{
                categoryId: Category['id'];
                matcher: Matcher;
            }>,
        ) => {
            const updatedMatchers = state.orderedData.byId[
                payload.categoryId
            ].matchers.map((matcher) => {
                console.log(
                    matcher.id,
                    payload.matcher.id,
                    matcher.id === payload.matcher.id,
                );
                if (matcher.id === payload.matcher.id) {
                    return payload.matcher;
                }
                return matcher;
            });
            const updatedCategory = {
                ...state.orderedData.byId[payload.categoryId],
                matchers: updatedMatchers,
            };

            state.response = state.response.map((category) => {
                if (category.id === payload.categoryId) {
                    return updatedCategory;
                }
                return category;
            });
            state.orderedData.byId[payload.categoryId] = updatedCategory;
            state.orderedData.byLabel[updatedCategory.label] = updatedCategory;

            state.loading = false;
        },
        initDeleteSingleMatcher: (
            state,
            {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                payload,
            }: PayloadAction<{
                matcherId: Matcher['id'];
                categoryId: Category['id'];
            }>,
        ) => {
            state.loading = true;
        },
        deleteSingleMatcher: (
            state,
            {
                payload,
            }: PayloadAction<{
                categoryId: Category['id'];
                matcherId: Matcher['id'];
            }>,
        ) => {
            const updatedMatchers = state.orderedData.byId[
                payload.categoryId
            ].matchers.filter((matcher) => matcher.id !== payload.matcherId);
            const updatedCategory = {
                ...state.orderedData.byId[payload.categoryId],
                matchers: updatedMatchers,
            };

            state.response = state.response.map((category) => {
                if (category.id === payload.categoryId) {
                    return updatedCategory;
                }
                return category;
            });
            state.orderedData.byId[payload.categoryId] = updatedCategory;
            state.orderedData.byLabel[updatedCategory.label] = updatedCategory;

            state.loading = false;
        },
    },
});

export const {
    requestCategories,
    writeCategories,
    initCreateCategory,
    createCategory,
    initUpdateSingleCategory,
    updateSingleCategory,
    initDeleteSingleCategory,
    deleteSingleCategory,
    initCreateSingleMatcher,
    createSingleMatcher,
    initUpdateSingleMatcher,
    updateSingleMatcher,
    initDeleteSingleMatcher,
    deleteSingleMatcher,
} = categorySlice.actions;

export default categorySlice.reducer;
