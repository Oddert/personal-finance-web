import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

import {
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import {
    ArrowBack as IconArrowLeft,
    Save as IconSave,
} from '@mui/icons-material';

import { ICard, ICardTypes } from '../../types/Card.types';

import router, { ROUTES } from '../../constants/routerConstants';

import APIService from '../../services/APIService';

import { useAppDispatch } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { budgetLoading } from '../../redux/slices/budgetSlice';
import { addCard, updateCard } from '../../redux/slices/cardSlice';
import {
    intakeError,
    writeErrorBoundary,
} from '../../redux/thunks/errorThunks';

import DeleteCard from './components/DeleteCard';
import EditImageIcon from './components/EditImageIcon';

import { IProps } from './EditCard.types';
import { refreshAuthentication } from '../../redux/thunks/authThunks';

/**
 * Creates a blank Budget Row.
 * @param id The temporary ID.
 * @returns An empty card row object.
 */
const createEmptyBudget = (id: string): ICard => ({
    id,
    isDefault: false,
    cardName: '',
    cardType: 'DEBIT',
    bankName: '',
    sortCode: 0,
    cardNumber: 0,
    expires: 0,
    description: '',
    icon: '',
    coverImage: '',
    createdOn: '',
    updatedOn: '',
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
    const theme = useTheme();

    const [loading, setLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [card, setCard] = useState<ICard>(createEmptyBudget('-1'));

    const location = useLocation();
    const params = useParams();
    const search = useSearchParams();

    const handleClickSave = () => {
        const request = async () => {
            if (isEdit) {
                const response = await APIService.updateSingleCard(
                    { ...card },
                    card.id,
                );

                if (!response || !response.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                dispatch(updateCard({ card: response.payload.card }));
            } else {
                const response = await APIService.createSingleCard({
                    ...card,
                });

                if (!response || !response.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                dispatch(addCard({ card: response.payload.card }));
            }
            router.navigate(ROUTES.MANAGE_CARDS);
        };

        try {
            setLoading(true);
            dispatch(budgetLoading());
            request();
        } catch (error1: any) {
            if (error1.status === 401) {
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
            const fetchCard = async (cardId: string) => {
                const response = await APIService.getSingleCard(cardId);
                if (!response || !response.payload) {
                    throw new Error(t('modalMessages.noServerResponse'));
                }
                setCard(response.payload.card);
                setLoading(false);
            };
            if ('cardId' in params) {
                fetchCard(String(params.cardId));
                setIsEdit(true);
            } else {
                if (
                    new RegExp(ROUTES.EDIT_CARD, 'gi').test(location.pathname)
                ) {
                    dispatch(
                        writeErrorBoundary({
                            title: t('Card.notFound'),
                            message: `${t('Card.notFoundWithId')} "${card.id}".`,
                            error: t('errors.notFound'),
                        }),
                    );
                }
                const templateId = search[0].get('templateId');
                if (templateId) {
                    fetchCard(String(templateId));
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
                    href={ROUTES.MANAGE_CARDS}
                    sx={{ alignSelf: 'flex-start', mt: '32px' }}
                    variant='text'
                >
                    <IconArrowLeft /> {t('Card.returnToAllCards')}
                </Button>
                <Typography variant='h2' sx={{ margin: '8px 0 32px' }}>
                    {isEdit ? t('literals.Edit') : t('literals.Create')}{' '}
                    {t('literals.Card')}
                </Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gridGap: '64px',
                    }}
                >
                    <Paper
                        sx={{
                            display: 'grid',
                            gridTemplateRows: '1fr 1fr',
                            gridTemplateColumns: '1fr 1fr',
                            gridGap: '32px',
                            aspectRatio: '8.56 / 5',
                            p: 4,
                            borderRadius: '16px',
                            backgroundSize: 'cover',
                            ...(card.coverImage
                                ? {
                                      backgroundImage: `url("${card.coverImage}") !important`,
                                  }
                                : {}),
                        }}
                    >
                        <TextField
                            label={t('Card.bankNameLabel')}
                            onChange={(event) =>
                                setCard({
                                    ...card,
                                    bankName: event.target.value,
                                })
                            }
                            sx={{
                                background: theme.palette.secondary.main,
                                alignSelf: 'start',
                            }}
                            value={card.bankName}
                        />
                        <Select<ICardTypes>
                            onChange={(event) =>
                                setCard({
                                    ...card,
                                    cardType: event.target.value as ICardTypes,
                                })
                            }
                            sx={{
                                justifySelf: 'end',
                                minWidth: '50px',
                                alignSelf: 'start',
                                background: theme.palette.secondary.main,
                            }}
                            value={card.cardType}
                        >
                            <MenuItem value={'OTHER'}>
                                {t('buttons.otherUnset')}
                            </MenuItem>
                            <MenuItem value={'DEBIT'}>
                                {t('literals.Debit')}
                            </MenuItem>
                            <MenuItem value={'CREDIT'}>
                                {t('literals.Credit')}
                            </MenuItem>
                        </Select>
                        <TextField
                            label={t('Card.cardNumberLabel')}
                            onChange={(event) =>
                                setCard({
                                    ...card,
                                    cardNumber: Number(event.target.value),
                                })
                            }
                            sx={{
                                alignSelf: 'end',
                                background: theme.palette.secondary.main,
                            }}
                            type='number'
                            value={card.cardNumber}
                        />
                        <TextField
                            label={t('Card.sortCodeLabel')}
                            onChange={(event) =>
                                setCard({
                                    ...card,
                                    sortCode: Number(event.target.value),
                                })
                            }
                            sx={{
                                alignSelf: 'end',
                                background: theme.palette.secondary.main,
                            }}
                            type='number'
                            value={card.sortCode}
                        />
                    </Paper>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gridGap: '16px',
                        }}
                    >
                        <TextField
                            label='Title'
                            onChange={(event) =>
                                setCard({
                                    ...card,
                                    cardName: event.target.value,
                                })
                            }
                            value={card.cardName}
                        />
                        <TextField
                            label={t('literals.Description')}
                            minRows={3}
                            multiline
                            onChange={(event) =>
                                setCard({
                                    ...card,
                                    description: event.target.value,
                                })
                            }
                            value={card.description}
                        />
                        <Box sx={{ display: 'flex' }}>
                            <EditImageIcon
                                label='Icon'
                                onConfirmChange={(url: string | null) => {
                                    if (url) {
                                        setCard({ ...card, icon: url });
                                    } else {
                                        setCard({ ...card, icon: '' });
                                    }
                                }}
                                size='sm'
                                url={card.icon}
                            />
                            <EditImageIcon
                                label={t('literals.Background')}
                                onConfirmChange={(url: string | null) => {
                                    if (url) {
                                        setCard({ ...card, coverImage: url });
                                    } else {
                                        setCard({ ...card, coverImage: '' });
                                    }
                                }}
                                size='md'
                                url={card.coverImage}
                            />
                        </Box>
                    </Box>
                </Box>
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
                        : t('buttons.createCard')}
                </Button>
                {isEdit && <DeleteCard card={card} />}
            </Box>
        </ResponsiveContainer>
    );
};

export default EditBudget;
