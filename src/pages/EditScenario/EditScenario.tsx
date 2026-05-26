import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams, useSearchParams } from 'react-router';

import {
    Add as IconPlus,
    ArrowBack as IconArrowLeft,
    Save as IconSave,
    ShowChart as IconPreviewTotal,
    SsidChart as IconPreviewCategory,
    WebAssetOff as IconPreviewOff,
} from '@mui/icons-material';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';

import { v4 as uuid } from 'uuid';

import type {
    IProps,
    ITransactorRowEditable,
    TPreviewMode,
} from './EditScenario.types';
import type { IScenario } from '../../types/Scenario.types';

import router, { ROUTES } from '../../constants/routerConstants';
import ResponsiveContainer from '../../hocs/ResponsiveContainer';
import { useAppDispatch, useAppSelector } from '../../hooks/ReduxHookWrappers';
import { getActiveCardId } from '../../redux/selectors/cardSelectors';
import {
    addScenario,
    scenariosLoading,
    updateScenario,
} from '../../redux/slices/scenarioSlice';
import { refreshAuthentication } from '../../redux/thunks/authThunks';
import {
    intakeError,
    writeErrorBoundary,
} from '../../redux/thunks/errorThunks';
import APIService from '../../services/APIService';
import { ffBlankTransactorRowEditable } from '../../utils/factoryFunctions';

import DeleteScenario from './components/DeleteScenario';
import ProjectionChart from './components/ProjectionChart';
import TransactorTable from './components/TransactorTable/TransactorTable';

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

    const [scenarioLoading, setScenarioLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [previewMode, setPreviewMode] = useState<TPreviewMode>('category');

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
                if (!response.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                dispatch(
                    updateScenario({ scenario: response.payload.scenario }),
                );
            } else {
                const response = await APIService.createSingleScenario({
                    ...scenario,
                    cardId: cardId ?? '',
                    transactors,
                });
                if (!response.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                dispatch(addScenario({ scenario: response.payload.scenario }));
            }
            setScenarioLoading(false);
            router.navigate(ROUTES.MANAGE_SCENARIOS);
        };

        try {
            setScenarioLoading(true);
            dispatch(scenariosLoading());
            request();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error1: any) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (error1.status == 401) {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    dispatch(refreshAuthentication(request));
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                } catch (error2: any) {
                    setScenarioLoading(false);
                    dispatch(intakeError(error1));
                }
            } else {
                setScenarioLoading(false);
                dispatch(intakeError(error1));
            }
        }
    };

    useEffect(() => {
        try {
            const fetchScenario = async (scenarioId: string) => {
                const scenarioResponse =
                    await APIService.getSingleScenario(scenarioId);
                if (!scenarioResponse.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                setScenario(scenarioResponse.payload.scenario);
                setTransactors(
                    scenarioResponse.payload.scenario.transactors.map(
                        (transactor) => ({
                            ...transactor,
                            staged: false,
                            deleted: false,
                        }),
                    ),
                );
                setScenarioLoading(false);
            };
            if ('scenarioId' in params) {
                fetchScenario(String(params.scenarioId));
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setIsEdit(true);
            } else {
                if (
                    // eslint-disable-next-line security/detect-non-literal-regexp
                    new RegExp(ROUTES.EDIT_SCENARIO, 'gi').test(
                        location.pathname,
                    )
                ) {
                    dispatch(
                        writeErrorBoundary({
                            title: t('Scenario.notFound'),
                            message: t('Scenario.notFoundWithId', {
                                scenarioId: scenario.id,
                            }),
                            error: t('errors.notFound'),
                        }),
                    );
                }
                const templateId = search[0].get('templateId');
                if (templateId) {
                    fetchScenario(templateId);
                    setIsEdit(false);
                } else {
                    setScenarioLoading(false);
                }
            }
        } catch (error) {
            dispatch(intakeError(error));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, scenario.id, t]);

    const loading = scenarioLoading;

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
                    onChange={(event) => {
                        setScenario({ ...scenario, title: event.target.value });
                    }}
                    value={scenario.title}
                />
                <TextField
                    label={t('Scenario.description')}
                    onChange={(event) => {
                        setScenario({
                            ...scenario,
                            description: event.target.value,
                        });
                    }}
                    value={scenario.description}
                />
                <Typography component='label' htmlFor='preview-control'>
                    Preview mode
                </Typography>
                <ToggleButtonGroup
                    exclusive
                    id='preview-control'
                    onChange={(_, value) => {
                        setPreviewMode(value as TPreviewMode);
                    }}
                    size='small'
                    value={previewMode}
                >
                    <ToggleButton key='category' value='category'>
                        <IconPreviewCategory /> value by category
                    </ToggleButton>
                    <ToggleButton key='total' value='total'>
                        <IconPreviewTotal /> total value
                    </ToggleButton>
                    <ToggleButton key='off' value='off'>
                        <IconPreviewOff /> off
                    </ToggleButton>
                </ToggleButtonGroup>
                {previewMode === 'off' ? null : (
                    <ProjectionChart previewMode={previewMode} />
                )}
                <TransactorTable
                    setTransactors={setTransactors}
                    transactors={transactors}
                />
                <Button
                    onClick={() => {
                        setTransactors([
                            ...transactors,
                            ffBlankTransactorRowEditable(),
                        ]);
                    }}
                >
                    <IconPlus /> {t('buttons.addBudgetRow')}
                </Button>
                <Button
                    onClick={handleClickSave}
                    startIcon={<IconSave />}
                    sx={{
                        position: 'fixed',
                        right: '16px',
                        bottom: '16px',
                    }}
                    variant='contained'
                >
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
