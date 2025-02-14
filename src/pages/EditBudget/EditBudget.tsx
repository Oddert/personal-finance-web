import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
} from '@mui/material';
import {
    Add as IconPlus,
    ArrowBack as IconArrowLeft,
    Save as IconSave,
} from '@mui/icons-material';

import { IBudget, IBudgetRow } from '../../types/Budget.types';

import router, { ROUTES } from '../../constants/routerConstants';

import APIService from '../../services/APIService';

import { useAppDispatch } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { addBudget, budgetLoading } from '../../redux/slices/budgetSlice';
import {
    intakeError,
    writeErrorBoundary,
} from '../../redux/thunks/errorThunks';

import DynamicCardList from '../../components/DynamicCardList';

import BudgetRow from './components/BudgetRow';
import DeleteBudget from './components/DeleteBudget';

import { IBudgetRowEditable, IProps } from './EditBudget.types';

/**
 * Creates a blank Budget Row.
 * @param id The temporary ID.
 * @returns An empty budget row object.
 */
const createEmptyBudget = (id: number): IBudget => ({
    id,
    name: '',
    shortDescription: '',
    longDescription: '',
    isDefault: false,
    createdOn: new Date().toISOString(),
    updatedOn: new Date().toISOString(),
    budgetRows: [],
    cardId: null,
});

/**
 * Page to create or edit Budgets.
 * @category Pages
 * @subcategory Edit Budget
 * @component
 */
const EditBudget: FC<IProps> = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [budget, setBudget] = useState<IBudget>(createEmptyBudget(-1));
    const [budgetRows, setBudgetRows] = useState<IBudgetRowEditable[]>([]);

    const location = useLocation();
    const params = useParams();
    const search = useSearchParams();

    const handleClickSave = () => {
        try {
            setLoading(true);
            dispatch(budgetLoading());
            const request = async () => {
                if (isEdit) {
                    const response = await APIService.updateSingleBudget(
                        { ...budget, budgetRows },
                        budget.id,
                    );

                    if (!response || !response.payload) {
                        throw new Error(t('modalMessages.noServerResponse'));
                    }
                    dispatch(addBudget({ budget: response.payload.budget }));
                } else {
                    const response = await APIService.createSingleBudget({
                        ...budget,
                        budgetRows,
                    });

                    if (!response || !response.payload) {
                        throw new Error(t('modalMessages.noServerResponse'));
                    }
                    dispatch(addBudget({ budget: response.payload.budget }));
                }
                router.navigate(ROUTES.MANAGE_BUDGETS);
            };
            request();
        } catch (error) {
            console.error(error);
            setLoading(false);
            dispatch(intakeError(error));
        }
    };

    useEffect(() => {
        try {
            const fetchBudget = async (budgetId: number) => {
                const response = await APIService.getSingleBudget(budgetId);
                if (!response || !response.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                setBudget({
                    ...(response.payload.budget as IBudget),
                    budgetRows: [],
                });
                setBudgetRows(
                    response.payload.budget.budgetRows.map(
                        (budgetRow: IBudgetRow) => ({
                            ...budgetRow,
                            staged: false,
                            deleted: false,
                        }),
                    ),
                );
                setLoading(false);
            };
            if ('budgetId' in params) {
                fetchBudget(Number(params.budgetId));
                setIsEdit(true);
            } else {
                if (
                    new RegExp(ROUTES.EDIT_BUDGET, 'gi').test(location.pathname)
                ) {
                    dispatch(
                        writeErrorBoundary({
                            title: t('Budget.notFound'),
                            message: `${t('Budget.notFoundWithId')} "${budget.id}".`,
                            error: t('errors.notFound'),
                        }),
                    );
                }
                const templateId = search[0].get('templateId');
                if (templateId) {
                    fetchBudget(Number(templateId));
                    setIsEdit(false);
                } else {
                    setLoading(false);
                }
            }
        } catch (error: any) {
            console.error(error);
            dispatch(intakeError(error));
        }
    }, [t]);

    if (loading) {
        return (
            <ResponsiveContainer>
                <CircularProgress sx={{ mt: '64px' }} />
            </ResponsiveContainer>
        );
    }

    return (
        <ResponsiveContainer>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gridGap: '16px',
                    padding: '0 0 64px 0',
                }}
            >
                <Button
                    href={ROUTES.MANAGE_BUDGETS}
                    sx={{ alignSelf: 'flex-start', mt: '32px' }}
                    variant='text'
                >
                    <IconArrowLeft /> {t('Budget.returnToAllBudgets')}
                </Button>
                <Typography variant='h2' sx={{ margin: '8px 0 32px' }}>
                    {isEdit ? t('literals.Edit') : t('literals.Create')}{' '}
                    {t('literals.Budget')}
                </Typography>
                <TextField
                    label={t('literals.Title')}
                    onChange={(event) =>
                        setBudget({ ...budget, name: event.target.value })
                    }
                    value={budget.name}
                />
                <TextField
                    label={t('Budget.tagLine')}
                    onChange={(event) =>
                        setBudget({
                            ...budget,
                            shortDescription: event.target.value,
                        })
                    }
                    value={budget.shortDescription}
                />
                <TextField
                    label={t('literals.Description')}
                    onChange={(event) =>
                        setBudget({
                            ...budget,
                            longDescription: event.target.value,
                        })
                    }
                    value={budget.longDescription}
                />
                <DynamicCardList layout='list'>
                    {budgetRows.map((datum, idx) => (
                        <BudgetRow
                            budgetRows={budgetRows}
                            budgetRow={datum}
                            key={idx}
                            setBudgetRows={setBudgetRows}
                        />
                    ))}
                    <Button
                        onClick={() =>
                            setBudgetRows([
                                ...budgetRows,
                                {
                                    id: budgetRows.length + 10,
                                    label: '',
                                    categoryId: -1,
                                    value: 20,
                                    varLowPc: 10,
                                    varHighPc: 10,
                                    staged: true,
                                    deleted: false,
                                    colour: '#fff',
                                },
                            ])
                        }
                    >
                        <IconPlus /> {t('buttons.addBudgetRow')}
                    </Button>
                </DynamicCardList>
                <Button
                    onClick={handleClickSave}
                    sx={{
                        position: 'fixed',
                        right: '16px',
                        bottom: '16px',
                    }}
                    variant='contained'
                >
                    <IconSave />{' '}
                    {isEdit
                        ? t('buttons.saveChanges')
                        : t('buttons.createBudget')}
                </Button>
                {isEdit && <DeleteBudget budget={budget} />}
            </Box>
        </ResponsiveContainer>
    );
};

export default EditBudget;
