import { createBrowserRouter } from 'react-router-dom';

import AllDataIcon from '@mui/icons-material/WaterfallChart';
import CategoryIcon from '@mui/icons-material/Category';
import BudgetBreakdownIcon from '@mui/icons-material/DonutSmall';
import BudgetOverviewIcon from '@mui/icons-material/CandlestickChart';
import ManageBudgetIcon from '@mui/icons-material/AutoAwesomeMotion';
import ManageCardsIcon from '@mui/icons-material/Payments';
// import ManageBudgetIcon from '@mui/icons-material/Tune';;
// import ScenarioEditIcon from '.@mui/icons-material/DeveloperBoard/';
import TransactionsIcon from '@mui/icons-material/ReceiptLong';

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
    MANAGE_CARDS: '/manage-cards',
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
        Icon: AllDataIcon,
        location: ROUTES.ALL_DATA,
    },
    {
        label: 'Budget Breakdown',
        Icon: BudgetBreakdownIcon,
        location: ROUTES.BUDGET_BREAKDOWN,
    },
    {
        label: 'Budget Overview',
        Icon: BudgetOverviewIcon,
        location: ROUTES.BUDGET_OVERVIEW,
    },
    {
        label: 'My Budgets',
        Icon: ManageBudgetIcon,
        location: ROUTES.MANAGE_BUDGETS,
    },
    {
        label: 'My Cards',
        Icon: ManageCardsIcon,
        location: ROUTES.MANAGE_CARDS,
    },
    {
        label: 'Categories',
        Icon: CategoryIcon,
        location: ROUTES.CATEGORIES,
    },
    {
        label: 'Transactions',
        Icon: TransactionsIcon,
        location: ROUTES.TRANSACTIONS,
    },
];

export default router;
