import { FC, useEffect, useMemo, useState } from 'react';

import { Box, Paper, Tooltip, Typography } from '@mui/material';

import type { IBudgetDatum } from '../../../../types/Budget.types';

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
    const [largestOverspendPc, setLargestOverspendPc] = useState<IBudgetDatum>(
        data[0],
    );
    const [largestOverspendVal, setLargestOverspendVal] =
        useState<IBudgetDatum>(data[0]);
    const [numUnderSpend, setNumUnderspend] = useState<IBudgetDatum[]>([]);
    const [numOverSpend, setNumOverSpend] = useState<IBudgetDatum[]>([]);

    useEffect(() => {
        interface IAccumulator {
            _actualSpend: number;
            _overSpendPc: IBudgetDatum;
            _overSpendVal: IBudgetDatum;
            _numUnderSpend: IBudgetDatum[];
            _numOverSpend: IBudgetDatum[];
        }

        const {
            _actualSpend,
            _overSpendPc,
            _overSpendVal,
            _numUnderSpend,
            _numOverSpend,
        } = data.reduce(
            (accumulator: IAccumulator, datum) => {
                accumulator._actualSpend += datum.spend;
                if (datum.diffPc > accumulator._overSpendPc.diffPc) {
                    accumulator._overSpendPc = datum;
                }
                if (datum.diffFloat > accumulator._overSpendVal.diffFloat) {
                    accumulator._overSpendVal = datum;
                }
                if (datum.diffPc < 0 && datum.diffPc <= datum.variance[0]) {
                    accumulator._numUnderSpend.push(datum);
                }
                if (datum.diffPc > 0 && datum.diffPc >= datum.variance[1]) {
                    accumulator._numOverSpend.push(datum);
                }
                return accumulator;
            },
            {
                _actualSpend: 0,
                _overSpendPc: data[0],
                _overSpendVal: data[0],
                _numUnderSpend: [],
                _numOverSpend: [],
            },
        );
        setActualSpend(normaliseNum(_actualSpend));
        setLargestOverspendPc(_overSpendPc);
        setLargestOverspendVal(_overSpendVal);
        setNumUnderspend(_numUnderSpend);
        setNumOverSpend(_numOverSpend);
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
                    {spendDiff < 0 ? '-' : '+'} £{spendDiff}{' '}
                    {spendDiff < 0 ? 'bellow' : 'above'} budget
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
                <Typography>Largest overspend</Typography>
                <Typography>
                    By percent:{' '}
                    <Typography component='span' sx={{ fontWeight: 'bold' }}>
                        {largestOverspendPc.categoryName} (+{' '}
                        {largestOverspendPc.diffPc}%)
                    </Typography>
                </Typography>
                <Typography>
                    By value:{' '}
                    <Typography component='span' sx={{ fontWeight: 'bold' }}>
                        {largestOverspendVal.categoryName} (+ £
                        {largestOverspendVal.diffFloat})
                    </Typography>
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
