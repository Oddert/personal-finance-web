import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ICategory } from '../../types/Category.d';
import { IMatcher } from '../../types/Matcher.d';

/**
 * Redux state key for 'category'
 * @category Redux
 * @subcategory Category Slice
 */
export interface CategoryState {
    loading: boolean;
    queried: boolean;
    response: ICategory[];
    orderedData: {
        byId: { [id: string]: ICategory };
        byLabel: { [label: string]: ICategory };
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
        createCategory: (
            state,
            {
                payload,
            }: PayloadAction<{
                category: ICategory;
            }>,
        ) => {
            const category = payload.category;
            state.response.push(category);
            state.orderedData.byId[category.id] = category;
            state.orderedData.byLabel[category.label] = category;
            state.loading = false;
        },

        createSingleMatcher: (
            state,
            {
                payload,
            }: PayloadAction<{
                categoryId: ICategory['id'];
                matcher: IMatcher;
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
        deleteSingleCategory: (
            state,
            {
                payload,
            }: PayloadAction<{
                categoryId: ICategory['id'];
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
        deleteSingleMatcher: (
            state,
            {
                payload,
            }: PayloadAction<{
                categoryId: ICategory['id'];
                matcherId: IMatcher['id'];
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
        /**
         * @deprecated
         */
        initCreateCategory: (
            state,
            {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                payload,
            }: PayloadAction<{
                category: Partial<ICategory>;
            }>,
        ) => {
            state.loading = true;
        },
        /**
         * @deprecated
         */
        initCreateSingleMatcher: (
            state,
            {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                payload,
            }: PayloadAction<{
                categoryId: ICategory['id'];
                matcher: Partial<IMatcher>;
            }>,
        ) => {
            state.loading = true;
        },
        /**
         * @deprecated
         */
        initDeleteSingleCategory: (
            state,
            {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                payload,
            }: PayloadAction<{
                categoryId: ICategory['id'];
            }>,
        ) => {
            state.loading = true;
        },
        /**
         * @deprecated
         */
        initDeleteSingleMatcher: (
            state,
            {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                payload,
            }: PayloadAction<{
                matcherId: IMatcher['id'];
                categoryId: ICategory['id'];
            }>,
        ) => {
            state.loading = true;
        },
        /**
         * @deprecated
         */
        initUpdateSingleCategory: (
            state,
            {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                payload,
            }: PayloadAction<{
                category: Partial<ICategory>;
            }>,
        ) => {
            state.loading = true;
        },
        /**
         * @deprecated
         */
        initUpdateSingleMatcher: (
            state,
            {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                payload,
            }: PayloadAction<{
                categoryId: ICategory['id'];
                matcher: Partial<IMatcher>;
            }>,
        ) => {
            state.loading = true;
        },
        requestCategories: (state) => {
            state.loading = true;
            state.queried = true;
        },
        updateSingleCategory: (
            state,
            {
                payload,
            }: PayloadAction<{
                category: ICategory;
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
        updateSingleMatcher: (
            state,
            {
                payload,
            }: PayloadAction<{
                categoryId: ICategory['id'];
                matcher: IMatcher;
            }>,
        ) => {
            const updatedMatchers = state.orderedData.byId[
                payload.categoryId
            ].matchers.map((matcher) => {
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
        writeCategories: (
            state,
            {
                payload,
            }: PayloadAction<{
                categories: ICategory[];
                orderedData: CategoryState['orderedData'];
            }>,
        ) => {
            state.response = payload.categories;
            state.orderedData = payload.orderedData;
            state.loading = false;
            state.queried = true;
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
