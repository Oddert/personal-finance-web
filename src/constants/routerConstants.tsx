import { createBrowserRouter } from 'react-router-dom';

import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

import {
    WaterfallChart as IconAllData,
    Category as IconCategory,
    StackedBarChart as IconBudget,
    DonutSmall as IconBudgetBreakdown,
    CandlestickChart as IconBudgetOverview,
    Logout as IconLogout,
    AutoAwesomeMotion as IconManageBudget,
    Payments as IconManageCards,
    Person as IconUser,
    // ManageAccounts as IconProfile,
    //  Tune as IconManageBudget,
    //  DeveloperBoard as IconScenarioEdit,
    ReceiptLong as IconTransactions,
    Receipt as IconTransaction,
    Settings as IconProfile,
} from '@mui/icons-material';

import Layout from '../components/Layout';

import AllData from '../pages/AllData';
import BudgetBreakdown from '../pages/BudgetBreakdown';
import BudgetOverview from '../pages/BudgetOverview';
import Categories from '../pages/Categories/';
import EditBudget from '../pages/EditBudget';
import EditCard from '../pages/EditCard';
import Home from '../pages/Home';
import Login from '../pages/Login';
import ManageBudgets from '../pages/ManageBudgets';
import ManageCards from '../pages/ManageCards';
import Profile from '../pages/Profile';
import Transactions from '../pages/Transactions/';
import Language from '../pages/Profile/Tabs/Language';
import Appearance from '../pages/Profile/Tabs/Appearance';
import Security from '../pages/Profile/Tabs/Security';
import ManageScenarios from '../pages/ManageScenarios/ManageScenarios';
import EditScenario from '../pages/EditScenario/EditScenario';

export interface INavigationOption {
    label: string;
    Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
        muiName: string;
    };
    location: string;
    children?: INavigationOption[];
    defaultExpanded?: boolean;
}

