import { FC, useEffect, useState } from 'react';
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
    ArrowBack as ArrowLeftIcon,
    Save as SaveIcon,
} from '@mui/icons-material';

import { ICard, ICardTypes } from '../../types/Card.types';

import router, { ROUTES } from '../../constants/routerConstants';

import APIService from '../../services/APIService';

import { useAppDispatch } from '../../hooks/ReduxHookWrappers';

import ResponsiveContainer from '../../hocs/ResponsiveContainer';

import { budgetLoading } from '../../redux/slices/budgetSlice';
import { addCard } from '../../redux/slices/cardSlice';
import {
    intakeError,
    writeErrorBoundary,
} from '../../redux/thunks/errorThunks';

import DeleteCard from './components/DeleteCard';
import EditImageIcon from './components/EditImageIcon';

import { IProps } from './EditCard.types';

/**
 * Creates a blank Budget Row.
 * @param id The temporary ID.
 * @returns An empty card row object.
 */
const createEmptyBudget = (id: number): ICard => ({
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
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const [loading, setLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [card, setCard] = useState<ICard>(createEmptyBudget(-1));

    const location = useLocation();
    const params = useParams();
    const search = useSearchParams();

    const handleClickSave = () => {
        try {
            setLoading(true);
            dispatch(budgetLoading());
            const request = async () => {
                const response = isEdit
                    ? await APIService.updateSingleCard({ ...card }, card.id)
                    : await APIService.createSingleCard({
                          ...card,
                      });

                if (!response || !response.payload) {
                    throw new Error('No response received from the server.');
                }
                dispatch(addCard({ card: response.payload.card }));
                router.navigate(ROUTES.MANAGE_CARDS);
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
            const fetchCard = async (cardId: number) => {
                const response = await APIService.getSingleCard(cardId);
                if (!response || !response.payload) {
                    throw new Error('No response received from the server.');
                }
                setCard(response.payload.card);
                setLoading(false);
            };
            if ('cardId' in params) {
                fetchCard(Number(params.cardId));
                setIsEdit(true);
            } else {
                if (
                    new RegExp(ROUTES.EDIT_CARD, 'gi').test(location.pathname)
                ) {
                    dispatch(
                        writeErrorBoundary({
                            title: 'Card not Found',
                            message: `No card with ID "${card.id}" found.`,
                            error: 'Not found error',
                        }),
                    );
                }
                const templateId = search[0].get('templateId');
                if (templateId) {
                    fetchCard(Number(templateId));
                    setIsEdit(false);
                } else {
                    setLoading(false);
                }
            }
        } catch (error: any) {
            console.error(error);
            dispatch(intakeError(error));
        }
    }, []);

    if (loading) {
        return (
            <ResponsiveContainer>
                <CircularProgress sx={{ mt: '64px' }} />
            </ResponsiveContainer>
        );
    }
    console.log(card.coverImage);

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
                    <ArrowLeftIcon /> Return to all cards
                </Button>
                <Typography variant='h2' sx={{ margin: '8px 0 32px' }}>
                    {isEdit ? 'Edit ' : 'Create '}Card
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
                            label='Bank Name'
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
                            <MenuItem value={'OTHER'}>Other / unset</MenuItem>
                            <MenuItem value={'DEBIT'}>Debit</MenuItem>
                            <MenuItem value={'CREDIT'}>Credit</MenuItem>
                        </Select>
                        <TextField
                            label='Card Number'
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
                            label='Sort Code'
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
                            label='Description'
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
                                label='Background'
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
                    <SaveIcon /> {isEdit ? 'Save changes' : 'Create card'}
                </Button>
                {isEdit && <DeleteCard card={card} />}
            </Box>
        </ResponsiveContainer>
    );
};

export default EditBudget;
