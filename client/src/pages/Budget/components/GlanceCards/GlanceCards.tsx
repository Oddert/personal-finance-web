import { FC, useEffect, useMemo, useState } from 'react';

import { Box, Paper, Typography } from '@mui/material';

import { monthBudget } from '../../Budget';

import { IProps } from './GlanceCards.types';
import { normaliseNum } from '../../BudgetUtils';
import { IBudgetDatum } from '../../Budget.types';

const GlanceCards: FC<IProps> = ({ data }) => {
    const [actualSpend, setActualSpend] = useState(0);
    const [largestOverspendPc, setLargestOverspendPc] = useState<IBudgetDatum>(data[0]);
    const [largestOverspendVal, setLargestOverspendVal] = useState<IBudgetDatum>(data[0]);
    const [numUnderSpend, setNumUnderspend] = useState(0)
    const [numOverSpend, setNumOverSpend] = useState(0)

    useEffect(() => {
        const {
            _actualSpend,
            _overSpendPc,
            _overSpendVal,
            _numUnderSpend,
            _numOverSpend,
        } = data.reduce(
            (accumulator, datum) => {
                accumulator._actualSpend += datum.spend;
                if (datum.diffPc > accumulator._overSpendPc.diffPc) {
                    accumulator._overSpendPc = datum;
                }
                if (datum.diffInt > accumulator._overSpendPc.diffInt) {
                    accumulator._overSpendVal = datum;
                }
                if (datum.diffPc < 0) {
                    accumulator._numUnderSpend += 1;
                }
                if (datum.diffPc > 0) {
                    accumulator._numOverSpend += 1;
                }
                return accumulator
            },
            {
                _actualSpend: 0,
                _overSpendPc: data[0],
                _overSpendVal: data[0],
                _numUnderSpend: 0,
                _numOverSpend: 0,
            },
        )
        setActualSpend(normaliseNum(_actualSpend))
        setLargestOverspendPc(_overSpendPc)
        setLargestOverspendVal(_overSpendVal)
        setNumUnderspend(_numUnderSpend)
        setNumOverSpend(_numOverSpend)
    }, [data])
    
    const expectedSpend = useMemo(() => 
        Object.values(monthBudget).reduce(
            (a, e) => a + e.value,
            0,
        ),
        [],
    );

    const spendDiff = useMemo(() => 
        normaliseNum(actualSpend - expectedSpend),
        [actualSpend, expectedSpend],
    );

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gridGap: '32px',
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
                    {spendDiff < 0 ? '-' : '+'} £{spendDiff} {spendDiff < 0 ? 'bellow' : 'above'} budget
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
                <Typography>
                    Largest overspend
                </Typography>
                <Typography>
                    By percent: <Typography component='span' sx={{ fontWeight: 'bold' }}>{
                        largestOverspendPc.categoryName
                    } (+ {largestOverspendPc.diffPc}%)</Typography>
                </Typography>
                <Typography>
                    By value: <Typography component='span' sx={{ fontWeight: 'bold' }}>{
                        largestOverspendVal.categoryName
                    } (+ £{largestOverspendVal.diffInt})</Typography>
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
                <Typography>
                    Number of categories over budget: {numOverSpend}
                </Typography>
                <Typography>
                    Number of categories under budget: {numUnderSpend}
                </Typography>
            </Paper>
        </Box>
    )
}

export default GlanceCards;