export interface INavigation {
    top: INavigationOption[];
    bottom: INavigationOption[];
}

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
    CREATE_SCENARIO: '/create-scenario',
    EDIT_BUDGET: '/edit-budget',
    EDIT_CARD: '/edit-card',
    EDIT_SCENARIO: '/edit-scenario',
    LOGIN: '/login',
    LOGOUT: '/login?logout=1',
    MANAGE_BUDGETS: '/manage-budgets',
    MANAGE_CARDS: '/cards',
    MANAGE_SCENARIOS: '/scenarios',
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
    CREATE_SCENARIO: (templateId: string | number) =>
        `${ROUTES.CREATE_SCENARIO}?templateId=${templateId}`,
    EDIT_BUDGET: (budgetId: string | number) =>
        `${ROUTES.EDIT_BUDGET}/${budgetId}`,
    EDIT_CARD: (cardId: string | number) => `${ROUTES.EDIT_CARD}/${cardId}`,
    EDIT_SCENARIO: (scenarioId: string | number) =>
        `${ROUTES.EDIT_SCENARIO}/${scenarioId}`,
    LOGIN: (returnAddr?: string) => `${ROUTES.LOGIN}?redirect=${returnAddr}`,
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
            <Layout requiresAuth>
                <Transactions />
            </Layout>
        ),
    },
    {
        path: ROUTES.CATEGORIES,
        element: (
            <Layout requiresAuth>
                <Categories />
            </Layout>
        ),
    },
    {
        path: ROUTES.ALL_DATA,
        element: (
            <Layout requiresAuth>
                <AllData />
            </Layout>
        ),
    },
    {
        path: ROUTES.BUDGET_BREAKDOWN,
        element: (
            <Layout requiresAuth>
                <BudgetBreakdown />
            </Layout>
        ),
    },
    {
        path: ROUTES.BUDGET_OVERVIEW,
        element: (
            <Layout requiresAuth>
                <BudgetOverview />
            </Layout>
        ),
    },
    {
        path: ROUTES.MANAGE_BUDGETS,
        element: (
            <Layout requiresAuth>
                <ManageBudgets />
            </Layout>
        ),
    },
    {
        path: ROUTES.CREATE_BUDGET,
        element: (
            <Layout requiresAuth>
                <EditBudget />
            </Layout>
        ),
    },
    {
        path: `${ROUTES.EDIT_BUDGET}/:budgetId`,
        element: (
            <Layout requiresAuth>
                <EditBudget />
            </Layout>
        ),
    },
    {
        path: ROUTES.MANAGE_CARDS,
        element: (
            <Layout requiresAuth>
                <ManageCards />
            </Layout>
        ),
    },
    {
        path: ROUTES.CREATE_CARD,
        element: (
            <Layout requiresAuth>
                <EditCard />
            </Layout>
        ),
    },
    {
        path: `${ROUTES.EDIT_CARD}/:cardId`,
        element: (
            <Layout requiresAuth>
                <EditCard />
            </Layout>
        ),
    },
    {
        path: ROUTES.MANAGE_SCENARIOS,
        element: (
            <Layout requiresAuth>
                <ManageScenarios />
            </Layout>
        ),
    },
    {
        path: ROUTES.CREATE_SCENARIO,
        element: (
            <Layout requiresAuth>
                <EditScenario />
            </Layout>
        ),
    },
    {
        path: `${ROUTES.EDIT_SCENARIO}/:scenarioId`,
        element: (
            <Layout requiresAuth>
                <EditScenario />
            </Layout>
        ),
    },
    {
        path: `${ROUTES.PROFILE}`,
        children: [
            {
                index: true,
                path: '',
                element: (
                    <Layout requiresAuth>
                        <Profile value='localisation'>
                            <Language />
                        </Profile>
                    </Layout>
                ),
            },
            {
                path: 'localisation',
                element: (
                    <Layout requiresAuth>
                        <Profile value='localisation'>
                            <Language />
                        </Profile>
                    </Layout>
                ),
            },
            {
                path: 'appearance',
                element: (
                    <Layout requiresAuth>
                        <Profile value='appearance'>
                            <Appearance />
                        </Profile>
                    </Layout>
                ),
            },
            {
                path: 'security',
                element: (
                    <Layout requiresAuth>
                        <Profile value='security'>
                            <Security />
                        </Profile>
                    </Layout>
                ),
            },
        ],
    },
    {
        path: `${ROUTES.LOGIN}`,
        element: <Login />,
    },
]);

/**
 * Schema for the main navbar.
 * @constant
 * @category Constants
 * @subcategory Router
 */
export const navigation: INavigation = {
    top: [
        {
            label: 'All Historical Data',
            Icon: IconAllData,
            location: ROUTES.ALL_DATA,
        },
        {
            label: 'Transactions',
            Icon: IconTransaction,
            location: '',
            children: [
                {
                    label: 'Upload & View',
                    Icon: IconTransactions,
                    location: ROUTES.TRANSACTIONS,
                },
                {
                    label: 'Categories',
                    Icon: IconCategory,
                    location: ROUTES.CATEGORIES,
                },
            ],
        },
        {
            label: 'Budget',
            Icon: IconBudget,
            location: '',
            children: [
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
                    label: 'Manage Scenarios',
                    Icon: IconManageBudget,
                    location: ROUTES.MANAGE_SCENARIOS,
                },
            ],
        },
    ],
    bottom: [
        {
            label: 'Profile',
            Icon: IconUser,
            location: '',
            defaultExpanded: true,
            children: [
                {
                    label: 'My Cards',
                    Icon: IconManageCards,
                    location: ROUTES.MANAGE_CARDS,
                },
                {
                    label: 'Settings',
                    Icon: IconProfile,
                    location: ROUTES.PROFILE,
                },
                {
                    label: 'Logout',
                    Icon: IconLogout,
                    location: ROUTES.LOGOUT,
                },
            ],
        },
    ],
};

export default router;
