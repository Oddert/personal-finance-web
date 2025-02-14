import { createBrowserRouter } from 'react-router-dom';

import {
    WaterfallChart as IconAllData,
    Category as IconCategory,
    DonutSmall as IconBudgetBreakdown,
    CandlestickChart as IconBudgetOverview,
    AutoAwesomeMotion as IconManageBudget,
    Payments as IconManageCards,
    ManageAccounts as IconProfile,
    //  Tune as IconManageBudget,
    //  DeveloperBoard as IconScenarioEdit,
    ReceiptLong as IconTransactions,
} from '@mui/icons-material';

import Layout from '../components/Layout';

import AllData from '../pages/AllData';
import BudgetBreakdown from '../pages/BudgetBreakdown';
import BudgetOverview from '../pages/BudgetOverview';
import Categories from '../pages/Categories/';
import EditBudget from '../pages/EditBudget';
import EditCard from '../pages/EditCard';
import Home from '../pages/Home';
import ManageBudgets from '../pages/ManageBudgets';
import ManageCards from '../pages/ManageCards';
import Profile from '../pages/Profile';
import Transactions from '../pages/Transactions/';

/**
 * Enum object to hold all route paths.
 * @constant
 * @category Constants
 * @subcategory Router
 */
export const ROUTES = Object.freeze({
    HOME: '/',
    ALL_DATA: '/all-data',
    BUDGET_BREAKDOWN: '/budget-breakdown',
    BUDGET_OVERVIEW: '/budget-overview',
    CATEGORIES: '/categories',
    CREATE_BUDGET: '/create-budget',
    CREATE_CARD: '/create-card',
    EDIT_BUDGET: '/edit-budget',
    EDIT_CARD: '/edit-card',
    MANAGE_BUDGETS: '/manage-budgets',
    MANAGE_CARDS: '/profile',
    PROFILE: '/user-settings',
    TRANSACTIONS: '/transactions',
});

/**
 * Provides constructor functions for APIService which require optional elements to their paths.
 *
 * NOTE: Does not include all paths, only those with optional parameters.
 * @constant
 * @category Constants
 * @subcategory Router
 */
export const ROUTES_FACTORY = Object.freeze({
    CREATE_BUDGET: (templateId: string | number) =>
        `${ROUTES.CREATE_BUDGET}?templateId=${templateId}`,
    EDIT_BUDGET: (budgetId: string | number) =>
        `${ROUTES.EDIT_BUDGET}/${budgetId}`,
    EDIT_CARD: (cardId: string | number) => `${ROUTES.EDIT_CARD}/${cardId}`,
});

// export const GO = Object.freeze({
//     HOME: () => push(ROUTES.HOME)
// })

/**
 * React router config.
 * @constant
 * @category Constants
 * @subcategory Router
 */
const router = createBrowserRouter([
    {
        path: ROUTES.HOME,
        element: (
            <Layout>
                <Home />
            </Layout>
        ),
    },
    {
        path: ROUTES.TRANSACTIONS,
        element: (
            <Layout>
                <Transactions />
            </Layout>
        ),
    },
    {
        path: ROUTES.CATEGORIES,
        element: (
            <Layout>
                <Categories />
            </Layout>
        ),
    },
    {
        path: ROUTES.ALL_DATA,
        element: (
            <Layout>
                <AllData />
            </Layout>
        ),
    },
    {
        path: ROUTES.BUDGET_BREAKDOWN,
        element: (
            <Layout>
                <BudgetBreakdown />
            </Layout>
        ),
    },
    {
        path: ROUTES.BUDGET_OVERVIEW,
        element: (
            <Layout>
                <BudgetOverview />
            </Layout>
        ),
    },
    {
        path: ROUTES.MANAGE_BUDGETS,
        element: (
            <Layout>
                <ManageBudgets />
            </Layout>
        ),
    },
    {
        path: ROUTES.CREATE_BUDGET,
        element: (
            <Layout>
                <EditBudget />
            </Layout>
        ),
    },
    {
        path: `${ROUTES.EDIT_BUDGET}/:budgetId`,
        element: (
            <Layout>
                <EditBudget />
            </Layout>
        ),
    },
    {
        path: ROUTES.MANAGE_CARDS,
        element: (
            <Layout>
                <ManageCards />
            </Layout>
        ),
    },
    {
        path: ROUTES.CREATE_CARD,
        element: (
            <Layout>
                <EditCard />
            </Layout>
        ),
    },
    {
        path: `${ROUTES.EDIT_CARD}/:cardId`,
        element: (
            <Layout>
                <EditCard />
            </Layout>
        ),
    },
    {
        path: `${ROUTES.PROFILE}`,
        element: (
            <Layout>
                <Profile />
            </Layout>
        ),
    },
]);

/**
 * Schema for the main navbar.
 * @constant
 * @category Constants
 * @subcategory Router
 */
export const navigation = [
    {
        label: 'All Historical Data',
        Icon: IconAllData,
        location: ROUTES.ALL_DATA,
    },
    {
        label: 'Budget Breakdown',
        Icon: IconBudgetBreakdown,
        location: ROUTES.BUDGET_BREAKDOWN,
    },
    {
        label: 'Budget Overview',
        Icon: IconBudgetOverview,
        location: ROUTES.BUDGET_OVERVIEW,
    },
    {
        label: 'My Budgets',
        Icon: IconManageBudget,
        location: ROUTES.MANAGE_BUDGETS,
    },
    {
        label: 'My Cards',
        Icon: IconManageCards,
        location: ROUTES.MANAGE_CARDS,
    },
    {
        label: 'Categories',
        Icon: IconCategory,
        location: ROUTES.CATEGORIES,
    },
    {
        label: 'Transactions',
        Icon: IconTransactions,
        location: ROUTES.TRANSACTIONS,
    },
    {
        label: 'Profile',
        Icon: IconProfile,
        location: ROUTES.PROFILE,
    },
];

export default router;
