import { createBrowserRouter } from 'react-router-dom';

import AllDataIcon from '@mui/icons-material/WaterfallChart';
import CategoryIcon from '@mui/icons-material/Category';
import BudgetBreakdownIcon from '@mui/icons-material/DonutSmall';
import BudgetOverviewIcon from '@mui/icons-material/CandlestickChart';
import ManageBudgetIcon from '@mui/icons-material/AutoAwesomeMotion';
// import ManageBudgetIcon from '@mui/icons-material/Tune';;
// import ScenarioEditIcon from '.@mui/icons-material/DeveloperBoard/';
import TransactionsIcon from '@mui/icons-material/ReceiptLong';

import Layout from '../components/Layout';

import AllData from '../pages/AllData';
import BudgetBreakdown from '../pages/BudgetBreakdown';
import BudgetOverview from '../pages/BudgetOverview';
import Categories from '../pages/Categories/';
import Home from '../pages/Home';
import ManageBudgets from '../pages/ManageBudgets';
import Transactions from '../pages/Transactions/';
import EditBudget from '../pages/EditBudget';

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
    EDIT_BUDGET: '/edit-budget',
    MANAGE_BUDGETS: '/manage-budgets',
    TRANSACTIONS: '/transactions',
});

/**
 * Provides constructor functions for routes which require optional elements to their paths.
 *
 * NOTE: Does not include all paths, only those with optional parameters.
 * @constant
 * @category Constants
 * @subcategory Router
 */
export const ROUTES_FACTORY = Object.freeze({
    CREATE_BUDGET: (templateId: string|number) => `${ROUTES.CREATE_BUDGET}?templateId=${templateId}`,
    EDIT_BUDGET: (budgetId: string|number) => `${ROUTES.EDIT_BUDGET}/${budgetId}`,
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
		label: 'Manage Budgets',
		Icon: ManageBudgetIcon,
		location: ROUTES.MANAGE_BUDGETS,
	},
    {
		label: 'Manage Categories',
        Icon: CategoryIcon,
        location: ROUTES.CATEGORIES,
    },
	{
		label: 'Upload & View Transactions',
		Icon: TransactionsIcon,
		location: ROUTES.TRANSACTIONS,
	},
];

export default router;
