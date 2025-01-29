import { FC, Fragment, useEffect, useMemo, useState } from 'react';

import {
    Box,
    CircularProgress,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material';

import type { IBudgetDatum } from '../../../../types/Budget.types';

import { CURRENCY_SYMBOL } from '../../../../constants/appConstants';

import { normaliseNum } from '../../../../utils/mathsUtils';

import type { IProps } from './GlanceCards.types';

/**
 * A series of 'at-a-glance' cards, presenting high-level insights.
 * @category Pages
 * @subcategory Budget Breakdown
 * @component
 */
const GlanceCards: FC<IProps> = ({ data, monthBudget, numMonths }) => {
    const [actualSpend, setActualSpend] = useState(0);
    const [largestOverspendPc, setLargestOverspendPc] =
        useState<IBudgetDatum | null>(null);
    const [largestOverspendVal, setLargestOverspendVal] =
        useState<IBudgetDatum | null>(null);
    const [numUnderSpend, setNumUnderspend] = useState<IBudgetDatum[]>([]);
    const [numOverSpend, setNumOverSpend] = useState<IBudgetDatum[]>([]);

    useEffect(() => {
        interface IAccumulator {
            nextActualSpend: number;
            nextOverSpendPc: IBudgetDatum;
            nextOverSpendVal: IBudgetDatum;
            nextNumUnderSpend: IBudgetDatum[];
            nextNumOverSpend: IBudgetDatum[];
        }

        const {
            nextActualSpend,
            nextOverSpendPc,
            nextOverSpendVal,
            nextNumUnderSpend,
            nextNumOverSpend,
        } = data.reduce(
            (accumulator: IAccumulator, datum) => {
                accumulator.nextActualSpend += datum.spend;
                if (datum.diffPc > accumulator.nextOverSpendPc.diffPc) {
                    accumulator.nextOverSpendPc = datum;
                }
                if (datum.diffFloat > accumulator.nextOverSpendVal.diffFloat) {
                    accumulator.nextOverSpendVal = datum;
                }
                if (datum.diffPc < 0 && datum.diffPc <= datum.variance[0]) {
                    accumulator.nextNumUnderSpend.push(datum);
                }
                if (datum.diffPc > 0 && datum.diffPc >= datum.variance[1]) {
                    accumulator.nextNumOverSpend.push(datum);
                }
                return accumulator;
            },
            {
                nextActualSpend: 0,
                nextOverSpendPc: data[0],
                nextOverSpendVal: data[0],
                nextNumUnderSpend: [],
                nextNumOverSpend: [],
            },
        );
        setActualSpend(normaliseNum(nextActualSpend));
        setLargestOverspendPc(nextOverSpendPc);
        setLargestOverspendVal(nextOverSpendVal);
        setNumUnderspend(nextNumUnderSpend);
        setNumOverSpend(nextNumOverSpend);
    }, [data]);

    const expectedSpend = useMemo(() => {
        if (monthBudget) {
            return (
                monthBudget.budgetRows.reduce(
                    (a: number, e) => a + e.value,
                    0,
                ) * numMonths
            );
        }
        return 0;
    }, [monthBudget, numMonths]);

    const spendDiff = useMemo(
        () => normaliseNum(actualSpend - expectedSpend),
        [actualSpend, expectedSpend],
    );

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gridGap: '16px 32px',
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    padding: '16px 32px',
                }}
            >
                <Typography sx={{ fontSize: '1.3rem' }}>
                    Total expected spend: {expectedSpend}
                </Typography>
                <Typography sx={{ fontSize: '1.3rem' }}>
                    Total actual spend: {actualSpend}
                </Typography>
            </Paper>
            <Paper
                elevation={0}
                sx={{
                    padding: '16px 32px',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Typography sx={{ fontSize: '1.3rem' }}>
                    {spendDiff < 0 ? '-' : '+'} {CURRENCY_SYMBOL}
                    {spendDiff} {spendDiff < 0 ? 'bellow' : 'above'} budget
                </Typography>
            </Paper>
            <Paper
                elevation={0}
                sx={{
                    padding: '16px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                }}
            >
                {largestOverspendPc && largestOverspendVal ? (
                    <Fragment>
                        <Typography>Largest overspend</Typography>
                        <Typography>
                            By percent:{' '}
                            <Typography
                                component='span'
                                sx={{ fontWeight: 'bold' }}
                            >
                                {largestOverspendPc.categoryName} (+{' '}
                                {largestOverspendPc.diffPc}%)
                            </Typography>
                        </Typography>
                        <Typography>
                            By value:{' '}
                            <Typography
                                component='span'
                                sx={{ fontWeight: 'bold' }}
                            >
                                {largestOverspendVal.categoryName} (+{' '}
                                {CURRENCY_SYMBOL}
                                {largestOverspendVal.diffFloat})
                            </Typography>
                        </Typography>
                    </Fragment>
                ) : (
                    <CircularProgress />
                )}
            </Paper>
            <Paper
                elevation={0}
                sx={{
                    padding: '16px 32px',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Tooltip
                    title={numOverSpend
                        .map((datum) => datum.categoryName)
                        .join(', ')}
                >
                    <Typography>
                        Number of categories over budget: {numOverSpend.length}
                    </Typography>
                </Tooltip>
                <Tooltip
                    title={numUnderSpend
                        .map((datum) => datum.categoryName)
                        .join(', ')}
                >
                    <Typography>
                        Number of categories under budget:{' '}
                        {numUnderSpend.length}
                    </Typography>
                </Tooltip>
            </Paper>
        </Box>
    );
};

export default GlanceCards;
