import { FC, useEffect, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';

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

import { useAppDispatch } from '../../hooks/ReduxHookWrappers';

import {
    addScenario,
    scenariosLoading,
} from '../../redux/slices/scenarioSlice';
import {
    intakeError,
    writeErrorBoundary,
} from '../../redux/thunks/errorThunks';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import DynamicCardList from '../../components/DynamicCardList';

import { IProps } from './EditScenario.types';
import APIService from '../../services/APIService';

const emptyScenario = () => ({
    id: '',
    startDate: '',
    endDate: '',
    createdOn: '',
    updatedOn: '',
    title: '',
    description: '',
    startBallance: 0,
    transactors: [],
});

const EditScenario: FC<IProps> = () => {
    const [scenario, setScenario] = useState<IScenario>(emptyScenario());

    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const location = useLocation();
    const params = useParams();
    const search = useSearchParams();

    const handleClickSave = () => {
        try {
            setLoading(true);
            dispatch(scenariosLoading());
            const request = async () => {
                dispatch(scenariosLoading());
                if (isEdit) {
                    const response = await APIService.updateSingleScenario(
                        scenario.id,
                        scenario,
                    );
                    if (!response || !response.payload) {
                        throw new Error(t('modalMessages.noServerResponse'));
                    }
                    dispatch(
                        addScenario({ scenario: response.payload.scenario }),
                    );
                } else {
                    const response =
                        await APIService.createSingleScenario(scenario);
                    if (!response || !response.payload) {
                        throw new Error(t('modalMessages.noServerResponse'));
                    }
                    dispatch(
                        addScenario({ scenario: response.payload.scenario }),
                    );
                }
                router.navigate(ROUTES.MANAGE_SCENARIOS);
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
            const fetchScenario = async (scenarioId: string) => {
                console.log(scenarioId);
                const response = await APIService.getSingleScenario(scenarioId);
                if (!response || !response.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                setScenario(response.payload.scenario);
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
                            message: `${t('Scenario.notFoundWithId')} "${scenario.id}".`,
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
                    {/* {budgetRows.map((datum, idx) => (
                        <BudgetRow
                            budgetRows={budgetRows}
                            budgetRow={datum}
                            key={idx}
                            setBudgetRows={setBudgetRows}
                        />
                    ))} */}
                    <Button
                        onClick={() =>
                            // setBudgetRows([
                            //     ...budgetRows,
                            //     {
                            //         id: uuid(),
                            //         label: '',
                            //         categoryId: '-1',
                            //         value: 20,
                            //         varLowPc: 10,
                            //         varHighPc: 10,
                            //         staged: true,
                            //         deleted: false,
                            //         colour: '#fff',
                            //     },
                            // ])
                            null
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
                {/* {isEdit && <DeleteBudget scenario={scenario} />} */}
            </Box>
        </ResponsiveContainer>
    );
};

export default EditScenario;
