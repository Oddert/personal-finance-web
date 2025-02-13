import { ChangeEvent, FC, SyntheticEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Autocomplete,
    Box,
    Button,
    ListItem,
    Paper,
    styled,
    TextField,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    DeleteForever as UnDeleteIcon,
} from '@mui/icons-material';

import { getCategoryResponse } from '../../../../redux/selectors/categorySelectors';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';

import ColourBase from '../../../../components/ColourBase';

import type { IProps } from './BudgetRow.types';

const TextFieldStyled = styled(TextField)({});

const inputProps = {
    sx: {
        '& input': {
            py: '10px',
        },
    },
};

/**
 * Displays a single budget row, representing one category and pay constraints.
 * @component
 * @category Pages
 * @subcategory Home
 */
const BudgetRow: FC<IProps> = ({ budgetRows, budgetRow, setBudgetRows }) => {
    const { t } = useTranslation();

    const categories = useAppSelector(getCategoryResponse);

    const categoryOptions = useMemo(
        () =>
            categories.map((category) => ({
                id: category.id,
                label: category.label,
                colour: category.colour,
            })),
        [categories],
    );

    const handleChangeCategory = (
        event: SyntheticEvent,
        value: { id: number; label: string } | null,
    ) => {
        const filteredRows = budgetRows.map((row) => {
            if (row.id === budgetRow.id && value) {
                return {
                    ...row,
                    categoryId: value.id,
                    label: value.label,
                };
            }
            return row;
        });
        setBudgetRows(filteredRows);
    };

    const handleChangeTargetValue = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const filteredRows = budgetRows.map((row) => {
            if (row.id === budgetRow.id) {
                return {
                    ...row,
                    value: Number(event.target.value),
                };
            }
            return row;
        });
        setBudgetRows(filteredRows);
    };

    const handleChangeOverspend = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const filteredRows = budgetRows.map((row) => {
            if (row.id === budgetRow.id) {
                return {
                    ...row,
                    varHighPc: Number(event.target.value),
                };
            }
            return row;
        });
        setBudgetRows(filteredRows);
    };

    const handleChangeUnderspend = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const filteredRows = budgetRows.map((row) => {
            if (row.id === budgetRow.id) {
                return {
                    ...row,
                    varLowPc: Number(event.target.value),
                };
            }
            return row;
        });
        setBudgetRows(filteredRows);
    };

    const handleClickDelete = () => {
        if (budgetRow.staged) {
            setBudgetRows(budgetRows.filter((row) => row.id !== budgetRow.id));
        } else {
            const filteredRows = budgetRows.map((row) => {
                if (row.id === budgetRow.id) {
                    return {
                        ...row,
                        deleted: true,
                    };
                }
                return row;
            });
            setBudgetRows(filteredRows);
        }
    };

    const handleClickUndelete = () => {
        const filteredRows = budgetRows.map((row) => {
            if (row.id === budgetRow.id) {
                return {
                    ...row,
                    deleted: false,
                };
            }
            return row;
        });
        setBudgetRows(filteredRows);
    };

    return (
        <ListItem sx={{ p: 0, mb: 1 }}>
            <Paper
                sx={{
                    width: '100%',
                    p: '8px 16px',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr 1fr 3fr 100px',
                    alignItems: 'center',
                    gridGap: '16px',
                }}
                title={budgetRow.deleted ? t('row deleted') : undefined}
            >
                <ColourBase asButton={false} colour={budgetRow.colour} />
                <Autocomplete
                    disabled={budgetRow.deleted}
                    getOptionKey={(category) => category.id}
                    getOptionLabel={(category) => category.label}
                    isOptionEqualToValue={(opt1, opt2) => opt1.id === opt2.id}
                    onChange={handleChangeCategory}
                    options={categoryOptions}
                    renderInput={(params) => (
                        <TextFieldStyled
                            {...params}
                            label={t('literals.Category')}
                            placeholder='unset'
                            sx={{
                                '& * ': {
                                    textDecoration: budgetRow.deleted
                                        ? 'line-through'
                                        : 'none',
                                },
                            }}
                        />
                    )}
                    value={{
                        id: budgetRow.categoryId,
                        label: budgetRow.label,
                        colour: budgetRow.colour,
                    }}
                />
                <TextFieldStyled
                    disabled={budgetRow.deleted}
                    InputProps={inputProps}
                    label={t('Target spend')}
                    onChange={handleChangeTargetValue}
                    sx={{
                        '& * ': {
                            textDecoration: budgetRow.deleted
                                ? 'line-through'
                                : 'none',
                        },
                    }}
                    type='number'
                    value={budgetRow.value}
                />
                <Box
                    sx={(theme) => ({
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '4px',
                        p: 1,
                        display: 'flex',
                        justifyContent: 'space-around',
                    })}
                >
                    <TextFieldStyled
                        disabled={budgetRow.deleted}
                        InputProps={inputProps}
                        label={t('Budget.overspendLimitPc')}
                        onChange={handleChangeOverspend}
                        sx={{
                            '& * ': {
                                textDecoration: budgetRow.deleted
                                    ? 'line-through'
                                    : 'none',
                            },
                        }}
                        type='number'
                        value={budgetRow.varHighPc}
                    />
                    <TextFieldStyled
                        disabled={budgetRow.deleted}
                        InputProps={inputProps}
                        label={t('Budget.underspendLimitPc')}
                        onChange={handleChangeUnderspend}
                        sx={{
                            '& * ': {
                                textDecoration: budgetRow.deleted
                                    ? 'line-through'
                                    : 'none',
                            },
                        }}
                        type='number'
                        value={budgetRow.varLowPc}
                    />
                </Box>
                {budgetRow.deleted ? (
                    <Button
                        onClick={handleClickUndelete}
                        title={t('Budget.rowDeletedCLickToRestore')}
                    >
                        <UnDeleteIcon />
                    </Button>
                ) : (
                    <Button
                        onClick={handleClickDelete}
                        title={t('Budget.deleteRow')}
                    >
                        <DeleteIcon />
                    </Button>
                )}
            </Paper>
        </ListItem>
    );
};

export default BudgetRow;
