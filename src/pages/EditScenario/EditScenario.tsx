import { FC, useEffect, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';

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

import { IScenario } from '../../types/Scenario.types';

import router, { ROUTES } from '../../constants/routerConstants';

import APIService from '../../services/APIService';

import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';

import {
    addScenario,
    scenariosLoading,
    updateScenario,
} from '../../redux/slices/scenarioSlice';
import {
    intakeError,
    writeErrorBoundary,
} from '../../redux/thunks/errorThunks';
import { getActiveCardId } from '../../redux/selectors/cardSelectors';
import { refreshAuthentication } from '../../redux/thunks/authThunks';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import DynamicCardList from '../../components/DynamicCardList';

import DeleteScenario from './components/DeleteScenario';
import TransactorRow from './components/TransactorRow';

import { IProps, ITransactorRowEditable } from './EditScenario.types';

const emptyScenario = () => ({
    id: uuid(),
    userId: '',
    cardId: '',
    startDate: '',
    endDate: '',
    createdOn: '',
    updatedOn: '',
    title: '',
    description: '',
    startBallance: 0,
    transactors: [],
});

/**
 * Displays a page to edit or create a new Scenario.
 * @category Pages
 * @subcategory Edit Scenario
 * @component
 */
const EditScenario: FC<IProps> = () => {
    const [scenario, setScenario] = useState<IScenario>(emptyScenario());
    const [transactors, setTransactors] = useState<ITransactorRowEditable[]>(
        [],
    );

    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const cardId = useAppSelector(getActiveCardId);

    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const location = useLocation();
    const params = useParams();
    const search = useSearchParams();

    const handleClickSave = () => {
        const request = async () => {
            dispatch(scenariosLoading());
            if (isEdit) {
                const response = await APIService.updateSingleScenario(
                    scenario.id,
                    { ...scenario, transactors },
                );
                if (!response || !response.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                dispatch(
                    updateScenario({ scenario: response.payload.scenario }),
                );
            } else {
                const response = await APIService.createSingleScenario({
                    ...scenario,
                    cardId: cardId || '',
                    transactors,
                });
                if (!response || !response.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                dispatch(addScenario({ scenario: response.payload.scenario }));
            }
            setLoading(false);
            router.navigate(ROUTES.MANAGE_SCENARIOS);
        };

        try {
            setLoading(true);
            dispatch(scenariosLoading());
            request();
        } catch (error1: any) {
            if (error1.status == 401) {
                try {
                    dispatch(refreshAuthentication(request));
                } catch (error2: any) {
                    setLoading(false);
                    dispatch(intakeError(error1));
                }
            } else {
                setLoading(false);
                dispatch(intakeError(error1));
            }
        }
    };

    useEffect(() => {
        try {
            const fetchScenario = async (scenarioId: string) => {
                const response = await APIService.getSingleScenario(scenarioId);
                if (!response || !response.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                setScenario(response.payload.scenario);
                setTransactors(
                    response.payload.scenario.transactors.map((transactor) => ({
                        ...transactor,
                        staged: false,
                        deleted: false,
                    })),
                );
                setLoading(false);
            };
            if ('scenarioId' in params) {
                fetchScenario(String(params.scenarioId));
                setIsEdit(true);
            } else {
                if (
                    new RegExp(ROUTES.EDIT_SCENARIO, 'gi').test(
                        location.pathname,
                    )
                ) {
                    dispatch(
                        writeErrorBoundary({
                            title: t('Scenario.notFound'),
                            message: `${t('Scenario.notFoundWithId', { scenarioId: scenario.id })}`,
                            error: t('errors.notFound'),
                        }),
                    );
                }
                const templateId = search[0].get('templateId');
                if (templateId) {
                    fetchScenario(String(templateId));
                    setIsEdit(false);
                } else {
                    setLoading(false);
                }
            }
        } catch (error: any) {
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
                    href={ROUTES.MANAGE_SCENARIOS}
                    sx={{ alignSelf: 'flex-start', mt: '32px' }}
                    variant='text'
                >
                    <IconArrowLeft /> {t('Scenario.returnToAllScenarios')}
                </Button>
                <Typography variant='h2' sx={{ margin: '8px 0 32px' }}>
                    {isEdit ? t('literals.Edit') : t('literals.Create')}{' '}
                    {t('literals.Scenario')}
                </Typography>
                <TextField
                    label={t('literals.Title')}
                    onChange={(event) =>
                        setScenario({ ...scenario, title: event.target.value })
                    }
                    value={scenario.title}
                />
                <TextField
                    label={t('Scenario.description')}
                    onChange={(event) =>
                        setScenario({
                            ...scenario,
                            description: event.target.value,
                        })
                    }
                    value={scenario.description}
                />
                <DynamicCardList layout='list'>
                    {transactors.map((datum) => (
                        <TransactorRow
                            key={datum.id}
                            setTransactors={setTransactors}
                            transactor={datum}
                            transactors={transactors}
                        />
                    ))}
                    <Button
                        onClick={() =>
                            setTransactors([
                                ...transactors,
                                {
                                    createdOn: '',
                                    description: '',
                                    id: uuid(),
                                    isAddition: true,
                                    scenarioId: '',
                                    schedulers: [],
                                    updatedOn: '',
                                    value: 0,
                                    staged: true,
                                    deleted: false,
                                } as ITransactorRowEditable,
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
                        : t('buttons.createNewScenario')}
                </Button>
                {isEdit && <DeleteScenario scenario={scenario} />}
            </Box>
        </ResponsiveContainer>
    );
};

export default EditScenario;
