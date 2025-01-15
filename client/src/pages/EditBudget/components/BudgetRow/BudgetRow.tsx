import { ChangeEvent, FC, SyntheticEvent, useMemo } from 'react';

import { Autocomplete, Box, Button, ListItem, Paper, TextField } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

import { getCategoryResponse } from '../../../../redux/selectors/categorySelectors';

import { useAppSelector } from '../../../../hooks/ReduxHookWrappers';

import { IProps } from './BudgetRow.types';

const BudgetRow: FC<IProps> = ({ budgetDatums, budgetRow, setBudgetDatums }) => {
    const categories = useAppSelector(getCategoryResponse);

    const categoryOptions = useMemo(() => categories.map((category) => ({
        id: category.id,
        label: category.label,
    })), [categories]);

    const handleChangeCategory = (event: SyntheticEvent, value: { id: number, label: string } | null) => {
        const filteredRows = budgetDatums.map((row) => {
            if (row.id === budgetRow.id && value) {
                return {
                    ...row,
                    categoryId: value.id,
                    label: value.label
                };
            }
            return row
        });
        setBudgetDatums(filteredRows);
    };

    const handleChangeTargetValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const filteredRows = budgetDatums.map((row) => {
            if (row.id === budgetRow.id) {
                return {
                    ...row,
                    value: Number(event.target.value),
                };
            }
            return row
        });
        setBudgetDatums(filteredRows);
    };

    const handleChangeOverspend = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const filteredRows = budgetDatums.map((row) => {
            if (row.id === budgetRow.id) {
                return {
                    ...row,
                    varHighPc: Number(event.target.value),
                };
            }
            return row
        });
        setBudgetDatums(filteredRows);
    };

    const handleChangeUnderspend = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const filteredRows = budgetDatums.map((row) => {
            if (row.id === budgetRow.id) {
                return {
                    ...row,
                    varLowPc: Number(event.target.value),
                };
            }
            return row
        });
        setBudgetDatums(filteredRows);
    };

    const handleClickDelete = () => {
        if (budgetRow.staged) {
            setBudgetDatums(budgetDatums.filter((row) => row.id !== budgetRow.id));
        } else {
            const filteredRows = budgetDatums.map((row) => {
                if (row.id === budgetRow.id) {
                    return {
                        ...row,
                        deleted: true,
                    };
                }
                return row
            });
            setBudgetDatums(filteredRows);
        }
    };

    return (
        <ListItem sx={{ p: 0 }}>
            <Paper
                sx={{
                    width: '100%',
                    p: '8px 16px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 3fr 100px',
                    alignItems: 'center',
                    gridGap: '16px',
                }}
            >
                <Autocomplete
                    getOptionKey={(category) => category.id}
                    getOptionLabel={(category) => category.label}
                    isOptionEqualToValue={(opt1, opt2) => opt1.id === opt2.id}
                    onChange={handleChangeCategory}
                    options={categoryOptions}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Category'
                            placeholder='unset'
                        />
                    )}
                    sx={{
                        minWidth: '200px',
                    }}
                    value={{ id: budgetRow.categoryId, label: budgetRow.label }}
                />
                <TextField
                    label='Target spend'
                    onChange={handleChangeTargetValue}
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
                    <TextField
                        label='Overspend limit (%)'
                        onChange={handleChangeOverspend}
                        type='number'
                        value={budgetRow.varHighPc}
                    />
                    <TextField
                        label='Underspend limit (%)'
                        onChange={handleChangeUnderspend}
                        type='number'
                        value={budgetRow.varLowPc}
                    />
                </Box>
                <Button onClick={handleClickDelete} title='delete budget row'><DeleteIcon /></Button>
            </Paper>
        </ListItem>
    )
}

export default BudgetRow;
